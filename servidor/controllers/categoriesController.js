const categoriesModel = require('../models/categoriesModel')

const getCategories = async (req, res) => {
  const categories = await categoriesModel.getCategories()
  if (categories) {
    res.json(categories)
  } else {
    res.status(404).json({ error: 'No se encontraron categorias' })
  }
}

const createCategory = async (req, res) => {
  const category = await categoriesModel.createCategory(req.body)
  if (category) {
    res.json(category)
  } else {
    res.status(500).json({ error: 'No se pudo crear la categoria' })
  }
}

const modifyCategory = async (req, res) => {
  const id = req.params.id
  const category = await categoriesModel.modifyCategory(req.body, id)
  if (category) {
    res.json(category)
  } else {
    res.status(500).json({ error: 'No se pudo modificar la categoria' })
  }
}

const deleteCategory = async (req, res) => {
  const id = req.params.id
  const category = await categoriesModel.deleteCategory(id)
  if (category) {
    res.json({ message: 'Se ha eliminado la categoria' })
  } else {
    res.status(500).json({ error: 'No se pudo eliminar la categoria' })
  }
}

module.exports = { getCategories, createCategory, modifyCategory, deleteCategory }
