const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()

const Person = require('./models/person')

logger.token('content', function (req, res) { return JSON.stringify(req.body)})

app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())
app.use(express.static('build'))

const date = new Date()

app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request,response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people<br/>
    ${date}
    </p>`)
})

app.get('/api/persons/:id',(request,response) => {
   Person.findById(request.params.id).then(person => {
    response.json(person)
   })
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
      }
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    
    person.save().then(newPerson => {
      response.json(newPerson)
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})