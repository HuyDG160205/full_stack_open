const Filter = ({ handleFilter }) => {
  return (
    <div>
      <input type="text" onChange={handleFilter} />
    </div>
  );
};

export default Filter;
