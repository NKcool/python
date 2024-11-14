const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to parse URL-encoded data (form data)
app.use(bodyParser.urlencoded({ extended: true }));

// API route to handle form data
app.post('/submit-form', (req, res) => {
    const formData = req.body;

    // Spawn a Python process to execute the Python script
    const pythonProcess = spawn('python3', ['process_form.py', JSON.stringify(formData)]);

    let pythonOutput = '';

    // Collect data from Python stdout
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    // Handle Python process close event
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // If Python script exits successfully
            const result = JSON.parse(pythonOutput);
            res.status(200).json(result);
        } else {
            // If there is an error in the Python script
            res.status(500).json({ error: 'Python script execution failed' });
        }
    });

    // Handle any errors from the Python process
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
        res.status(500).json({ error: 'Error in Python script execution' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
