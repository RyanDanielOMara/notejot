/**
 * Load Express module, create an instance of express, declare port and start
 * server. 
*/

const express = require('express');
const app     = express();
const port    = 5000;

// Index route
app.get('/', (req, res) => {
    res.send('Index');
});

// About route
app.get('/about', (req, res) => {
    res.send('About')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});