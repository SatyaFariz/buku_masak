const mongoose = require('mongoose')
const { Schema } = mongoose

const unitSchema = new Schema({
  display: String
})

module.exports = unitSchema


