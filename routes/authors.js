// const db = require('../database/client');
const express = require('express');
// const { get_all_authors } = require('../controllers/authors');

const authorsRouter = express.Router();

const {
  get_all_authors,
  get_author_by_id,
  create_author,
  update_author,
  delete_author,
} = require('../controllers/authors');

authorsRouter.route('/').get(get_all_authors).post(create_author);

authorsRouter
  .route('/:id')
  .get(get_author_by_id)
  .put(update_author)
  .delete(delete_author);

module.exports = authorsRouter;
