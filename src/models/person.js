const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('Opening connection to database')
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => console.log('Connected to database'))
	.catch((error) => console.log('Database connection failed: ', error))

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
	},
	number: {
		type: String,
		required: true,
		minlength: 8,
	},
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Person', personSchema)
