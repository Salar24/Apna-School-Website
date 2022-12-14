const mongoose = require('mongoose');
let Section = require('../models/section.model');
let StudentAttendanceRegistry = require('../models/studentAttendanceRegistry.model');

const Schema = mongoose.Schema;

const classSchema = new Schema({
  //The class level (Class 1/2/3 etc)
  classYear : {
    type: Number,
    required:true,
    unique:true
  },
  //The total no. of students in the class (sections combined)
  classStrength : {
    type: Number,
    required: true
  },

  noOfSections : {
    type: Number,
    required : true
  },
  //List of Sections IDs this class contains
  sectionList: 
  [{
    type:Schema.Types.ObjectId ,ref:'Section',  
  }],
}, {
}, {
  timestamps: true,
});
  

const Class = mongoose.model('Class', classSchema);
Class.createIndexes();
module.exports = Class;