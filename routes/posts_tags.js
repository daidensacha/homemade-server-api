const express = require('express');

const postsTagsRouter = express.Router();

const {
  get_posts_tags,
  get_posts_by_tags,
  create_posts_tags,
  update_posts_tags,
  delete_posts_tags,
} = require('../controllers/posts_tags');

postsTagsRouter.route('/').get(get_posts_tags).post(create_posts_tags);

postsTagsRouter
  .route('/:tag_id')
  .get(get_posts_by_tags)
  .put(update_posts_tags)
  .delete(delete_posts_tags);

module.exports = postsTagsRouter;
