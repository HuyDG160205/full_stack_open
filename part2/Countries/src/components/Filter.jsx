const Filter = ({ handleFilter }) => {


    
  return (
    <div>
      find countries
      <input type="text" onChange={handleFilter} />
    </div>
  );
};

export default Filter;
