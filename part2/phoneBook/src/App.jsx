import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Person from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // const [formState, setFormState] = useState({
  //   name: "",
  //   number: "",
  // });

  //can do this

  // const handleChange = (event) => {
  //   setFormState({
  //     [event.target.name]: event.target.value,
  //   });
  // };

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const isDup = () => {
    for (let person of persons) {
      if (newName === person.name) {
        return confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        );
      }
    }

    // //return a value - undefined
    // return persons.find((person) => {
    //   person.name === newName;
    // });

    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newName) {
      alert("Must not be blank");
      return;
    }

    if (isDup()) {
      const person = persons.find((person) => person.name === newName);
      const newPerson = { ...person, number: newNumber };
      personService.updateExist(person.id, newPerson).then((response) => {
        setPersons(
          persons.map((person) =>
            person.id === response.id ? response : person
          )
        );
      });
      return;
    }

    personService
      .create({
        name: newName,
        number: newNumber,
        id: (persons.length + 1).toString(),
      })
      .then((response) => {
        setPersons(persons.concat(response));
      });

    setNewName("");
    setNewNumber("");
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

  const handleDelete = (id) => {
    personService
      .deleteOne(id)
      .then(() => setPersons(persons.filter((p) => p.id !== id)));
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

      <Person persons={filtered} deleteOne={handleDelete} />
    </div>
  );
};

export default App;
