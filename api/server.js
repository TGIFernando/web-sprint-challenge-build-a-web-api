//imports
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const projectsRouter = require('./projects/projects-router')
const actionsRouter = require('./actions/actions-router')

//server configuration
const server = express();

server.use(cors())
server.use(express.json())
server.use(logger)

//server end points
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)


//a catch for / so i know api is working
server.get('/', (_, res) => {
    res.send(`<h2>API is online<h2>`)
})

// Complete your server here!
// Do NOT `server.listen()` inside this file!

//custom logger
function logger(req, _, next) {
    const date = new Date()
    console.log(req.method, req.url, date, '\n')
    next()
}

module.exports = server;