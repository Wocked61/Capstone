const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/routers');
const mongoose = require('mongoose');
require('dotenv/config');

const app =  express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' }); // Health check endpoint
});

// Connect to MongoDB
mongoose.connect(process.env.DB_URI)
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log('DB Connection Error:', err))

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});