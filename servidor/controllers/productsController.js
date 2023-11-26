const productsModel = require('../models/productsModel')

const getProdById = async (req, res) => {
  const id = req.params.id
  const products = await productsModel.getProdById(id)
  if (products) {
    res.json(products)
  } else {
    res.status(404).json({ error: 'No se encontraron productos' })
  }
}

const getSelectedProd = async (req, res) => {
  const id = req.params.id
  const products = await productsModel.getSelectedProduct(id)
  if (products) {
    res.json(products)
  } else {
    res.status(404).json({ error: 'No se encontraron productos' })
  }
}

const addProd = async (req, res) => {
  const product = await productsModel.addProd(req.body)
  if (product) {
    res.json(product)
  } else {
    res.status(500).json({ error: 'No se pudo agregar el producto' })
  }
}

const removeProduct = async (req, res) => {
  const id = req.params.id
  const product = await productsModel.removeProduct(id)
  if (product) {
    res.json({ message: 'Se ha eliminado el producto' })
  } else {
    res.status(500).json({ error: 'No se pudo eliminar el producto' })
  }
}

module.exports = { getProdById, getSelectedProd, addProd, removeProduct }
