const { nanoid } = require('nanoid');
const { dbInsert } = require('./database');
const {
  insertElastic,
  getElasticByAuthor,
  getElasticByQuery,
  getElasticById,
  getAllElastic,
} = require('./elastic');

const addArticleHandler = async (request, h) => {
  const { author, tittle, body } = request.payload;
  const id = nanoid(16);
  const created = new Date().toISOString();
  const newArticle = {
    id,
    tittle,
    body,
    author,
    created,
  };

  if (author === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan article. Mohon isi author article',
    });
    response.code(400);
    return response;
  }

  if (tittle === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan article. Mohon isi tittle article',
    });
    response.code(400);
    return response;
  }

  if (body === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan article. Mohon isi body article',
    });
    response.code(400);
    return response;
  }

  dbInsert(newArticle);
  await insertElastic(newArticle);
  const articles = await getElasticById(id);
  const isSuccess = articles.filter((article) => article._source.article_id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Article berhasil ditambahkan',
      data: {
        articleId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Article gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllArticlesHandler = async (request, h) => {
  const { author, query } = request.query;
  let articleData = await getAllElastic();
  
  if (author !== undefined) {
    articleData = await getElasticByAuthor(author);
  }

  if (query !== undefined) {
    articleData = await getElasticByQuery(query);
  }

  articleData = articleData.map((article) => (article._source));
  const response = h.response({
    status: 'success',
    data: {
      articles: articleData.map((article) => ({
        id: article.id,
        author: article.author,
        tittle: article.tittle,
        body: article.body,
      })),
    },
  });
  response.code(200);
  return response;
};

const getArticleByIdHandler = async (request, h) => {
  const { id } = request.params;
  const articles = await getElasticById(id);

  if (articles !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        article: articles.map(article => (article._source)),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Article tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
};
