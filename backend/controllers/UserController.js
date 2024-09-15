const User = require('../models/User');
const slugify = require('slugify');

// Image handling
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create user with image upload
exports.create = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload to Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);  // Add uploaded image URL to array
        fs.unlinkSync(file.path);  // Remove local file after uploading
      }
    }

    const newUser = new User({
      name,
      email,
      address,
      image: imageUrls,  // Save the image URL in the database
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
try {
    const users = await User.find({});
    
    res.status(200).json({
    message: "Users fetched successfully",
    users,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

exports.getUserBySlug = async (req, res) => {
try {
    const userSlug = req.params.slug;

    const user = await User.findOne({ slug: userSlug });

    if (!user) {
    return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
    message: "User fetched successfully",
    user,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, email, address, existingImages } = req.body; // Accept existing image data
  const newSlug = slugify(name, { lower: true });

  try {
    // Find the user to update
    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle image updates
    let updatedImageUrls = existingImages || user.image;  // Preserve existing images if provided

    if (req.files && req.files.length > 0) {
      // Upload new images if any are provided
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(result.secure_url);
        fs.unlinkSync(file.path);  // Remove the file after uploading to Cloudinary
      }
      updatedImageUrls = [...updatedImageUrls, ...uploadedImages]; // Append new images
    }

    // Update user fields and images
    user.name = name;
    user.email = email;
    user.address = address;
    user.image = updatedImageUrls;
    user.slug = newSlug;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
    const { slug } = req.params;
    
    try {
      const user = await User.findOneAndDelete({ slug }).exec();
  
      if (!user) {
        return res.status(400).json({ error: 'Delete error: user not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  