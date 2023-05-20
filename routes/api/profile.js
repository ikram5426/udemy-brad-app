const express = require("express");
const auth = require("../../middleware/auth");
const Profile = require("../../models/profile");
const User = require("../../models/user");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const request=require("request");
const config=require("config");

//Get profile

router.get("/me", auth, async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!userProfile) {
      return res.status(400).json({ message: "No user profile found" });
    }
    res.json(userProfile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

//Create or update a user profile

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const checkError = validationResult(req);
    if (!checkError.isEmpty()) {
      res.status(400).send({ err: checkError.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileField = {};
    profileField.user = req.user.id;
    if (company) profileField.company = company;
    if (website) profileField.website = website;
    if (location) profileField.location = location;
    if (bio) profileField.bio = bio;
    if (status) profileField.status = status;
    if (githubusername) profileField.githubusername = githubusername;
    if (skills) {
      profileField.skills = skills.split(" ").map((skill) => skill.trim());
      console.log(profileField.skills);
    }
    profileField.social = {};

    if (youtube) profileField.social.youtube = youtube;
    if (facebook) profileField.social.facebook = facebook;
    if (twitter) profileField.social.twitter = twitter;
    if (instagram) profileField.social.instagram = instagram;
    if (linkedin) profileField.social.linkedin = linkedin;

    try {
      let isProfile = await Profile.findOne({ user: req.user.id });

      if (isProfile) {
        isProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileField },
          { new: true }
        );
        return res.json(isProfile);
      }

      isProfile = new Profile(profileField);
      await isProfile.save();
      res.json(isProfile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Bad server request");
    }
  }
);

//Get all profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Bad server request");
  }
});

//Get user profile by user ID

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).send("No profile found");
    res.json(profile);
  } catch (error) {
    if (error.kind == "ObjectId") {
      console.log(error.message);
      return res.status(400).send("No profile found");
    }
    console.log(error.message);
    res.status(500).send("Bad server request");
  }
});

//Delete profile

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Bad server request");
  }
});

//Update experience
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);

      await profile.save();

      res.send(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Delete Experience

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex == -1) {
      return res.send("no experience available");
    }

    profile.experience.splice(removeIndex, 1);
    profile.save();

    return res.send(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

//Update education
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.send(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Delete Education

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (removeIndex == -1) {
      return res.send("no education available");
    }

    profile.education.splice(removeIndex, 1);
    profile.save();

    return res.send(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

//Get user github repositories

router.get('/github/:username',(req,res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repo?per_page=5&sort=created:asc&client_id=${config.get(
        "gitClientID"
      )}&client_secret=${config.get("gitClientSecret")}`,
      method: "GET",
      headers:{'user-agent':'node.js'}
    };

request(options,(error,response,body)=>{
if (error){return console.log(error)}
if(response.statusCode!=200){
 return res.status(404).json({message:"No gitHub profile found"})
}
return res.send(JSON.parse(body))

}) 

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
})







module.exports = router;
