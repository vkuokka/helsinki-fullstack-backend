const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('content', (request) => {
	return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons =  [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
]

const createId = () => {
	return Math.floor(Math.random() * Math.floor(1000));
	// return persons.length > 0
	// ? Math.max(...persons.map(person => person.id)) + 1
	// : 0
}

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(`
	<div>
	<p>Phonebook has info for ${persons.length} people</p>
	<p>${new Date()}</p>
	</div>`
	)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
	const person = request.body
	if (!person) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	if (!person.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (!person.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	if (persons.find(x => x.name === person.name)) {
		return response.status(400).json({
			error: "name must be unique"
		})
	}
	person.id = createId();
	persons = persons.concat(person)
	response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})