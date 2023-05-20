const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

router.post(
  "/",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password above 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
    return  res.status(400).json({ error: error.array() });
    }

    const { name, email, password } = req.body;
    try {
      let userCheck = await User.findOne({ email });

      if (userCheck) {
        return res
          .status(400)
          .json({ error: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "gp",
        d: "mm",
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        email,
        name,
        password: hashedPassword,
        avatar,
      });

      await user.save();
      // res.send("user has been saved");

      const payload = {
        user: {
          id: user.id,
        },
      };

      const secret = config.get("secret");

      jwt.sign(payload, secret, { expiresIn: 450000 },(err, token) => {
        if (err) throw err;
        res.json({ token });
      }
);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
