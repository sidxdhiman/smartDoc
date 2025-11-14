// models/issuerDB.js
import mongoose from 'mongoose';

const issuerDBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Change the export to use default
const IssuerDB = mongoose.model('IssuerDB', issuerDBSchema);
export default IssuerDB;