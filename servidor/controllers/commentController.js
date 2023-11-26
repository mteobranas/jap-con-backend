const commentModel = require('../models/commentModel')

const getComments = async (req, res) => {
  const id = req.params.id
  const comments = await commentModel.getComments(id)
  if (comments) {
    res.json(comments)
  } else {
    res.status(500).json({ error: 'No se pudo obtener los comentarios' })
  }
}

const postComment = async (req, res) => {
  const id = req.user_id
  const {score, description, date_time, prod_id} = req.body
  const comment = await commentModel.postComment({score, description, date_time, prod_id}, id)
  if (comment) {
    res.json(comment)
  } else {
    res.status(500).json({ error: 'No se pudo crear el comentario' })
  }
}

const modifyComment = async (req, res) => {
  const comment = await commentModel.modifyComment(req.body)
  if (comment) {
    res.json(comment)
  } else {
    res.status(500).json({ error: 'No se pudo modificar el comentario' })
  }
}

const deleteComment = async (req, res) => {
  const id = req.params.id
  const comment = await commentModel.deleteComment(id)
  if (comment) {
    res.json({ message: 'Se ha eliminado el comentario' })
  } else {
    res.status(500).json({ error: 'No se pudo eliminar el comentario' })
  }
}

module.exports = { getComments, postComment, modifyComment, deleteComment }
