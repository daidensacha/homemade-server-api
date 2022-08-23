const Router = require('express-promise-router');
const db = require('../database/client.js');
const express = require('express');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const { rows: posts_tags } = await db.query('SELECT * FROM posts_tags');
    console.log(posts_tags);
    return res.status(200).send(posts_tags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});


// GET post by post_id & tag_id
// Route /api/posts-tags/:id
router.get('/:post_id/:tag_id', async (req, res) => {
  const { post_id, tag_id } = req.params;
  // console.log(id);
  try {
    const {
      rows: [postIdTagId],
      rowCount,
    } = await db.query('SELECT * FROM posts_tags WHERE post_id = $1 AND tag_id = $2;', [post_id, tag_id]);

    if (!rowCount) {
      return res.status(404).send(`Post/Tag with id's ${post_id, tag_id} not found`);
    }
    return res.status(200).send(postIdTagId);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// POST new posts_tags
// Route /api/posts-tags
router.post('/', async (req, res) => {
  // console.log(req.body);
  const { post_id, tag_id } = req.body;

  if (!post_id || !tag_id) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newPostsTags],
    } = await db.query('INSERT INTO posts_tags (post_id, tag_id) VALUES ($1,$2) RETURNING *', [post_id, tag_id]);
    return res.status(201).send(newPostsTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// PUT an existing posts_tags
// Route /api/posts-tags/:post_id/:tag_id
router.put('/:postId/:tagId', async (req, res) => {
  const { postId, tagId } = req.params;
  const { post_id, tag_id  } = req.body;

  if (!post_id || !tag_id) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [updatePostsTags],
      rowCount,
    } = await db.query(
      'UPDATE posts_tags SET post_id = $1, tag_id = $2 WHERE post_id = $3 AND tag_id = $4 RETURNING *',
      [post_id, tag_id , postId, tagId],
    );
    if (!rowCount) {
      return res.status(404).send(`Posts_Tags with id's ${postId, tagId} not found`);
    }
    return res.status(201).send(updatePostsTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// DELETE an existing post
// Route /api/posts/:id
router.delete('/:postId/:tagId', async (req, res) => {
  const { postId, tagId } = req.params;
  try {
    const {
      rows: [deletePostTags],
      rowCount,
    } = await db.query('DELETE FROM posts_tags WHERE post_id = $1 AND tag_id = $2 RETURNING *', [postId, tagId ]);
    if (!rowCount) {
      return res.status(404).send(`Posts_Tags with id's ${postId, tagId} not found`);
    }
    return res.status(200).send(deletePostTags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;