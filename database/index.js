const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routers');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.log('Missing or Invalid MONGODB_CONNECTION_STRING in .env'))
// Example of connection string: mongodb+srv://<db_username>:<db_password>@cluster0.wvdi4mr.mongodb.net/<database_name>?appName=Cluster0

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});