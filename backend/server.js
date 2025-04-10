const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '..')));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(port, ()=>{
    console.log(`Сервер запущен: http://localhost:${port}/`);
})