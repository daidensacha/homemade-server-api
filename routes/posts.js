// const db = require('../database/client');
const express = require('express');

const postsRouter = express.Router();

const {
  get_all_posts,
  get_post_by_id,
  create_post,
  update_post,
  delete_post,
} = require('../controllers/posts');

postsRouter.route('/').get(get_all_posts).post(create_post);

postsRouter
  .route('/:id')
  .get(get_post_by_id)
  .put(update_post)
  .delete(delete_post);

module.exports = postsRouter;
