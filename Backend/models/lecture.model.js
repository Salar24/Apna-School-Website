const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  
  lectureID: {
    type: String,
    required: true
  },

  date: {
    type: Date
  },

  topic: {
    type: String,
    required: true
  }

},
 {
  timestamps: true,
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;