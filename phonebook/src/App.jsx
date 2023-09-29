import { useEffect, useState } from 'react'
import Person from './Components/Person'
import FilterName from './Components/FilterName'
import AddNewPerson from './Components/AddNewPerson'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3002/persons')
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response.data)
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
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterName handleSearchName={handleSearchName}/>

      <h2>Add a new</h2>
      <AddNewPerson addName={addName} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
      
      <h2>Numbers</h2>
      <Person persons={persons} search={search}/>
    </div>
  )
}

export default App