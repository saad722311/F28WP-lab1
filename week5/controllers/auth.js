const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// function of register
exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;
  db.query(
    "SELECT email FROM user_auth WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return (
          res.render("register"),
          {
            message: "This email is already in use..",
          }
        );
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not match",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query("INSERT INTO user_auth SET ?", {
        name: name,
        email: email,
        password: hashedPassword,
      });
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        return res.render("register", {
          message: "User registered",
        });
      }
    }
  );

  res.send("form submitted");
};

// Login function
exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM user_auth WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(401).send({ message: "Email or password is incorrect" });
      }
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ message: "Email or password is incorrect" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expiration time
      });
      
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600000, // Cookie expiration time (1 hour)
      });
      
      res.status(200).send({ message: "Logged in successfully", token });
    }
  );
};

// Logout function
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).send({ message: "Logged out successfully" });
};
