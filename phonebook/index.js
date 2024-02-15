import express from 'express'
//import moment from 'moment';

// Import moment-timezone, which automatically extends moment
import moment from 'moment-timezone';


const app = express()


app.use(express.json())

let phonebook = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    const allData = phonebook.map(data => data.name)
    response.send(`${allData}`)
})

app.get('/info', (request, response) => {
  const allData = phonebook.map(data => data.id)
  const convertToNumber = Math.max(...allData)

  let currentDate = moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a') + " GMT" + moment.tz('Asia/Shanghai').format('Z') + " (" + moment.tz('Asia/Shanghai').zoneAbbr() + ")";
  response.send(`Phonebook info has ${convertToNumber} people <br/> <br/> ${currentDate}`)
})

app.get('/api/phonebook', (request, response) => {
  response.json(phonebook)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a')