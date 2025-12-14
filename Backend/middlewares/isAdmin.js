const isAdmin = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

export default isAdmin;