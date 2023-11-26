const mariadb = require('mariadb')

const jwt = require('jsonwebtoken')

const secret = 'les pibes estan re pilles'

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'jap',
  connectionLimit: '5',
})

const getUserByToken = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    const foundUser = await conn.query(
      'SELECT first_name, second_name, last_name, second_last_name, email, password, phone, avatar FROM users WHERE id=?',
      [id]
    )
    if (foundUser.length > 0) {
      return foundUser
    } else {
      return { message: 'Usuario no encontrado' }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const getUser = async (user) => {
  let conn
  try {
    conn = await pool.getConnection()
    const foundUser = await conn.query(
      'SELECT id, first_name, second_name, last_name, second_last_name, email, password, phone, avatar FROM users WHERE email=? AND password=?',
      [user.email, user.password]
    )
    if (foundUser.length > 0) {
      return foundUser
    } else {
      return { message: 'Usuario y/o contraseña erróneos' }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const createUser = async (user) => {
  let conn
  try {
    conn = await pool.getConnection()
    const result = await conn.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [user.email, user.password, user.first_name, user.last_name]
    )
    return { id: parseInt(result.insertid), ...user }
  } catch (error) {
    console.log(error)
  } finally {
    if (conn) {
      conn.release()
    }
  }
  return false
}

const modifyUser = async (user, id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query(
      'UPDATE users SET email=?, first_name=?, second_name=?, last_name=?, second_last_name=?, phone=?, avatar=? WHERE id=?',
      [
        user.email,
        user.first_name,
        user.second_name,
        user.last_name,
        user.second_last_name,
        user.phone,
        user.avatar || '',
        id,
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

const deleteUser = async (id) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.query('DELETE FROM users WHERE id=?', [id])
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

module.exports = { getUser, getUserByToken, createUser, modifyUser, deleteUser }
