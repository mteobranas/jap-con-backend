const cartModel = require('../models/cartModel.js')

const getCartByID = async (req, res) => {
  const id = req.user_id
  const cart = await cartModel.getCartByID(id)
  if (cart) {
    res.json(cart)
  } else {
    res.status(404).json({
      message: 'No se ha encontrado un carrito asociado a este usuario',
    })
  }
}

const addItem = async (req, res) => {
  const item = req.body
  const token = req.headers.authorization
  const added = await cartModel.addItem(token, item)
  if (added) {
    res.json({ message: 'Se ha agregado el item al carrito' })
  } else {
    res.status(500).json({ error: 'No se pudo agregar el item al carrito' })
  }
}

const removeItem = async (req, res) => {
  const user_id = req.user_id
  const item_id = req.params.id
  const removed = await cartModel.removeItem(user_id, item_id)
  if (removed) {
    res.json({ message: 'Se ha eliminado el item del carrito' })
  } else {
    res.status(500).json({ error: 'No se pudo eliminar el item del carrito' })
  }
}

const completeBuy = async (req, res) => {
  const id = req.user_id
  const completed = await cartModel.completeBuy(id)
  if (completed) {
    res.json({ message: 'Se ha realizado la compra de compra' })
  } else {
    res.status(500).json({ error: 'No se pudo realizar la compra de vida' })
  }
}

module.exports = { getCartByID, addItem, removeItem, completeBuy }
