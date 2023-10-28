const express = require('express')
const examples = express.Router()

examples.get('/examples', (req, res)=>{
    res.send({
        nome:'ema'
    })
})





module.exports = examples