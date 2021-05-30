const {
  addArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/articles',
    handler: addArticleHandler,
  },
  {
    method: 'GET',
    path: '/articles',
    handler: getAllArticlesHandler,
  },
  {
    method: 'GET',
    path: '/articles/{id}',
    handler: getArticleByIdHandler,
  },
];
module.exports = routes;
