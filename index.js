const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./dbs/db");
const userrouter = require("./route/user.route");
const productrouter = require("./route/product.route");
const cartrouter = require("./route/cart.route");
require("dotenv").config();

app.use(express.json());
app.use(cors({
    origin: "*",
}))

app.use("/user",userrouter)
app.use("/product",productrouter)
app.use("/cart",cartrouter)

const port=process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    connectDB();
    console.log(`Server started on port ${port}`);
});
