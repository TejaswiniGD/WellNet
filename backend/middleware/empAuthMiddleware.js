const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');  // token extracted and stored in token
  console.log(token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });   // checks wheather the token is empty or not 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.employee;
    // console.log(req.user, "middleware");
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
    console.log("error code")
  }
};
