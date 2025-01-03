const languages = (country) => {
  return (
    <ul>
      {Object.values(country.languages).map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
  );
};

const Countries = ({ countries, handleShow }) => {
  if (countries.length == 0) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length == 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <p>capital {countries[0].capital}</p>
        <p>area {countries[0].area}</p>

        <h2>languages</h2>
        {languages(countries[0])}

        <img src={countries[0].flags.png} alt="" />
      </div>
    );
  }

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleShow(country.name.common)}>
              show
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Countries;
