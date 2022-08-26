const db = require('../database/client');

const get_all_posts = async (req, res) => {
  console.log(req.query);
  const { tag } = req.query;
  // console.log(tag)
  try {
    const { rows: posts } = await db.query(`
    SELECT
      posts.post_id id,
      posts.title,
      posts.body body,
      posts.published_at,
      posts.image,
      authors.author_id,
      authors.name author,
      ARRAY_AGG (tags.tag) tags
    FROM posts
    INNER JOIN posts_tags pt USING (post_id )
    INNER JOIN tags USING (tag_id)
    INNER JOIN authors USING (author_id)
    GROUP BY post_id, authors.author_id
    ORDER BY post_id;
    `);
    console.log(posts);
    return res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};
// BACKUP OF ORIGINAL GET ALL POSTS
// const get_all_posts = async (req, res) => {
//   try {
//     const { rows: posts } = await db.query(`SELECT * FROM posts;`);
//     console.log(posts);
//     return res.status(200).send(posts);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send('Server Error');
//   }
// };

// BACKUP COPY OF GET POST FOR ID
// const get_post_by_id = async (req, res) => {
//   const { id } = req.params;
//   // console.log(id);
//   const { tag } = req.query;
//   console.log(tag)
//   try {
//     const {
//       rows: [post],
//       rowCount,
//     } = await db.query('SELECT * FROM posts WHERE post_id = $1;', [id]);

//     if (!rowCount) {
//       return res.status(404).send(`Post with id ${id} not found`);
//     }
//     return res.status(200).send(post);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send('Server Error');
//   }
// };

const get_post_by_id = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const { tag } = req.query;
  console.log(tag);
  try {
    const {
      rows: [post],
      rowCount,
    } = await db.query(
      `SELECT pt.id post_tags, t.*, p.* FROM posts_tags pt
    INNER JOIN tags t ON t.tag_id = pt.tag_id
    INNER JOIN posts p ON pt.post_id = p.post_id
    WHERE p.post_id = $1 AND t.tag = $2;`,
      [id, tag],
    );

    if (!rowCount) {
      return res
        .status(404)
        .send(`Post with id ${id} and tag ${tag} not found`);
    }
    return res.status(200).send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const create_post = async (req, res) => {
  const { title, body, created_at, published_at, author_id, image } = req.body;

  if (!title || !body || !created_at || !published_at || !author_id || !image) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const {
      rows: [newPost],
    } = await db.query(
      'INSERT INTO posts (title, body, created_at, published_at, author_id, image ) VALUES ($1,$2,$3, $4, $5, $6) RETURNING *',
      [title, body, created_at, published_at, author_id, image],
    );
    return res.status(201).send(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

const update_post = async (req, res) => {
  const { id } = req.params;
  const { tag, title, body, created_at, published_at, author_id, image } =
    req.body;
  // if tags are not included in the request, then don't update them
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
};

const delete_post = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [deletePost],
      rowCount,
    } = await db.query('DELETE FROM posts WHERE post_id = $1 RETURNING *', [
      id,
    ]);
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(deletePost);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = {
  get_all_posts,
  get_post_by_id,
  create_post,
  update_post,
  delete_post,
};
