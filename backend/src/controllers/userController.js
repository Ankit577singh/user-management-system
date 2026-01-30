const User = require("../models/user");
const { Parser } = require("json2csv");

//  Add User
exports.createUser = async (req, res) => {
  try {

    const userData = {
      ...req.body,
      profile: req.file ? (req.file.secure_url || req.file.path) : ""
    };

    console.log("FILE:", req.file);
    console.log("USER DATA:", userData);

    const user = await User.create(userData);
    res.status(201).json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//  Get Users with Pagination
exports.getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// getSingleUser
exports.getSingleUser = async (req, res) => {
  try {
   
    const key = req.params.key;
    const users = await User.findById(req.params.id);

    res.json({
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {

    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.profile = req.file.secure_url || req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


//  Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  try {
    const key = req.params.key;
    const users = await User.find({
      $or: [
        { firstName: { $regex: key, $options: "i" } },
        { lastName: { $regex: key, $options: "i" } }
     ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

//  Export CSV
exports.exportCSV = async (req, res) => {
  try {
    const users = await User.find();
    const parser = new Parser();
    const csv = parser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "CSV export failed" });
  }
};
