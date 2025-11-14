import mongoose from "mongoose";
import IssuerDB from "../models/issuerDB.js"; // Changed to match the default export
import "dotenv/config";
// Connect to MongoDB
mongoose
  .connect('mongodb+srv://smartdoc:smartdoc@smartdoc.rwibg.mongodb.net/?retryWrites=true&w=majority&appName=smartdoc', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create array of student documents
const students = [
  {
    name: "Priyanshu Sharma",
    rollNo: "R2024001",
    dateOfBirth: new Date("2002-05-15"),
    phoneNumber: "9876543210",
  },
  {
    name: "Raghav Gupta",
    rollNo: "R2024002",
    dateOfBirth: new Date("2001-08-23"),
    phoneNumber: "8765432109",
  },
  {
    name: "Tanya Malhotra",
    rollNo: "R2024003",
    dateOfBirth: new Date("2002-02-14"),
    phoneNumber: "7654321098",
  },
  {
    name: "Vikrant Singh",
    rollNo: "R2024004",
    dateOfBirth: new Date("2001-11-30"),
    phoneNumber: "9987654321",
  },
  {
    name: "Harsh Patel",
    rollNo: "R2024005",
    dateOfBirth: new Date("2002-03-19"),
    phoneNumber: "9876549876",
  },
];

// Insert multiple documents
IssuerDB.insertMany(students)
  .then(() => {
    console.log("All students inserted successfully");
    mongoose.disconnect(); // Disconnect after the operation
  })
  .catch((err) => {
    console.error("Error inserting students:", err);
    mongoose.disconnect(); // Ensure disconnection on error
  });
