const express = require('express');
const minionsWorkRouter = express.Router({ mergeParams: true });

const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db');

const modelType = 'work'

minionsWorkRouter.use('/:workId', (req, res, next) => {
    try {
        const workId = req.params.workId
        const work = getFromDatabaseById(modelType, workId)
        if (!work) res.status(404).send('Work not found')
        req.workId = workId
        req.work = work
        next()
    } catch (err) {
        next(err)
    }
})

const transformDataMiddleware = (req, res, next) => {
    req.body = {
        id: String(req.body.id),
        title: String(req.body.title),
        description: String(req.body.description),
        hours: Number(req.body.hours)
    }
    next()
}

minionsWorkRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase(modelType).filter(work => work.minionId == req.minionId))
})

minionsWorkRouter.post('/', transformDataMiddleware, (req, res, next) => {
    req.body.minionId = req.minionId
    const output = addToDatabase(modelType, req.body)
    res.status(201).send(output)
})

minionsWorkRouter.put('/:workId', transformDataMiddleware, (req, res, next) => {
    req.body.id = req.workId
    req.body.minionId = req.minionId
    const work = getFromDatabaseById(modelType, req.workId)
    if (work.id != req.minionId) {
        res.status(400).send()
    }
    const output = updateInstanceInDatabase(modelType, req.body)
    res.status(200).send(output)
})

minionsWorkRouter.delete('/:workId', (req, res, next) => {
    const output = deleteFromDatabasebyId(modelType, req.workId)
    res.status(204).send()
})

module.exports = minionsWorkRouter;