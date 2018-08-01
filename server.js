const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const fs = require('fs');
const path = require('path');
// obtain bundle
const bundle = require('./dist/server.bundle.js');
// get renderer from vue server renderer
const renderer = require('vue-server-renderer').createRenderer({
  // set template
  template: fs.readFileSync('./index.html', 'utf-8')
});

server.use('/dist', express.static(path.join(__dirname, './dist')));

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SECRET =
  process.env.ENCRYPTION_SECRET || 'ccabed93403e9d8828a306de519c23c9';
const ALGORITHM = process.env.ENCRYPTION_ALGORITHM || 'aes-256-ctr';
const encrypt = (data, iv) => {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};
const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, iv);
  return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
};

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
client.connect();

const SqlString = require('sqlstring');
const jwt = require('jsonwebtoken');

// start server
server.use(bodyParser.json());
server
  .post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.json({ error: 'Missing username or password' });
      return;
    }

    const lowerCaseUsername = username.toLocaleLowerCase();

    try {
      const {
        rows: [user]
      } = await client.query(
        SqlString.format('SELECT * FROM users WHERE username = $1', [
          lowerCaseUsername
        ])
      );

      if (!rows.length) {
        res.status(401).end('User does not exist');
        return;
      }

      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).end('Password is incorrect');
        return;
      }

      res.json({
        todoLists: JSON.parse(decrypt(user.todoLists, user.iv))
      });
    } catch (error) {
      res.status(401).end('Cannot login');
    }
  })
  .post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.end('Missing username or password');
      return;
    }

    const lowerCaseUsername = username.toLowerCase();
    try {
      const { rows } = await client.query(
        SqlString.format('SELECT username FROM users WHERE username = $1', [
          lowerCaseUsername
        ])
      );
      if (rows.length > 0) {
        res.status(401).end('User already exists');
        return;
      }

      const iv = crypto.randomBytes(16);
      const hashedPassword = await bcrypt.hash(password, 10);
      const jwt = null; // MAKE A JWT HERE

      await client.query(
        SqlString.format(
          'INSERT INTO users (username, password, iv, jwt) VALUES ($1, $2, $3)',
          [lowerCaseUsername, hashedPassword, iv]
        )
      );
    } catch (error) {
      res.status(401).end('Cannot register');
    }
  })
  .get('*', (req, res) => {
    bundle.default({ url: req.url }).then(
      app => {
        // context to use as data source
        // in the template for interpolation
        const context = {
          title: 'Vue JS - Server Render',
          description: `vuejs server side render`
        };

        renderer.renderToString(app, context, function(err, html) {
          if (err) {
            if (err.code === 404) {
              console.error(err.stack);
              res.status(404).end('Page not found');
            } else {
              console.error(err.stack);
              res.status(500).end('Internal Server Error');
            }
          } else {
            res.end(html);
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  });

const port = parseInt(process.env.PORT || 8080);
server.listen(port);
console.log(`Server started on port ${port}.`);
