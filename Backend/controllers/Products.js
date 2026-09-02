const Product = require('../models/Product');
const { findOneAndDelete } = require('../models/User');

exports.getAllProducts = async (req, res) => {

    try {

        const products = await Product.find({});
        res.status(200).json(products);
    }

    catch (error){

        return res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
};

exports.getOneProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
        return res.status(404).json({ message:"Product not found in the database" })
        }

        return res.status(200).json(product);
    }

    catch (error){
        res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
  try {
    
    const { title, price, description, img, images, sizesStock, material, color, weight, fit } = req.body;

    const newProduct = new Product({
      title,
      price,
      description,
      img,
      images,
      sizesStock,
      material,
      color,
      weight,
      fit
    });

    await newProduct.save();
    return res.status(201).json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {

  try {

    const { id } = req.params
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({
      message: "Product not found in the database!"
      })
    }

      return res.status(200).json({
      message: "Product deleted from MongoDB Atlas!",
      product: deleteProduct
      })
  }

  catch (error) {

    console.log(error.message)
    return res.status(500).json({
    message: "Error deleting product", 
    error: error.message})
  }
}