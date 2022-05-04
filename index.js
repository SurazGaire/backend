// require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
const morgan = require("morgan");

const cors = require("cors");

const app = express();

app.use(express.static("build"));

app.use(cors());
app.use(express.json());

morgan.token("body", (request) => JSON.stringify(request.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Either name or number is missing",
		});
	}
	// const nameMatch = Person.filter((p) => p.name.includes(body.name));
	// if (nameMatch.length !== 0) {
	// 	return response.status(400).json({
	// 		error: "Name must be unique",
	// 	});
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			console.log(savedPerson);
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((person) => {
		response.json(person);
	});
});

// app.get("/info", (request, response) => {
// 	response.send(`<h4>Phonebook has info of ${persons.length} people</h4>
//     <h4>${new Date()}</h4>
//     `);
// });

app.delete("/api/persons/:id", (request, response, next) => {
	console.log(request.params.id);
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
