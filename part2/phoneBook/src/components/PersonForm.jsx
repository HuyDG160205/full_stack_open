const PersonForm = ({
  handleNameChange,
  handleNumberChange,
  handleSubmit,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} type="text" onChange={handleNameChange} />
        number:{" "}
        <input value={newNumber} type="text" onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
