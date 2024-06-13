import dotenv from 'dotenv'

import mongoose from 'mongoose'

// Load environment variables from .env file
dotenv.config();

mongoose.set('strictQuery',false)

const password = process.argv[2]

// Replace placeholder with the actual password
const url = process.env.MONGODB_URI.replace('<password>', password);

console.log(`Connect to`, url)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after the connection is established
  }).catch(error => {
    console.log("error connecting to MongoDB", error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


export default Person;