import './Person.css'

const Person = ({ person }) => {
    return (
      <div>
        <div className='phonebook'>
            <li>{person.name}</li>  
            <li>{person.number}</li>
        </div>
      </div>
    )
  }
  
export default Person