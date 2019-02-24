const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cokieParser = require("cookie-parser");
const configRoutes = require("./routes");
const exhbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
app.use("/public", static);
app.use(bodyParser.json());
app.use(cokieParser());
app.engine("handlebars", exhbs({defaultLayout:"main"}))
app.set("view engine", "handlebars");
configRoutes(app);
app.listen(3000, (res,err) => {
    if(err) {
        console.log("Unable to connect");
    }
    console.log("Server is up and running at http://localhost:3000/");
})


