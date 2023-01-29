const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors")
const { logger } = require("./middlewares/logEvents");
const PORT = process.env.PORT || 3500;

//custom mddleware logger
app.use(logger);

//Cross Origin Resource Sharing
app.use(cors())

//built-in middleware to handle urlencoded data
//in othr words, form data:
//'contenet-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for jason
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
