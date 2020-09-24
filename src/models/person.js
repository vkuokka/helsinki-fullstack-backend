const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Opening connection to database')
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(result => console.log('Connected to database'))
	.catch(error => console.log('Database connection failed: ', error))

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)
