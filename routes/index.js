const api_authors = require('./api-authors');
const api_posts = require('./api-posts');
const api_tags = require('./api-tags');
const api_posts_tags = require('./api-posts-tags');
const authors = require('./hm-authors');
const posts = require('./hm-posts');

module.exports = app => {
  app.use('/api/authors', api_authors);
  app.use('/api/posts', api_posts);
  app.use('/api/tags', api_tags);
  app.use('/api/posts-tags', api_posts_tags);
  app.use('/authors', authors);
  app.use('/posts', posts);
};
