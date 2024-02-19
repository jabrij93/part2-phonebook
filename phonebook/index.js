import express from 'express'
//import moment from 'moment';
import morgan from 'morgan'

// Import moment-timezone, which automatically extends moment
import moment from 'moment-timezone';

const app = express()
app.use(express.json())

// Define a custom token to log request body
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length', req.body), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

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
    
    response.send(`${allData} <br/>`)

  
})

app.get('/info', (request, response) => {
  const allData = phonebook.map(data => data.id)
  const convertToNumber = Math.max(...allData)

  let currentDate = moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a') + " GMT" + moment.tz('Asia/Shanghai').format('Z') + " (" + moment.tz('Asia/Shanghai').zoneAbbr() + ")";
  response.send(`Phonebook info has ${convertToNumber} people <br/> <br/> ${currentDate}`)
})

// GET all person info
app.get('/api/persons', (request, response) => {

  console.log('Response:  ', response.json)
  response.json(phonebook)
})

// GET specific people info
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const fromPhonebook = phonebook.find(person => {
    return person.id === id
  })
  
  if (fromPhonebook) {
    return response.json(fromPhonebook)
  } else {
    return response.json('Resource not found')
  }
})

// POST add new people
app.post('/api/persons/', (request, response) => { 
  const maxId = phonebook.map(person=>person.id)
  const generateId = phonebook.length > 0 ? Math.max(...maxId) + 1 : 0
  console.log(generateId)


  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json ({
      error : 'missing content'
    })
  }

  const nameExist = phonebook.some(person=>person.name ===body.name) 
  
  if (nameExist){
    return response.status(400).json({
      error: 'name already exist. choose another name'
    })
  }

  const person = {
    name: body.name,
    number: body.number || '',
    id: generateId
  }

  phonebook = phonebook.concat(person)
  console.log('Body:  ', request.body)
  response.json(phonebook)
})

// DELETE person
app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.find(person => {person.id === id})
  response.status(204).end();
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a')