import mongoose from 'mongoose'

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const password = process.argv[2]

// Replace placeholder with the actual password
const url = process.env.MONGODB_URI.replace('<password>', password);

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('test Person', Person);
    console.log('phonebook :' );
    Person.find({}).then(result => {
      console.log('phonebook:');
      result.map(result=> {
          console.log(`${result.name} ${result.number}`)
      })
      mongoose.connection.close();  
    })
    
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: `${name}`,
        number: `${number}`,
      })

    person.save()
        .then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
}