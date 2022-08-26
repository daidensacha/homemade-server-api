const db = require('../database/client');

const get_posts_tags = async (req, res) => {
  console.log('REQ_QUERY', req.query);
  const { tag } = req.query;
  console.log('TAG', tag);
  try {
    const { rows: posts_tags } = await db.query(`SELECT * FROM posts_tags
    INNER JOIN tags ON posts_tags.tag_id = tags.tag_id`);
    console.log(posts_tags);
    return res.status(200).send(posts_tags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const get_posts_by_tags = async (req, res) => {
  const { tagId } = req.params;
  console.log('REQ_QUERY', req.query);
  try {
    const {
      rows: [postIdTagId],
      rowCount,
    } = await db.query(`SELECT * FROM post_tags WHERE tag_id = $1;`, [tagId]);

    if (!rowCount) {
      return res.status(404).send(`Tag with id's ${tagId} not found`);
    }
    return res.status(200).send(tagId);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const create_posts_tags = async (req, res) => {
  // console.log(req.body);
  const { post_id, tag_id } = req.body;

  if (!post_id || !tag_id) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newPostsTags],
    } = await db.query(
      'INSERT INTO posts_tags (post_id, tag_id) VALUES ($1,$2) RETURNING *',
      [post_id, tag_id],
    );
    return res.status(201).send(newPostsTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const update_posts_tags = async (req, res) => {
  const { postId, tagId } = req.params;
  const { post_id, tag_id } = req.body;

  if (!post_id || !tag_id) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [updatePostsTags],
      rowCount,
    } = await db.query(
      'UPDATE posts_tags SET post_id = $1, tag_id = $2 WHERE post_id = $3 AND tag_id = $4 RETURNING *',
      [post_id, tag_id, postId, tagId],
    );
    if (!rowCount) {
      return res
        .status(404)
        .send(`Posts_Tags with id's ${(postId, tagId)} not found`);
    }
    return res.status(201).send(updatePostsTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const delete_posts_tags = async (req, res) => {
  const { postId, tagId } = req.params;
  try {
    const {
      rows: [deletePostTags],
      rowCount,
    } = await db.query(
      'DELETE FROM posts_tags WHERE post_id = $1 AND tag_id = $2 RETURNING *',
      [postId, tagId],
    );
    if (!rowCount) {
      return res
        .status(404)
        .send(`Posts_Tags with id's ${(postId, tagId)} not found`);
    }
    return res.status(200).send(deletePostTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  get_posts_tags,
  get_posts_by_tags,
  create_posts_tags,
  update_posts_tags,
  delete_posts_tags,
};
