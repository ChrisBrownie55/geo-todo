const express = require('express');
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
// load database
const fakeUserDatabase = {
  ['TestUserName'.toLocaleLowerCase()]: {
    password: bcrypt.hashSync('TestPassword123', 10),
    todoLists: [
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
    ]
  }
};

// start server
server
  .post('/auth', (req, res) => {
    res.json({
      authenticated: true,
      todos: [{ text: 'a', checked: true }, { text: 'b', checked: false }]
    });
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
