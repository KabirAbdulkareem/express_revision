const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 3500;

//custom mddleware logger
app.use(logger);

//Cross Origin Resource Sharing
const whitelist = [
  "http://example1.com",
  "https://mui-social-dashboard.vercel.app",
  "http://127.0.0.1:5500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//error middleware handler for undefiend origin
//an example of this is when the request is comming from the development server
//in which case the value of the origin in the header is assigned the value "Undefine"
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
