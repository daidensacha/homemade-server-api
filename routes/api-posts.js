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
    const { rows: posts } = await db.query(`SELECT * FROM posts;`);
    console.log(posts);
    return res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});


// GET post by id
// Route /api/posts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const {
      rows: [post],
      rowCount,
    } = await db.query('SELECT * FROM posts WHERE post_id = $1;', [id]);

    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// POST new post
// Route /api/posts
router.post('/', async (req, res) => {
  // console.log(req.body);
  const { title, body, created_at, published_at, author_id, image } = req.body;

  if (!title || !body || !created_at || !published_at || !author_id || !image) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newPost],
    } = await db.query('INSERT INTO posts (title, body, created_at, published_at, author_id, image ) VALUES ($1,$2,$3, $4, $5, $6) RETURNING *', [title, body, created_at, published_at, author_id, image]);
    return res.status(201).send(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// PUT an existing post
// Route /api/posts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body, created_at, published_at, author_id, image } = req.body;

  if (!title || !body || !created_at || !published_at || !author_id || !image) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [updatePost],
      rowCount,
    } = await db.query(
      'UPDATE posts SET title = $1, body = $2, created_at = $3, published_at = $4, author_id = $5, image = $6 WHERE post_id = $7 RETURNING *',
      [title, body, created_at, published_at, author_id, image, id],
    );
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(201).send(updatePost);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// DELETE an existing post
// Route /api/posts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [deletePost],
      rowCount,
    } = await db.query('DELETE FROM posts WHERE post_id = $1 RETURNING *', [id]);
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(deletePost);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;