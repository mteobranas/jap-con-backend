const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "jap",
  connectionLimit: "5",
});

const getCategories = async () => {
  let conn
  try {
    conn = await pool.getConnection()
    const updateProdCount = await conn.query(
      'UPDATE categories c SET prod_count = (SELECT COUNT(p.id) FROM products p WHERE p.cat_id = c.id)'
    )

    const categories = await conn.query(
      'SELECT id, name, description, image, prod_count FROM categories'
    )

    return categories
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const createCategory = async (category) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
      [category.name, category.description, category.image]
    )
    return true
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const modifyCategory = async (category, id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query(
      'UPDATE categories SET (name, description, image) VALUES (?, ?, ?) WHERE id=?',
      [category.name, category.description, category.image, id]
    )
    return true
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const deleteCategory = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query('DELETE FROM categories WHERE id=?', [id])
    return true
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

module.exports = {
  getCategories,
  createCategory,
  modifyCategory,
  deleteCategory,
}
