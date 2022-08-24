const Router = require('express-promise-router');
const db = require('../database/client.js');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const cors = require('cors');
const router = new Router();
router.use(cors());

router.get('/', async (req, res) => {
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
});

module.exports = router