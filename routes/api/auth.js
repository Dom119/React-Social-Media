const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require("../../models/User")
const bcrypt = require('bcryptjs')



// route    GET api/auth
// desc     Get user by token
// access   public (we do not a token for)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password') //no password
    res.json(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})


// route  POST api/auth
// desc   Login | Get the token so we can get request to private route
// access Public

router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password','Password required').exists()
], async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
    };
  //if all good, register the user to our database
    
  // 1. if user exists => send back an error: note that all mongoose is Async/await
  // 2. if not, get user gravatar ???
  // 3. Encrypt password
  // 4. Return jsonwebtoken, so they login right away in the UI
    
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email })
      
      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]}) // just to match the style of error in UI
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
      }
      
      //send back jwt
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({token})
        }
      )


    } catch (err) {
      console.log(err);
      res.status(500).send('Server Errors.')
    }
  
})
module.exports = router;