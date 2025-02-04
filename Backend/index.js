require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // 3.7 morgan käyttöön npm installin jälkeen
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
// app.use(morgan("tiny")); // 3.7 morganin tiny-konfiguraatio

morgan.token("body", (req, res) => JSON.stringify(req.body)); // 3.8 luodaan body-token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
); // 3.8 tiny + body

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end(); // 3.3 Kai tämä on se "asianmukainen" statuskoodi?
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  // 3.4 "Numerotiedon yksilöivä URL" on siis kai id url?
  // const id = request.params.id;
  // persons = persons.filter((person) => person.id !== id);

  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = (persons) => {
//   const randomId = Math.floor(Math.random() * 1000) + 1; //3.5 ehkä 1-1000 on riittävän iso arvoväli?
//   if (persons.some((person) => person.id === randomId)) {
//     //varmistetaan, että listalla ei ole jo samalla ID:llä henkilöä
//     return generateId(persons); //rekursio jos on!
//   }
//   return String(randomId);
// };

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // 3.6 error jos nimi tai numero puuttuu
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  Person.findOne({ name: body.name }).then((result) => {
    if (result) {
      return response.status(409).json({
        error: "name must be unique",
      });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
        //id: generateId(persons), -- ilmeisesti mongoDB generoi id:n jatkossa?
      });

      person.save().then((savedPerson) => {
        response.json(savedPerson);
      });
    }
  });

  // if (persons.some((person) => person.name === body.name)) {
  //   // 3.6 error jos nimi on jo luottelossa
  //   return response.status(409).json({
  //     error: "name must be unique",
  //   });
  // }
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
