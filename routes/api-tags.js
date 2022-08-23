const Router = require('express-promise-router');
const db = require('../database/client.js');
const express = require('express');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
router.use(express.json());

// GET all tags
// Route /api/tags
router.get('/', async (req, res) => {
  try {
    const { rows: tags } = await db.query('SELECT * FROM tags');
    console.log(tags);
    return res.status(200).send(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// GET tag by id
// Route /api/tags/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const {
      rows: [tag],
      rowCount,
    } = await db.query('SELECT * FROM tags WHERE tag_id = $1;', [id]);

    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(tag);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// POST new tag
// Route /api/tags
router.post('/', async (req, res) => {
  // console.log(req.body);
  const { tag } = req.body;
  if (!tag) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newTag],
    } = await db.query('INSERT INTO tags (tag) VALUES ($1) RETURNING *', [tag]);
    return res.status(201).send(newTag);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// PUT an existing tag
// Route /api/tags/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tag } = req.body;

  if (!tag) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [updatedTag],
      rowCount,
    } = await db.query(
      'UPDATE tags SET tag = $1 WHERE tag_id = $2 RETURNING *',
      [tag, id],
    );
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(201).send(updatedTag);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

// DELETE an existing tag
// Route /api/tags/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [deleteTag],
      rowCount,
    } = await db.query('DELETE FROM tags WHERE tag_id = $1 RETURNING *', [id]);
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(deleteTag);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
