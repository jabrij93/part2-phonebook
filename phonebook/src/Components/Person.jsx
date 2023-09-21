import './Person.css'

const Person = ({ persons, search }) => {
    return (
      <div>
        {persons.filter((person)=>{
          return search.toUpperCase() === '' ? person : person.name.toUpperCase().includes(search.toUpperCase())
        }).map(person => 
        <div className='phonebook' key={person.name}>
            <li>{person.name}</li>  
            <li>{person.number}</li>
        </div>
        )}
      </div>
  )
}
      
export default Person