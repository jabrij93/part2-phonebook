import { useEffect, useState } from 'react'
import Person from './Components/Person'
import FilterName from './Components/FilterName'
import AddNewPerson from './Components/AddNewPerson'
import axios from 'axios'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPerson => {
        console.log("promise fulfilled")
        setPersons(initialPerson)
      })
  },[])
  console.log("render", persons.length, "persons")

  const handleNameChange = (event) =>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchName = (event) =>{
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(person=>person.name === personObject.name)) {
      alert(`${newName} already exist in the phonebook`)
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
      })
    }
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id);
    const confirmDelete = window.confirm(`Do you want to delete ${person.name}?`);
    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          // Handle the error appropriately
        });
    }
  };
  
  return (
    <div>
      <h2>Phonebook</h2>
      <FilterName handleSearchName={handleSearchName}/>

      <h2>Add a new</h2>
      <AddNewPerson addName={addName} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
      
      <h2>Numbers</h2>
      <Person persons={persons} search={search} onDelete={handleDelete}/>
    </div>
  )
}

export default App