const express = require('express');
const meetingsRouter = express.Router();

const {
    createMeeting,
    getAllFromDatabase,
    deleteAllFromDatabase,
    addToDatabase,
} = require('./db');

const modelType = 'meetings'

meetingsRouter.get('/', (req, res, next) => {
    const meetings = getAllFromDatabase(modelType)
    res.send(meetings)
})

meetingsRouter.post('/', (req, res, next) => {
    const output = addToDatabase(modelType, createMeeting())
    res.status(201).send(output)
})

meetingsRouter.delete('/', (req, res, next) => {
    const output = deleteAllFromDatabase(modelType)
    res.status(204).send()
})

module.exports = meetingsRouter;