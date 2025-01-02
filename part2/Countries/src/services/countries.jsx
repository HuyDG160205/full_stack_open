import axios from "axios";

const getAll = () => {
  const request = axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/all"
  );

  return request.then((response) => response.data);
};

const getCountry = (name) => {
  const request = axios.get(
    "https://studies.cs.helsinki.fi/restcountries/api/name/" + name
  );

  return request.then((response) => response.data);
};

export default { getAll, getCountry };
