import Product from "../models/Product.js";
import { products } from "../data/products.js"; // we’ll store your JSON here

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Seed products (replace existing)
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    res.json({ message: "Products seeded successfully" });
  } catch (error) {
    console.error("Error in seedProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
