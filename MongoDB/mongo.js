const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const username = process.argv[3]
const phonenumber = process.argv[4]

const url = `mongodb+srv://sonera:${password}@cluster0.skdkd.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=puhelinluettelo`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: username,
  number: phonenumber
})

if (process.argv.length === 3) {
  Person.find({})
    .then((result) => {
      console.log('phonebook:')
      result.forEach((person) => {
        console.log(person.name, person.number)
      })
    })
    .finally(() => {
      mongoose.connection.close()
    })
} else {
  person.save().then((result) => {
    console.log(`added ${username} number ${phonenumber} to phonebook`)
    mongoose.connection.close()
  })
}
