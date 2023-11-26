const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "jap",
  connectionLimit: "5",
});

const getProdById = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    const prod = await conn.query('SELECT * FROM products WHERE cat_id=?', [id])
    return prod
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const getSelectedProduct = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    const prod = await conn.query('SELECT * FROM products WHERE id=?', [id])
    return prod
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const addProd = async (product) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query(
      'INSERT INTO products SET name, description, cost, currency, sold_count, related_products, images, cat_id VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        product.name,
        product.description,
        product.cost,
        product.currency,
        product.sold_count,
        product.related_products,
        product.images,
        product.cat_id,
      ]
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

const removeProduct = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query('DELETE FROM products WHERE id=?', [id])
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

module.exports = { getProdById, getSelectedProduct, addProd, removeProduct }
