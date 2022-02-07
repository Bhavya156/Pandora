//-FILE DESCRIPTION: Used to create a new user

const express = require("express"); // acquired express
const router = express.Router(); // acquired express router

require("../database/connect"); //connected database
const userSchema = require("../models/userSchema"); // acquired user schema

router.get("/", (req, res) => {
  res.send("Hello from the server router");
}); //shown if homepage is visited

//start of post method to send data to database
router.post("/signup", async (req, res) => {
  const { fName, lName, email, password } = req.body; //object destructuring, Eg.: req.body.name = name

  if (!fName || !lName || !email || !password) {
    //if any field is empty return error
    return res
      .status(422)
      .json({ error: " Please enter fill all the fields properly" });
  }

  try {
    const userExists = await userSchema.findOne({ email: email }); //find if user already exists

    if (userExists) {
      return res.status(422).json({ error: "Email already exists" });
    }

    const user = new userSchema({ fName, lName, email, password }); //create new object of type userSchema

    const userCreate = await user.save(); //send new user's data to database
    if (userCreate) {
      res.status(201).json({ message: "User registered succesfully" });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
