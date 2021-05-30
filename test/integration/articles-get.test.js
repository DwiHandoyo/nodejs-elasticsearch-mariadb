const { expect } = require('@hapi/code');
const server = require('../../src/server');

var id = '';

describe('POST articles with all of parameters', () => {
  it('responds with 201', async () => {
    const author = 'Dwi';
    const tittle = 'Napak Tilas Ujung Berung';
    const body = 'Dulu Bandung termasuk dalam wilayah Ujung Berung';
    const res = server.inject({
      method: 'post',
      url: '/articles',
      payload: {
        author,
        tittle,
        body,
      },
    });
    expect((await res).statusCode).to.equal(201);
    const payload = JSON.parse((await res).payload);
    id = payload.data.articleId;
    expect(payload.status).to.equal('success');
    expect(payload.message).to.equal('Article berhasil ditambahkan');
    expect(payload.data.articleId.length).to.min(1);
  });
});

describe('POST articles without one of parameters', () => {
  it('responds with 400', async () => {
    const tittle = 'Napak Tilas Ujung Berung';
    const body = 'Dulu Bandung termasuk dalam wilayah Ujung Berung';
    const res = server.inject({
      method: 'post',
      url: '/articles',
      payload: {
        tittle,
        body,
      },
    });
    expect((await res).statusCode).to.equal(400);
    const payload = JSON.parse((await res).payload);
    expect(payload.status).to.equal('fail');
    expect(payload.message).to.equal('Gagal menambahkan article. Mohon isi author article');
  });
});

describe('GET articles', () => {
  it('responds with 200', async () => {
    const res = server.inject({
      method: 'get',
      url: '/articles',
    });
    expect((await res).statusCode).to.equal(200);
    const payload = JSON.parse((await res).payload);
    expect(payload.status).to.equal('success');
    expect(Array.isArray(payload.data.articles)).to.equal(true);
    expect(payload.data.articles.length).to.min(1);
  });
});

describe('GET articles by author', () => {
  it('responds with 200', async () => {
    const res = server.inject({
      method: 'get',
      url: '/articles?author="Dwi"',
    });
    expect((await res).statusCode).to.equal(200);
    const payload = JSON.parse((await res).payload);
    expect(payload.status).to.equal('success');
    expect(Array.isArray(payload.data.articles)).to.equal(true);
    expect(payload.data.articles.length).to.min(1);
  });
});

describe('GET articles by query', () => {
  it('responds with 200', async () => {
    const res = server.inject({
      method: 'get',
      url: '/articles?body="tilas"'
    });
    expect((await res).statusCode).to.equal(200);
    const payload = JSON.parse((await res).payload);
    expect(payload.status).to.equal('success');
    expect(Array.isArray(payload.data.articles)).to.equal(true);
    expect(payload.data.articles.length).to.min(1);
  });
});

describe('GET articles by id', () => {
  it('responds with 200', async () => {
    const res = server.inject({
      method: 'get',
      url: '/articles/' + id,
    });
    expect((await res).statusCode).to.equal(200);
    const payload = JSON.parse((await res).payload);
    expect(payload.status).to.equal('success');
    expect(Array.isArray(payload.data.article)).to.equal(true);
    expect(payload.data.article.length).to.equal(1);
  });
});
