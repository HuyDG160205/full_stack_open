const Person = ({ persons, deleteOne }) => {
  return (
    <div>
      <ul>
        {persons.map((person, i) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deleteOne(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Person;
