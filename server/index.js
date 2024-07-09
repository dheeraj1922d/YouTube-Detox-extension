const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/UserDetails")
const database = require("./config/mongodb");
require("dotenv").config();

const PORT = process.env.PORT || 3000;


database.connect();

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', routes)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})