import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    function (tokens, req, res) {
      //if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens["type"](req, res),
      ].join(" ");
    }
    //}
  )
);
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <br/>
    <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  let id = req.params.id;
  const index = persons.findIndex((person) => person.id === id);
  if (index >= 0) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    ...body,
    id: generateId().toString(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  const updatedPersons = {
    ...person,
    name: body.name,
    number: body.number,
  };

  persons = persons.map((person) => {
    if (person.id === id) {
      return updatedPersons;
    }
    return person;
  });

  res.json(updatedPersons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
