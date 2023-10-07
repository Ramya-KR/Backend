const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()

const Person = require('./models/person')

logger.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())
app.use(express.static('build'))

const date = new Date()

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<br/>
    ${date}
    </p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.send(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response) => {
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

app.put('api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body.name)
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
  console.log(error, request)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})