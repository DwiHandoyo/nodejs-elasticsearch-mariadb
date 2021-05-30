const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const server = Hapi.server({
  port: 5000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});
server.route(routes);
server.start();
console.log(`Server berjalan pada ${server.info.uri}`);

module.exports = server;


