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
    const { rows: authors } = await db.query(`SELECT * FROM authors;`,
    );
    console.log(authors);
    return res.status(200).send(authors);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});


// GET author by id
// Route /api/authors/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const {
      rows: [author],
      rowCount,
    } = await db.query('SELECT * FROM authors WHERE author_id = $1;', [id]);

    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(author);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// POST new author
// Route /api/authors
router.post('/', async (req, res) => {
  // console.log(req.body);
  const { name, bio, created_at, image } = req.body;
  // const {image: {url, title}} = req.body;

  if (!name || !bio || !created_at  || !image) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newAuthor],
    } = await db.query('INSERT INTO authors (name, bio, created_at, image ) VALUES ($1,$2,$3, $4) RETURNING *', [name, bio, created_at, image]);
    return res.status(201).send(newAuthor);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// PUT an existing author
// Route /api/authors/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio, created_at, image } = req.body;

  if (!name || !bio || !created_at  || !image) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [updateAuthor],
      rowCount,
    } = await db.query(
      'UPDATE authors SET name = $1, bio = $2, created_at = $3, image = $4 WHERE author_id = $5 RETURNING *',
      [name, bio, created_at, image, id],
    );
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(201).send(updateAuthor);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// DELETE an existing author
// Route /api/authors/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [deleteAuthor],
      rowCount,
    } = await db.query('DELETE FROM authors WHERE author_id = $1 RETURNING *', [id]);
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(deleteAuthor);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
