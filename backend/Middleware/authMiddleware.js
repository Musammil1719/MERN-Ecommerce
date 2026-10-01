const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_ecommerce_secret_key";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);
    console.log("SECRET:", JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = {
      id: decoded.id,
    };

    console.log("TOKEN USER:", req.user.id);
    console.log("AUTH MIDDLEWARE SUCCESS - CALLING NEXT");

    next();
  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;