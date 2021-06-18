import express from 'express'
import cors from 'cors'
import axios from 'axios'
import asyncHandler from 'express-async-handler'

const app = express()
app.use(cors())


app.use('/text/:query', asyncHandler(async (req, res) => {

    var apotelesma = []
    const apiUrl = `https://www.metaweather.com/api/location/search/?query=${req.params.query}`
    
    await axios(apiUrl)
    .then(res => {
      apotelesma = JSON.stringify(res.data)
    })
    .catch(err => console.log(err))
    
    res.json(apotelesma)
}))

app.use('/woeid/:query', asyncHandler(async (req, res) => {

    var apotelesma = []
    console.log(req.params.query)
    const apiUrl = `https://www.metaweather.com/api/location/${req.params.query}`
    await axios(apiUrl)
    .then(res => {
      apotelesma = JSON.stringify(res.data)
    })
    .catch(err => console.log(err))
    
    res.json(apotelesma)
}))



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))