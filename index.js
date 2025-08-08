const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sample', require('./route/sampleroute'));
app.use('/api/auth', require('./route/authRoute'));

app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
