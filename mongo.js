import mongoose from 'mongoose'

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


// const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('Usage: node mongo.js <password> <name> <number>');
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

// Replace placeholder with the actual password
const url = process.env.MONGODB_URI.replace('<password>', password);

// const url =
//   `mongodb+srv://jabrijuhinin93:54264316426153jJ%40@cluster0.5brgeat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// let name = 'Mary Poppendieck'
// let number2 = 39236423122

const person = new Person({
  name: `${name}`,
  number: `${number}`,
})

person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})