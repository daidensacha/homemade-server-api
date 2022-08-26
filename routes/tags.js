const express = require('express');

const tagsRouter = express.Router();

const {
  get_tags,
  get_tag_by_id,
  create_tag,
  update_tag,
  delete_tag,
} = require('../controllers/tags');

tagsRouter.route('/').get(get_tags).post(create_tag);

tagsRouter.route('/:id').get(get_tag_by_id).put(update_tag).delete(delete_tag);

module.exports = tagsRouter;
