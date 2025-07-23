// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// set up Express as an instance
const app = express()

// define the port we will be using
const PORT = 3001

// make sure we can parse the JSON body if sent
app.use(express.json());

// code to serve static files from the public dir on server
app.use(express.static(path.join(__dirname, "public")));

// create a defintition for the data file
const dataFilePath = path.join(__dirname, "data.json");

// function to read data from the JSON file
const readData = () => {
    // check if the file exists using fs inbuild method
    if (!fs.existsSync(dataFilePath)) {
        //return nothing if no file
        return []
    }
    // set the data defintion by reading the file using fs inbuilt method
    const data = fs.readFileSync(dataFilePath)
    // Return JSON data as array
    return JSON.parse(data)
}

const writeData = (data_ => {
    // use fs method writeFileSync to write a file with the data which is converted into a JSON string, no filters/all records, 2 space indented
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
})

