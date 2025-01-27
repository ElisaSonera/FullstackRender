import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [filter, setFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: phoneNumber,
    };

    if (personExists(personObject)) {
      const foundPerson = persons.find(
        (person) => person.name === personObject.name
      );
      foundPerson.number = personObject.number;
      updatePerson(foundPerson.id, foundPerson);
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setPhoneNumber("");
        setSuccessMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      });
    }
  };

  const personExists = (personObject) => {
    return persons.some((person) => person.name === personObject.name);
  };

  const updatePerson = (id, personObject) => {
    if (
      window.confirm(
        `${personObject.name} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      personService
        .update(id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== id ? person : returnedPerson
            )
          );
          setSuccessMessage(`Updated ${personObject.name}s phonenumber`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 4000);
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${personObject.name} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 4000);
        });
    }
    return;
  };

  const handlePersonChange = (event) => {
    console.log("Handle person: ", event.target.value);
    setNewName(event.target.value);
  };

  const handlePhoneNumber = (event) => {
    console.log("Handle number: ", event.target.value);
    setPhoneNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setShowAll(false);
  };

  const personsToShow = showAll
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  const deletePerson = (id) => {
    const person = persons.find((n) => n.id === id);
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setSuccessMessage(`Deleted ${person.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 4000);
        })
        .catch((error) => console.log("Deletion failed: ", error));
    }
    return;
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <Filter handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        phoneNumber={phoneNumber}
        handlePhoneNumber={handlePhoneNumber}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
