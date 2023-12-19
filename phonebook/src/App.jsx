import { useEffect, useState } from 'react'
import Person from './Components/Person'
import Notification from './Components/Notification'
import FilterName from './Components/FilterName'
import AddNewPerson from './Components/AddNewPerson'
import axios from 'axios'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState(null)

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

    // Define the function to handle existing persons
    const handleExistingPerson = (id, personObject) => {
      const person = persons.find(person => person.id === id);
      const confirmUpdateExistingPerson = window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`);
      if (confirmUpdateExistingPerson) {
        personService
          .update(id, personObject)
          .then(updatedPerson => {
            // Map over the persons array and update the person with the new data
            setPersons(persons.map(person => person.id === id ? updatedPerson : person));
            setNewName('')
            setNewNumber('')
            // Set notification for updated person
            setNotifications({ message: `Updated ${updatedPerson.name}'s number.`, type: 'success' });
            setTimeout(() => {
              setNotifications(null);
            }, 5000); // Clear notification after 5 seconds
          })
          .catch(error => {
            // Note: 'updatedPerson' is not accessible in this scope. You might need a different approach to handle the name
            setNotifications({ message: `An error occurred. This user was already removed from the server.`, type: 'error' });
            setTimeout(() => {
              setNotifications(null)
            }, 5000)
          }) 
      }
    }
    

    const existingPerson = persons.some(person=>person.name === personObject.name)

    if (existingPerson) {
      // Find the id of the existing person
      const existingPersonId = persons.find(person => person.name === personObject.name).id;
      // Call the function with the existing person's id
      handleExistingPerson(existingPersonId, personObject);
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          // Set notification for new person
          setNotifications({ message: `Added ${returnedPerson.name}'s number.`, type: 'success' });
          setTimeout(() => {
            setNotifications(null);
          }, 5000); // Clear notification after 5 seconds
        })
        .catch(error => {
          setNotifications(
            `Error occured adding new person`
          )
          setTimeout(() => {
            setNotifications(null)
          }, 5000)
        }) 
      }
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id);
    const confirmDelete = window.confirm(`Do you want to delete ${person.name}?`);
    if (confirmDelete) {
      personService
        // call the deletePerson method in personService.js corresponding to the URL
        .deletePerson(id)
        // update all the persons in the list
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotifications({ message: `Person's removed`, type: 'success' });
          setTimeout(() => {
            setNotifications(null);
          }, 5000); // Clear notification after 5 seconds
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          // Handle the error appropriately
          setNotifications({ message: `An error occured. This user was already removed from server.`, type: 'error' })
          setTimeout(() => {
            setNotifications(null)
          }, 5000)
        });
    }
  };
  
  return (
    <div>
      <h2>Phonebook</h2>
      <FilterName handleSearchName={handleSearchName}/>
      <Notification message={notifications?.message} type={notifications?.type}/>

      <h2>Add a new</h2>
      <AddNewPerson addName={addName} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber}/>
      
      <h2>Numbers</h2>
      <Person persons={persons} search={search} onDelete={handleDelete}/>
    </div>
  )
}


export default App