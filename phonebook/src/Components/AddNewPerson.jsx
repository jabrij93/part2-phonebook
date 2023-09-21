const AddNewPerson = ({handleNameChange, handleNumberChange, addName, newName, newNumber}) => {
    return (
      <div>
        <form onSubmit={addName}>
            <div>
                name: <input onChange={handleNameChange} value={newName} />
            </div>
            <div>
                phonenumber: <input onChange={handleNumberChange} value={newNumber} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
      </div>
    )
  }
  
export default AddNewPerson