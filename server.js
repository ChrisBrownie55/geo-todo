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

// load database
const fakeUserDatabase = {
  ['TestUserName'.toLocaleLowerCase()]: {
    password: bcrypt.hashSync('TestPassword123', 10),
    iv: crypto.randomBytes(16)
  }
};

fakeUserDatabase.testusername.todoLists = encrypt(
  JSON.stringify([
    {
      title: 'Stuff',
      todos: [
        { text: 'make this damn authentication work', finished: false },
        { text: 'break my site', finished: true },
        { text: 'be happy', finished: false }
      ]
    },
    {
      title: 'Same stuff',
      todos: [
        { text: 'make this damn authentication work', finished: false },
        { text: 'break my site', finished: true },
        { text: 'be happy', finished: false }
      ]
    }
  ]),
  fakeUserDatabase.testusername.iv
);

server.use(bodyParser.json());
// start server
server
  .post('/auth', (req, res) => {
    // NOT USING REAL DATABASE GETTING COMMANDS
    const { username, password } = req.body;
    const user = fakeUserDatabase[username.toLowerCase()];
    if (!user) {
      res.json({
        error: 'User does not exist'
      });
    } else {
      bcrypt.compare(password, user.password).then(
        match =>
          match
            ? res.json({
                authenticated: true,
                todoLists: JSON.parse(decrypt(user.todoLists, user.iv))
              })
            : res.json({ error: 'Password is incorrect' })
      );
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
