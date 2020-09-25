const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('password required as argument')
	process.exit(1)
}

const password = process.argv[2]
const dbname = 'fullstack'
const url = `mongodb+srv://test:${password}@cluster0.bin5b.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('person', personSchema)

if (process.argv.length > 3) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})
	person.save().then((returnedPerson) => {
		console.log(
			`added ${returnedPerson.name} number ${returnedPerson.number} to phonebook`
		)
		mongoose.connection.close()
	})
} else {
	console.log('phonebook:')
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`)
			mongoose.connection.close()
		})
	})
}
