const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fullstackopen:${password}@cluster0.tr7cnvy.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongo.set('strictQuery', false)
mongo.connect(url)
console.log(process.argv[3], process.argv[4])
const personSchema = new mongo.Schema({
    name: String,
    number: String,
})

const Person = mongo.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv[3] && process.argv[4]) {
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongo.connection.close()
    })
}
Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongo.connection.close()
})
