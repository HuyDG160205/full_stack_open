import axios from "axios";

const getAll = () => {
  const request = axios.get("http://localhost:3001/persons");
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post("http://localhost:3001/persons", newObject);
  return request.then((response) => response.data);
};

const deleteOne = (id) => {
  const request = axios.delete(`http://localhost:3001/persons/${id}`);
  return request.then((response) => response.data);
};

const updateExist = (id, newObject) => {
  const request = axios.put(`http://localhost:3001/persons/${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAll, create, deleteOne, updateExist };
