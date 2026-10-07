const User = require('../models/userModel');

exports.LoginFailed = (req, res) => {
  console.error("Login failed");
  return res.status(401).json({
    error: true,
    message: "Login Failure",
  });
};

exports.LoginSuccess = (req, res) => {
  const user = req.user || req.session?.user;
  if (user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: user,
      message: "Successfully Logged In",
    });
  } else {
    return res.status(401).json({
      isAuthenticated: false,
      message: "Not Authorized",
    });
  }
};

exports.FirebaseLogin = async (req, res) => {
  try {
    const { name, email, imageURL } = req.body;
    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email: email,
        imageURL: imageURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
      });
      await user.save();
    } else if (imageURL && !user.imageURL) {
      user.imageURL = imageURL;
      await user.save();
    }

    req.session.user = user;
    return res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: user,
      message: "Firebase login successful"
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    return res.status(500).json({ error: true, message: "Firebase login failed", details: error.message });
  }
};

exports.LogOut = (req, res) => {
  const finishLogout = () => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.clearCookie("connect.sid", { path: "/" });
        return res.status(200).json({ success: true, message: "Logout successful" });
      });
    } else {
      res.clearCookie("connect.sid", { path: "/" });
      return res.status(200).json({ success: true, message: "Logout successful" });
    }
  };

  if (typeof req.logout === 'function') {
    try {
      req.logout((err) => {
        if (err) console.error("Passport logout error:", err);
        finishLogout();
      });
    } catch (err) {
      console.warn("req.logout error:", err);
      finishLogout();
    }
  } else {
    finishLogout();
  }
};
