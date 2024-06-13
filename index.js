import express from 'express'
//import moment from 'moment';

import morgan from 'morgan'
import mongoose from 'mongoose'
import Person from './models/person.js';

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
      "name": "EXERCISE 3.9-3.11 COMPLETED", 
      "number": "99-88-7754432"
    },
    { 
      "id": 6,
      "name": "EXERCISE 3.13-3.14 COMPLETED", 
      "number": "99-88-7754432"
    },
]

app.get('/', (request, response) => {
  Person.find({}).then(person=>{
    response.json(person)
  })
  // response.json(phonebook)
})


app.get('/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', async (request, response) => {
  // Before MongoDB - can directly use/call the 'persons' object
  // const allData = persons.map(person => person)
  // const convertToNumber = Math.max(...allData)

  // Using MongoDB, NOTE : must use async, include try/catch block, don't forget 'await' and call the module - Person - in this case
  try { 
  const persons = await Person.find({});
  const personCount = persons.length;
  
  let currentDate = moment.tz('Asia/Kuala_Lumpur').format('dddd MMMM Do YYYY, h:mm:ss a') + " GMT" + moment.tz('Asia/Shanghai').format('Z') + " (" + moment.tz('Asia/Shanghai').zoneAbbr() + ")";
  response.send(`Phonebook info has ${personCount} people <br/> <br/> ${currentDate}`)
  } catch (error) {
    console.error("Error fetching persons:", error);
    response.status(500).send('Internal Server Error');
  }
})

// GET all person info
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

// GET specific people info
app.get('/api/persons/:id', (request, response) => {
  // Find person by ID using MongoDB
  const id = request.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  // Find person by ID using MongoDB
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: 'The following resource is not found' });
      }
    })
    .catch(error => {
      // Handle any other errors
      response.status(500).json({ error: 'Internal server error' });
    });

  // Find specific person by ID BEFORE MongoDB
  // const id = Number(request.params.id)
  // const fromPhonebook = phonebook.find(person => {
  //   return person.id === id
  // })
  
  // if (fromPhonebook) {
  //   return response.json(fromPhonebook)
  // } else {
  //   return response.json('Resource not found')
  // }
})

// POST add new people
app.post('/api/persons/', async (request, response) => {  
  // ## ADD NEW PERSON USING MONGO DB

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json ({
      error : 'missing content'
    })
  }

  try {
    const persons = await Person.find({});
    const nameExist = persons.some(person=>person.name === body.name)

    if (nameExist) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number || '',
    })

    person.save().then(personSaved => {
      response.json(personSaved)
    })
  } catch (error) {
    console.error("Error fetching persons:", error);
    response.status(500).send('Internal Server Error');
  }

  // ## ADD NEW PERSON BEFORE MONGO DB
  // ## ADD NEW PERSON BEFORE MONGO DB
  // const maxId = phonebook.map(person=>person.id)
  // const generateId = phonebook.length > 0 ? Math.max(...maxId) + 1 : 0
  // console.log(generateId)
  // const nameExist = phonebook.some(person=>person.name === body.name) 
  
  // if (nameExist){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number || '',
  //   id: generateId
  // }

  // phonebook = phonebook.concat(person)
  // console.log('Body:  ', request.body)
  // response.json(phonebook)
})

// DELETE person
app.delete('/api/persons/:id', (request,response, next) => {
  // Delete person using MONGO DB
  Person.findByIdAndDelete(request.params.id)
    .then(result=> {
      response.status(204).end()
    }).catch(error => next(error))

  // Delete person before MONGO DB
  // Delete person before MONGO DB

  // const id = Number(request.params.id)
  // phonebook = phonebook.find(person => {person.id === id})
  // response.status(204).end();

  // Delete person before MONGO DB
  // Delete person before MONGO DB
})

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// moment.tz('Asia/Shanghai').format('dddd MMMM Do YYYY, h:mm:ss a')