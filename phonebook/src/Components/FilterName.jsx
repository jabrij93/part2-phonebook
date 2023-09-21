const FilterName = ({handleSearchName}) => {
    return (
      <div>
        filter shown with: <input onChange={handleSearchName} placeholder="Search a name.." />
      </div>
    )
  }
  
export default FilterName