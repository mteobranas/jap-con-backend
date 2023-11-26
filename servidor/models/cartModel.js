const mariadb = require('mariadb')
const jwt = require('jsonwebtoken')
const secretKey = 'This is a secret key to decode the token'

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'jap',
  connectionLimit: '5',
})

const getCartByID = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    const cart = await conn.query(
      'SELECT p.name, p.id, p.cost, p.currency, p.images, c.quantity FROM cart c JOIN products p ON c.prod_id = p.id JOIN users u ON c.user_id = u.id WHERE u.id = ? AND c.status = ?',
      [id, 'pending']
    )

    return cart
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const addItem = async (token, item) => {
  let conn
  try {
    conn = await pool.getConnection()
    const id = jwt.verify(token, process.env.SECRET ?? secretKey)
    const user = await conn.query('SELECT id FROM users WHERE id = ?', [
      id,
    ])
    const hasProduct = await conn.query(
      'SELECT * FROM cart WHERE prod_id=? AND user_id=? AND status=?',
      [item.id, user[0].id, 'pending']
    )
    if (hasProduct.length > 0) {
      await conn.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND prod_id = ? AND status=?',
        [item.quantity, user[0].id, item.id, 'pending']
      )
      return true
    } else {
      await conn.query(
        'INSERT INTO cart (user_id, prod_id, quantity) VALUES (?, ?, ?)',
        [user[0].id, item.id, item.quantity]
      )
      return true
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error adding item to cart')
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

const removeItem = async (user_id, item_id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query(
      'DELETE FROM cart WHERE user_id = ? AND prod_id = ? AND status=?',
      [user_id, item_id, 'pending']
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

const completeBuy = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query('UPDATE cart SET status = ? WHERE user_id = ?', [
      'completed',
      id,
    ])
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

module.exports = { getCartByID, completeBuy, addItem, removeItem }
