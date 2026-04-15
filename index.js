require("dotenv").config();

const Person = require("./models/person.js");

const express = require("express");
const morgan = require("morgan");
const app = express();

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

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();

  const page = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toString()}</p>
  `;

  console.log(page);
  res.send(page);
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch(() => res.status(404).end());
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id != id);

  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 100000);

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  // if (persons.find((person) => person.name == body.name)) {
  //   return res.status(400).json({
  //     error: `${body.name}'s info already exists`,
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: String(body.number),
    id: String(generateId()),
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch(() => console.log("Save failed!"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
