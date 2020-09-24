require('dotenv').config()
const { response } = require('express')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

morgan.token('content', (request) => {
	return JSON.stringify(request.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())

// let persons =  [
// 	{
// 		"name": "Arto Hellas",
// 		"number": "040-123456",
// 		"id": 1
// 	},
// 	{
// 		"name": "Ada Lovelace",
// 		"number": "39-44-5323523",
// 		"id": 2
// 	},
// 	{
// 		"name": "Dan Abramov",
// 		"number": "12-43-234345",
// 		"id": 3
// 	},
// 	{
// 		"name": "Mary Poppendieck",
// 		"number": "39-23-6423122",
// 		"id": 4
// 	}
// ]

// const createId = () => {
// 	return Math.floor(Math.random() * Math.floor(1000));
// 	// return persons.length > 0
// 	// ? Math.max(...persons.map(person => person.id)) + 1
// 	// : 0
// }

app.get('/api/persons', (request, response, next) => {
	Person.find({})
	.then(result => response.json(result))
	.catch(error => next(error))
})

app.get('/info', (request, response, next) => {
	Person.countDocuments().then(result => {
		response.send(`
			<div>
			<p>Phonebook has info for ${result} people</p>
			<p>${new Date()}</p>
			</div>`
		)
	}).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(result => {
		result ? response.json(result) : response.status(404).end()
	}).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id).then(result => {
		response.status(204).end()
	}).catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
	const body = request.body
	if (!body) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	Person.find({}).then(result => {
		if (result.find(person => person.name == body.name)) {
	 		return response.status(400).json({
	 			error: "name must be unique"
			})
		}
		// person.id = createId();
		// persons = persons.concat(person)
		person = new Person ({
			name: body.name,
			number: body.number
		})
		person.save(person)
		.then(result => response.json(result))
		.catch(error => next(error))
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const person = {
		name: body.name,
		number: body.number
	}
	Person.findByIdAndUpdate(request.params.id, person, {new: true})
	.then(updatedPerson => {
		response.json(updatedPerson)
	}).catch(error => next(error))
})

const unknownEndpoint = (request, response, next) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError' && error.kind == 'ObjectId') {
	  return response.status(400).send({ error: 'malformatted id' })
	} 
  
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
