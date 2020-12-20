const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  // Get the token from the headers
  // Check if there is no token
  // If there is token, try it
  const token = req.header('x-auth-token');


  if (!token) {
    return res.status(401).json({msg: 'No token, access denied'})
  }


  try {
    const decoded = jwt.verify(token, config.get('jwtToken')) //decode the token
    req.user = decoded.user;
    next();

  } catch (error) {
    res.status(401).json({msg: 'Token is not valid, access denied'})
  }
}