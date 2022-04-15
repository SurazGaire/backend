const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();

app.use(express.static("build"));
let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];
app.use(cors());
app.use(express.json());

morgan.token("body", (request) => JSON.stringify(request.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generatedId = () => {
	const maxLimit = 99999;
	let maxId = Math.random() * maxLimit;
	maxId = Math.floor(maxId);
	return maxId;
};
app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "Either name or number is missing",
		});
	}
	const nameMatch = persons.filter((p) => p.name.includes(body.name));
	if (nameMatch.length !== 0) {
		return response.status(400).json({
			error: "Name must be unique",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generatedId(),
	};
	persons.concat(person);
	response.json(person);
});
app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/info", (request, response) => {
	response.send(`<h4>Phonebook has info of ${persons.length} people</h4>
    <h4>${new Date()}</h4>
    `);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((p) => p.id !== id);
	response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((p) => p.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
