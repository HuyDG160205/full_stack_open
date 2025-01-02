const Countries = ({ countries }) => {
  if (countries.length == 0) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length == 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <p>capital {countries[0].capital}</p>
        <p>population {countries[0].population}</p>
        <img src={countries[0].flags.png} alt="" />
      </div>
    );
  }

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>{country.name.common}</li>
        ))}
      </ul>
    </div>
  );
};

export default Countries;
