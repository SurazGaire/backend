const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		`Provide your password as an argument : node mongo.js <password>`
	);
} else {
	const password = process.argv[2];
	const url = `mongodb+srv://fullstack:${password}@cluster0.obrth.mongodb.net/myPhonebook?retryWrites=true&w=majority`;

	mongoose.connect(url);

	const personSchema = new mongoose.Schema({
		name: String,
		number: Number,
	});

	const Person = new mongoose.model("Person", personSchema);

	if (process.argv.length === 3) {
		Person.find({}).then((people) => {
			people.forEach((person) => {
				console.log(person.name, person.number);
			});
			mongoose.connection.close();
		});
	}

	if (process.argv.length > 3) {
		const name = process.argv[3];
		const number = process.argv[4];
		const person = new Person({
			name: name,
			number: number,
		});

		person.save().then((result) => {
			console.log(`Person Added`, result);
			mongoose.connection.close();
		});
	}
}
