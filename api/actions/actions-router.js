// Write your "actions" router here!
const express = require('express')
const Actions = require('./actions-model')

const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const actions = await Actions.get()
        res.status(200).json(actions)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error'})
    }
})

router.get('/:id', validateID,(req, res) => {
    res.status(200).json(req.action)
})

router.post('/', validateAction, async (req, res) => {
    try {
        const action = await Actions.insert(req.body)
        res.status(201).json(action)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'internal server error'})
    }
})

router.put('/:id', validateAction, validateID, async (req, res) => {
    try {
        const changes = await Actions.update(req.id, req.body)
        res.status(201).json(changes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'internal server issue'})
    }
})

router.delete('/:id', validateID, async (req, res) => {
    try {
        await Actions.remove(req.id)
        res.status(200).json()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server issue'})
    }
})



function validateAction (req, res, next) {
    if(!req.body){
        res.status(400).json({ message: 'required fields are blank'})
    } else if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({message : 'missing project id, description, or notes'})
    } else {
        next()
    }
}

async function validateID (req, res, next){
    const { id } = req.params
    try{
        const action = await Actions.get(id)
        if (action) {
            req.action = action
            req.id = id
            next()
        } else {
            res.status(404).json({ message: `action with id ${id} does not exist`})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'oops looks like something went wrong with the server, please try again later'})
    }
}

module.exports = router