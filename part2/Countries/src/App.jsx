import { useEffect, useState } from "react";
import countriesService from "./services/countries";
import Countries from "./components/Countries";
import Filter from "./components/Filter";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [newContries, setNewContries] = useState([]);

  useEffect(() => {
    countriesService
      .getAll()
      .then((response) => setCountries(response))
      .catch((error) => console.log(error));
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const filtered =
    countries.filter((country) =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    ).length > 10
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <Filter handleFilter={handleFilter} />

      <br />

      <Countries countries={filtered} />
    </div>
  );
}

export default App;
