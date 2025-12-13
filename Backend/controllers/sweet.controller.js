import { Sweet } from "../models/sweet.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    const image = req.file;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const cloudResponse = await uploadMedia(image.path);
    const photoUrl = cloudResponse.secure_url;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      sweetImage: photoUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Sweet added successfully.",
      sweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add sweet",
    });
  }
};

export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      sweets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sweets",
    });
  }
};

export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);

    return res.status(200).json({
      success: true,
      sweets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to search sweets",
    });
  }
};

export const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    const { name, category, price, quantity, description } = req.body;
    const image = req.file;

    // extract public id of the old image from the url is it exists;
    if (sweet.sweetImage) {
      const publicId = sweet.sweetImage.split("/").pop().split(".")[0]; // extract public id
      deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    const cloudResponse = await uploadMedia(image.path);
    const photoUrl = cloudResponse.secure_url;

    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;
    if (description) sweet.description = description;
    if (image) sweet.sweetImage = photoUrl;

    await sweet.save();

    return res.status(200).json({
      success: true,
      message: "Sweet updated successfully.",
      sweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sweet",
    });
  }
};

export const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    if (sweet.sweetImage) {
      const publicId = sweet.sweetImage.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId); // delete old image
    }

    await sweet.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Sweet deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete sweet",
    });
  }
};

export const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!sweet) {
      return res.status(400).json({
        success: false,
        message: "Sweet is out of stock",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sweet purchased successfully.",
      sweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to purchase sweet",
    });
  }
};

export const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required.",
      });
    }

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { $inc: { quantity } },
      { new: true }
    );

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sweet restocked successfully.",
      sweet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to restock sweet",
    });
  }
};

