import express from 'express'
//import moment from 'moment';
import morgan from 'morgan'

// Import moment-timezone, which automatically extends moment
import moment from 'moment-timezone';

import cors from 'cors';


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Define a custom token to log request body
morgan.token('body', (req, res) => JSON.stringify(req.body));

// Middleware to capture response body
// app.use((req, res, next) => {
//   // console.log("REQUESTTT", req)
//   console.log("RESPONSEEE", res)
  
//   let oldSend = res.send;

//   res.send = function (data) {
//     res.locals.body = data;
//     // res.locals.body = data; // Save response body in res.locals
//     oldSend.apply(res, arguments);
//   }
//   next();
// });

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length', req.body), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
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
    },
    { 
      "id": 5,
      "name": "TEST DEPLOY SCRIPT", 
      "number": "55-55-4321321"
    }
]

app.get('/', (request, response) => {
  response.json(phonebook)
})


app.get('/persons', (request, response) => {
  response.json(phonebook)
    // const allData = phonebook.map(data => data.name)
    // const allData = phonebook.map(data => 
    //   { return `
    //     <div> 
    //       <p> Id : ${data.id} </p>
    //       <p> Name : ${data.name} </p>
    //       <p> Phonenumber : ${data.number} </p>
    //     </div> 
    //     <br/>`}).join()
    // response.send(`${allData} <br/>`)
})

app.get('/info', (request, response) => {
  const allData = phonebook.map(data => data.id)
  const convertToNumber = Math.max(...allData)
  let currentDate = moment.tz('Asia/Kuala_Lumpur').format('dddd MMMM Do YYYY, h:mm:ss a') + " GMT" + moment.tz('Asia/Shanghai').format('Z') + " (" + moment.tz('Asia/Shanghai').zoneAbbr() + ")";
  response.send(`Phonebook info has ${convertToNumber} people <br/> <br/> ${currentDate}`)
})

// GET all person info
app.get('/api/persons', (request, response) => {
  console.log('Response:  ', response.json)
  response.json(phonebook)
})

// GET specific people info
app.get('/api/persons/:id', (request, response) => {
  console.log("request params", request.params)
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

  const nameExist = phonebook.some(person=>person.name === body.name) 
  
  if (nameExist){
    return response.status(400).json({
      error: 'name must be unique'
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

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a')