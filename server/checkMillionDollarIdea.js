const checkMillionDollarIdea = (req, res, next) => {
    try {
        if (!Number(req.body.numWeeks) || !Number(req.body.weeklyRevenue))
            throw new Error("numWeeks and weeklyRevenue")
        const total = Number(req.body.numWeeks) * Number(req.body.weeklyRevenue);
        if (total < 1000000) res.status(400).send()
        else next()
    }
    catch (err) {
        res.status(400).send()
    }
}

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
