require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authorsRouter = require('./routes/authors');
const tagsRouter = require('./routes/tags');
const postsTagsRouter = require('./routes/posts_tags');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/poststags', postsTagsRouter);

module.exports = app;
