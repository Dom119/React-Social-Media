const express = require('express')
const router = express.Router();
const request = require('request')
const config = require('config')
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')


// route    GET api/profile/me
// desc     Just a user ID based on the token / current user profile
// access   private
router.get('/me', auth, async (req, res) => {
  try {
    
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile with this user' });
    }

    res.json(profile)

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})


//----------------------------------------------------------
// route    POST api/profile
// desc     Create / Update a user profile
// access   private

router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body
    
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    company ? profileFields.company = company : null
    website ? profileFields.website = website : null
    location ? profileFields.location = location : null
    bio ? profileFields.bio = bio : null
    status ? profileFields.status = status : null
    githubusername ? profileFields.githubusername = githubusername : null
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim())

    //Build social object
    profileFields.social = {}
    youtube ? profileFields.social.youtube = youtube : null
    twitter ? profileFields.social.twitter = twitter : null
    facebook ? profileFields.social.facebook = facebook : null
    linkedin ? profileFields.social.linkedin = linkedin : null
    instagram ? profileFields.social.instagram = instagram : null

    try {
      
      let profile = await Profile.findOne({user: req.user.id})

      if (profile) {
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
        console.log('Iam here');
        return res.json(profile)
      } else {
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile)
      }

    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error')
    }
})


//----------------------------------------------------------
// route    GET api/profile
// desc     Get all profile
// access   public

router.get('/', async (req, res) => {
  try {
    
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])

    res.json(profiles)

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})



//----------------------------------------------------------
// route    GET api/profile/user/:user_id
// desc     Get a profile by user ID
// access   public

router.get('/user/:user_id', async (req, res) => {
  try {
    
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({msg: 'There is no profile for this user id'})
    } else {
      return res.json(profile)
    }

  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({msg: 'There is no profile for this user id'})
    } else {
      return res.status(500).send('Server Error')
    }
  }
})

//----------------------------------------------------------
// route    GET api/profile/
// desc     Delete profile, user and posts
// access   private

router.delete('/', auth, async (req, res) => {
  try {
    // Remove profile
    // Remove user
    // Remove user posts
    await Post.deleteMany({user: req.user.id})
    await Profile.findOneAndRemove({user: req.user.id})
    await User.findOneAndRemove({_id: req.user.id})

    res.json({msg: 'User deleted'})

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})


//----------------------------------------------------------
// route    PUT api/profile/experience
// desc     Added profile experience to an current profile
// access   private

router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From Date is required').not().isEmpty()
]], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  
  try {

    const profile = await Profile.findOne({user: req.user.id})

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile)

  } catch (error) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})

//----------------------------------------------------------
// route    DELETE api/profile/experience/:exp_id
// desc     Delete experience from a profile
// access   private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1)

    await profile.save();

    res.json(profile)

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})


//----------------------------------------EDUCATION-------------------------------------
//----------------------------------------------------------
// route    PUT api/profile/education
// desc     Added profile education to an current profile
// access   private

router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('from', 'From Date is required').not().isEmpty(),
  check('fieldofstudy', 'Field Of Study is required').not().isEmpty()
]], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const {   school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  
  try {

    const profile = await Profile.findOne({user: req.user.id})

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile)

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})

//----------------------------------------------------------
// route    DELETE api/profile/education/:edu_id
// desc     Delete education from a profile
// access   private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    console.log(removeIndex);
    profile.education.splice(removeIndex, 1)

    await profile.save();

    res.json(profile)

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})



//----------------------------------------------------------
// route    GET api/profile/github/:username
// desc     Get user repos from Github
// access   private

router.get('/github/:username', (req, res) => {
  try {

    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
      // uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=c57df31d54194b693457&client_secret=de6fa3337ac4afa47c3efd3c313297b9cc7585b5`,
      method: "GET",
      headers : {"user-agent": "node.js"}
    }
    
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({msg: "No Github profile found"})
      }
      res.json(JSON.parse(body))
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})

module.exports = router;
