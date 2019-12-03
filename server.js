const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const movies = require('./movieData')

const app = express();

app.get('/movie', (req,res) => {
    

    res.json(movies)
})

app.listen(8000, () => console.log('listening to server'))