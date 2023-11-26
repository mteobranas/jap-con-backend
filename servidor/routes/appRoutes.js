const express = require('express')
const appRoutes = express.Router()

const categoriesController = require('../controllers/categoriesController')
const userController = require('../controllers/userController')
const productsController = require('../controllers/productsController')
const cartController = require('../controllers/cartController')
const commentController = require('../controllers/commentController')

const { verifyToken } = require('../token')


appRoutes.post('/users', userController.getUser)
appRoutes.post('/register', userController.createUser)


appRoutes.use(verifyToken)

appRoutes.get('/users', userController.getUserByToken)
appRoutes.put('/users', userController.modifyUser)
appRoutes.delete('/users/:id', userController.deleteUser)

appRoutes.get('/categories', categoriesController.getCategories)
appRoutes.post('/categories', categoriesController.createCategory)
appRoutes.put('/categories/:id', categoriesController.modifyCategory)
appRoutes.delete('/categories/:id', categoriesController.deleteCategory)

appRoutes.get('/products/:id', productsController.getProdById)
appRoutes.get('/product-info/:id', productsController.getSelectedProd)
appRoutes.post('/products', productsController.addProd)
appRoutes.delete('/products/:id', productsController.removeProduct)

appRoutes.get('/cart', cartController.getCartByID)
appRoutes.post('/cart', cartController.addItem)
appRoutes.delete('/cart/:id', cartController.removeItem)
appRoutes.patch('/cart/', cartController.completeBuy)

appRoutes.get('/comments/:id', commentController.getComments)
appRoutes.post('/comments', commentController.postComment)
appRoutes.put('/comments/:id', commentController.modifyComment)
appRoutes.delete('/comments/:id', commentController.deleteComment)

module.exports = appRoutes
