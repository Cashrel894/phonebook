const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cashrel894:${password}@phonebook.6nhx87h.mongodb.net/?appName=Phonebook`;

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

async function addNewPerson(name, number) {
  const newPerson = new Person({
    name,
    number,
  });
  await newPerson.save();

  console.log(`added ${name} number ${number} to phonebook`);
}

async function getAllPeople() {
  const people = await Person.find({});

  console.log("phonebook:");
  people.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
}

let method;
if (process.argv.length === 3) {
  method = getAllPeople;
} else if (process.argv.length == 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  method = () => addNewPerson(name, number);
} else {
  console.log("Invalid arguments.");
  process.exit(1);
}

method().then(() => mongoose.connection.close());
