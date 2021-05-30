const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user:'root',
  database: 'article',
  password: '',
  connectionLimit: 5,
});

const rawData = {
  id: 'avavsad',
  tittle: 'asabdg',
  body: 'dbdb',
  author: 'sdgd',
  created: new Date().toISOString().slice(0, 19).replace('T', ' '),
};

const dbCreateTable = async () => {
  const dbconnection = await pool.getConnection();
  try {
    dbconnection.query('CREATE TABLE article (id INT AUTO_INCREMENT, article_id TEXT NOT NULL, author TEXT NOT NULL, tittle TEXT NOT NULL, body TEXT NOT NULL, created TIMESTAMP NOT NULL, PRIMARY KEY(id))');
  } catch (err) {
    throw err;
  } finally {
    if (dbconnection) return dbconnection.end();
  }
};

const dbInsert = async (data) => {
  const dbconnection = await pool.getConnection();
  const {
    id,
    tittle,
    body,
    author,
    created,
  } = data;
  try {
    await dbconnection.query("INSERT INTO article (article_id, author, tittle, body, created) values ('" + id + "', '" + author + "', '" + tittle + "', '" + body + "', '" + created + "')");
  } catch (err) {
    throw err;
  } finally {
    if (dbconnection) return dbconnection.end();
  }
};

// dbCreateTable();

// dbInsert(data);

module.exports = { dbInsert };
