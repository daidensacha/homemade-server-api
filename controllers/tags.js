const db = require('../database/client');

const get_tags = async (req, res) => {
  try {
    const { rows: tags } = await db.query('SELECT * FROM tags');
    console.log(tags);
    return res.status(200).send(tags);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const get_tag_by_id = async (req, res) => {
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
};

const create_tag = async (req, res) => {
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
};

const update_tag = async (req, res) => {
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
};

const delete_tag = async (req, res) => {
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
};

module.exports = {
  get_tags,
  get_tag_by_id,
  create_tag,
  update_tag,
  delete_tag,
};
