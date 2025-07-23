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

const writeData = (data => {
    // use fs method writeFileSync to write a file with the data which is converted into a JSON string, no filters/all records, 2 space indented
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
})

const maxID = (data => {
    if (data.length === 0){return 0}
    let currID = Math.max(...data.map(o => o.id))
    return currID
})

const timeDay = new Date()

// TODO: Might be a good to have a function that has a list of fields and required fields then checks the submitted body request to check if they have used all the necessary ones or if they have used incorrect ones. 


// Handle GET request at root to show public index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.htm"))
})

// CREATE Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
    try{
        // get the current data from the file
        const currentData = readData()
        // get the current maximum ID in the array
        currID = maxID(currentData)
        currID++
        // create the new data using the body of the request
        const newData = { id: currID, ...req.body, postedAt: timeDay, editAt: null }
        // check that they are uploading a content key 
        if (!("content" in req.body)){
            res.status(500).json({ message: "Invalid content upload", data: newData });
        }
        // add the new data to the existing data
        currentData.push(newData)
        // write all the data to a file using our function
        writeData(currentData)
        res.json({ message: "Data saved successfully", data: newData });
    }catch (err) {
        // more serious error 
        res.status(500).send("Server Error:\n"+err)
    }
})

// READ Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
    try{
        // read the current data
        const data = readData();
        if (data.length > 0){// check if there is anything in the array
            // respond with the data and a message
            res.status(201).json({message: "Success!", data: data })
        }else{// if there is not data then send a response to say so
            res.status(404).send("No Current Data to Display!")
        }
    }catch(err){
        // more serious error 
        res.status(500).send("Server Error:\n"+err)
    }
});

// UPDATE Handle PUT requests to update a record
app.put("/data/:id", (req, res) => {
    try{
        const data = readData()
        // finds the index that the correct record is stored under by searching for the passed ID
        const index = data.findIndex((item) => item.id === parseInt(req.params.id))
        // checks if we found data:
        if (index === -1) {
            return res.status(404).send("Data not found");
        }
        // write newdata directly to the array index rather than removing and then pushing the newdata
        updatedData = { ...data[index], ...req.body, editAt: timeDay }
        data[index] = updatedData
        writeData(data);
        res.json({ message: "Data updated successfully", data: updatedData });
    }catch(err){
        // more serious error 
        res.status(500).send("Server Error:\n"+err)
    }
})

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});