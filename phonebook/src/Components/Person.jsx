import './Person.css'

const Person = ({ persons, search, onDelete }) => {
    return (
      <div>
        {persons.filter((person)=>{
          return search.toUpperCase() === '' ? person : person.name.toUpperCase().includes(search.toUpperCase())
        }).map(person => 
        <div className='phonebook' key={person.id}>
            <li>{person.name}</li>  
            <li>{person.number}</li>
            <li>
              <button onClick={() => onDelete(person.id)}>Delete</button>
            </li>
        </div>
        )}
      </div>
  )
}
      
export default Person