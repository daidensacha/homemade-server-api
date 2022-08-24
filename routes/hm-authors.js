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
    const { rows: authors } = await db.query(
      `SELECT
          author_id id,
          name,
          bio,
          created_at,
          image
        FROM authors
        `,
    );
    console.log(authors);
    return res.status(200).send(authors);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
