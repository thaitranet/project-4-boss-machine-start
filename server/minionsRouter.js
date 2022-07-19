const express = require('express');
const minionsRouter = express.Router();

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db');

const modelType = 'minions'

minionsRouter.use(['/:minionId'], (req, res, next) => {
    try {
        const minionId = req.params.minionId
        const minion = getFromDatabaseById(modelType, minionId)
        if (!minion) res.status(404).send('Minion not found')
        req.minionId = minionId
        req.minion = minion
        next()
    } catch (err) {
        next(err)
    }
})

const transformDataMiddleware = (req, res, next) => {
    req.body = {
        id: String(req.body.id),
        name: String(req.body.name),
        title: String(req.body.title),
        weaknesses: String(req.body.weaknesses),
        salary: Number(req.body.salary)
    }
    next()
}

minionsRouter.get('/', (req, res, next) => {
    const minions = getAllFromDatabase(modelType)
    res.send(minions)
})

minionsRouter.post('/', transformDataMiddleware, (req, res, next) => {
    const output = addToDatabase(modelType, req.body)
    res.status(201).send(output)
})

minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion)
})

minionsRouter.put('/:minionId', transformDataMiddleware, (req, res, next) => {
    req.minion.id = req.minionId
    const output = updateInstanceInDatabase(modelType, req.body)
    res.status(200).send(output)
})

minionsRouter.delete('/:minionId', (req, res, next) => {
    const output = deleteFromDatabasebyId(modelType, req.minionId)
    res.status(204).send()
})

const minionsWorkRouter = require('./minionsWorkRouter')
minionsRouter.use('/:minionId/work', minionsWorkRouter)

module.exports = minionsRouter;