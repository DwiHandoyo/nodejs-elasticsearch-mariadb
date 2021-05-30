const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
});

const rawData = {
  id: 'wug',
  tittle: 'asabdg',
  body: 'dbdb',
  author: 'sdgd',
  created: 'aa',
};

client.indices.exists({ index: 'article' })
  .then(() => null)
  .then(() => client.indices.create({
    index: 'article',
    type: 'article',
  }))
  .then(() => {
    console.log('create index done!');
  })
  .catch((err) => {
    console.log(err);
  });

const insertElastic = async (data) => {
  await client.index({
    index: 'article',
    type: 'article',
    body: {
      article_id: data.id,
      author: data.author,
      tittle: data.tittle,
      body: data.body,
      created: data.created,
    },
  });

  await client.indices.refresh({ index: 'article' });
};

const getElasticByAuthor = async (author) => {
  const body = await client.search({
    index: 'article',
    type: 'article',
    body: {
      query: {
        match: { author },
      },
    },
  });
  return body.hits.hits;
};

const getElasticByQuery = async (query) => {
  console.log(query);
  const body = await client.search({
    index: 'article',
    type: 'article',
    body: {
      query: {
        bool: {
          should: [
            {
              match: {
                tittle: query,
              },
            },
            {
              match: {
                body: query,
              },
            },
          ],
        },
      },
    },
  });
  return body.hits.hits;
};

const getElasticById = async (id) => {
  const body = await client.search({
    index: 'article',
    type: 'article',
    body: {
      query: {
        match: {
          article_id: id,
        },
      },
    },
  });
  return body.hits.hits;
};

const getAllElastic = async () => {
  const body = await client.search({
    index: 'article',
    type: 'article',
    body: {
      query: {
        match_all: {},
      },
    },
  });
  return body.hits.hits;
};

// insertElastic(data);

// getAllElastic().then(console.log);

module.exports = {
  insertElastic,
  getElasticByAuthor,
  getElasticByQuery,
  getElasticById,
  getAllElastic,
};
