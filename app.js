const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const router = require("./routes");
var cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const logRequestUrl = (req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    next();
};
app.use(logRequestUrl);
app.use("/api", router);

app.use(errorHandler);

app.listen(port, () => {
    console.log("Server open on port", port);
});
