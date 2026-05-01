import * as productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    let {
      category,
      brand,
      rating,
      maxPrice,
      searchValue,
      sortBy,
      order
    } = req.query;

    // ✅ FIX: convert comma-separated string → array
    category = category ? category.split(",") : [];
    brand = brand ? brand.split(",") : [];

    const filter = {};

    // ✅ Category filter
    if (category.length > 0) {
      filter.category = { $in: category };
    }

    // ✅ Brand filter
    if (brand.length > 0) {
      filter.brand = { $in: brand };
    }

    // ✅ Rating filter ("4 stars & up" → 4)
    if (rating) {
      const ratingValue = parseInt(rating);
      if (!isNaN(ratingValue)) {
        filter.rating = { $gte: ratingValue };
      }
    }

    // ✅ Price filter
    if (maxPrice) {
      filter.price = {
        $gte: 25,
        $lte: Number(maxPrice),
      };
    }

    // ✅ Search (optional)
    if (searchValue) {
      filter.title = { $regex: searchValue, $options: "i" };
    }

    // ✅ Sorting
    let sort = {};

    if (sortBy === "Popularity") {
      sort.rating = -1;
    } else if (sortBy === "Date") {
      sort.createdAt = -1;
    } else {
      sort.createdAt = -1; // default
    }

    console.log("FILTER:", filter);
    console.log("SORT:", sort);

    const products = await productService.getProducts(filter, { sort });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ CREATE PRODUCT

export const createProducts = async (req, res) => {
  try {
    let {
      image,
      alt,
      category,
      title,
      price,
      subtitle,
      stockText,
      rating,
      brand
    } = req.body;

    // ✅ Basic validation
    if (!title || !price || !category || !brand) {
      return res.status(400).json({
        message: "Title, price, category and brand are required",
      });
    }

    // ✅ Convert price to number (handles "$129.99" or "129.99")
    const numericPrice = Number(
      typeof price === "string" ? price.replace("$", "") : price
    );

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        message: "Invalid price format",
      });
    }

    // ✅ Normalize rating (optional safety)
    const numericRating = rating ? Number(rating) : 0;

    const product = await productService.createProducts({
      image,
      alt,
      category,
      title: title.trim(),
      price: numericPrice, // 🔥 fixed
      subtitle,
      stockText,
      rating: numericRating,
      brand,
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};