import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Person from "./components/Persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const isDup = () => {
    for (let person of persons) {
      if (newName === person.name) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newName) {
      alert("Must not be blank");
      return;
    }

    if (isDup()) {
      alert(`${newName} already existed`);
      return;
    }

    setPersons(
      persons.concat({ name: newName, number: newNumber, id: persons.length })
    );
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter)
  );

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm
        handleNameChange={handleNameChange}
        handleSubmit={handleSubmit}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>

      <Person persons={filtered} />
    </div>
  );
};

export default App;
