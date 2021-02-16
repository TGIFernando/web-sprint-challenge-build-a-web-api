// Write your "projects" router here!
const express = require('express')
const Projects = require('./projects-model')
const router = express.Router()

//End points for /api/projects/
router.get('/', async (_, res) => {
    try {
        const proj = await Projects.get()
        res.status(200).json(proj)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'internal server error'})
    }
})

router.get('/:id',  validateID, (req, res) => {
    res.status(200).json(req.proj)
})

router.post('/', validateProject, async (req, res) => {
    try{
        const proj = await Projects.insert(req.newProject)
        res.status(201).json(proj)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'oops looks like something went wrong with the server'})
    }
})

router.put('/:id', validateID, validateProject, async (req, res) => {
    try {
        await Projects.update(req.id, req.newProject)
        const proj = await Projects.get(req.id)
        res.status(201).json(proj)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'try again later couldnt update project'})
    }
})

router.delete('/:id', validateID, async (req, res) => {
    try {
        await Projects.remove(req.id)
        res.status(300).json()
    } catch (error) {
        console.log(error)
        res.status(500).json({  message: 'project couldnt be nuked'})
    }
})

router.get('/:id/actions', validateID, async (req, res) => {
    try {
        const actions = await Projects.getProjectActions(req.id)
        res.status(200).json(actions)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error"})
    }
})

//custom middleware for projects 
async function validateID (req, res, next){
    const { id } = req.params
    try{
        const proj = await Projects.get(id)
        if (proj) {
            req.proj = proj
            req.id = id
            next()
        } else {
            res.status(404).json({ message: `user with id ${id} does not exist`})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'oops looks like something went wrong with the server, please try again later'})
    }
}

async function validateProject (req, res, next){
    if(!req.body){
        res.status(400).json({ message: 'missing required project'})
    } else if(!req.body.name || !req.body.description){
        res.status(400).json({ message: 'missing required name or description field'})
    } else {
        req.newProject = req.body
        next()
    }
}

module.exports = router