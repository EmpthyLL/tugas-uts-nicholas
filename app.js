const express = require("express");
const exlay = require("express-ejs-layouts");
const { check, body, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const auth = require("./App/Middlewares/auth");
const upload = require("./Utils/upload");
const { home } = require("./app/controller/home");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(exlay);
app.use(express.static("public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(auth);

app.get("/", (req, res) => {
  home(req, res);
});
app.get("/home", (req, res) => {
  home(req, res);
});

// // Route to serve the form for image upload
// app.get("/upload", (req, res) => {
//   res.send(`
//     <form action="/upload" method="POST" enctype="multipart/form-data">
//       <input type="file" name="image" accept="image/*" required />
//       <button type="submit">Upload Image</button>
//     </form>
//   `);
// });

// const userPP = upload("ProfilePic");
// // Route to handle image upload
// app.post("/upload", userPP.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   // Successfully uploaded
//   res.send(
//     `Image uploaded successfully: <a href="/uploads/${req.file.filename}">View Image</a>`
//   );
// });

app.use((req, res) => {
  res.status(404);
  res.render("error/404", {
    layout: "error/error_view",
    title: "404 Page Not Found",
    code: "4 0 4",
    message: "<b>Whoops!</b> We couldn't find what you were looking for.",
  });
});

app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${port}`);
});
