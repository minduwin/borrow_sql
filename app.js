const express = require('express');
const app = express();
const path = require('node:path');
const toolRouter = require('./routes/toolRouter');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', toolRouter);

app.listen(port, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Listening on port ${port}...`);
})