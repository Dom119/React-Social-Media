const express = require('express')
const app = express()

const connectDB = require('./config/database')
connectDB();

const PORT = process.env.PORT || 5000;

//Init Middleware ----------------------------

//body parser - to read json request sent in
app.use(express.json({ extended: false }))

//--------------------------------------------

//main route
app.get('/', (req, res) => res.send(`API Running`))

//Define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`) )