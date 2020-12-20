const express = require('express')
const router = express.Router();

const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/User')

// route    POST api/users
// desc     Register User
// access   public (we do not a token for)
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password','Please enter a password with 6 or more characters').isLength({min: 6})
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
    
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email })
      
      if (user) {
        return res.status(400).json({errors: [{msg: 'User already exist'}]}) // just to match the style of error in UI
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name, email, avatar, password
      })

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      
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