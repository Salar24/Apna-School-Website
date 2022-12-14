const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  firstName: {
    type: String,
    required: true,

  },
  lastName: {
    type: String,

  },
  age: {
    type: Number,

  },

}, {
  timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);
Admin.createIndexes();
module.exports = Admin;