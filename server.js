
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected"))
.catch(err=>console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/items', require('./routes/items'));
app.use('/api/settings', require('./routes/settings'));

app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("Server running on "+PORT));
app.use('/api/upload', require('./routes/upload'));
