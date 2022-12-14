const mongoose = require('mongoose');

let SalaryInvoice = require('../models/salaryInvoice.model');

const Schema = mongoose.Schema;

const salaryRecordSchema = new Schema({
  // the basic pay of the employee per month
  basicPay: {
    type: Number,
    required: true,
  },
  // total amount of the salary paid to the employee till date
  amountPaid:{
    type: Number,
    required:true,
    },  
    // total amount of salary that needs to be paid and is due
  amountDue:{
    type: Number,
    required:true,
    },  
    // the date at which the employee becomes eligible for next salary(joining date)
  dueDate: {
    type: Date,
    },
    // array of _id of salary Invoices
  salaryInvoiceIds:[{
    type:Schema.Types.ObjectId ,ref:"SalaryInvoice",
  }],

}, {
  timestamps: true,
});
  

const SalaryRecord = mongoose.model('SalaryRecord', salaryRecordSchema);
SalaryRecord.createIndexes();
module.exports = SalaryRecord;