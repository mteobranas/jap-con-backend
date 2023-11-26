const jwt = require('jsonwebtoken')

const secretKey = 'This is a secret key to decode the token'

const signToken = (user) => {
  if (user) {
    return jwt.sign(user, process.env.SECRET ?? secretKey)
  } else {
    return false
  }
}

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET || secretKey)
    req.user_id = decoded
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { signToken, verifyToken }
