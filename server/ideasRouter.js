const express = require('express');
const ideasRouter = express.Router();

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db');

const modelType = 'ideas'

ideasRouter.use('/:ideaId', (req, res, next) => {
    try {
        const ideaId = req.params.ideaId
        const idea = getFromDatabaseById(modelType, ideaId)
        if (!idea) res.status(404).send('Idea not found')
        req.ideaId = ideaId
        req.idea = idea
        next()
    } catch (err) {
        next(err)
    }
})

const transformDataMiddleware = (req, res, next) => {
    req.body = {
        id: String(req.body.id),
        name: String(req.body.name),
        description: String(req.body.description),
        numWeeks: Number(req.body.numWeeks),
        weeklyRevenue: Number(req.body.weeklyRevenue)
    }
    next()
}

const checkMillionDollarIdeaMiddleware = require('./checkMillionDollarIdea')

ideasRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase(modelType)
    res.send(ideas)
})

ideasRouter.post('/', transformDataMiddleware, checkMillionDollarIdeaMiddleware, (req, res, next) => {
    const output = addToDatabase(modelType, req.body)
    res.status(201).send(output)
})

ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea)
})

ideasRouter.put('/:ideaId', transformDataMiddleware, checkMillionDollarIdeaMiddleware, (req, res, next) => {
    req.idea.id = req.ideaId
    const output = updateInstanceInDatabase(modelType, req.body)
    res.status(200).send(output)
})

ideasRouter.delete('/:ideaId', (req, res, next) => {
    const output = deleteFromDatabasebyId(modelType, req.ideaId)
    res.status(204).send()
})

module.exports = ideasRouter;