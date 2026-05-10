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
      order,
      page,
      limit,
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
        $gte: 199,
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
      sort.rating = order === "asc" ? 1 : -1;
    } else if (sortBy === "Date") {
      sort.createdAt = order === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // default
    }

    console.log("FILTER:", filter);
    console.log("SORT:", sort);

    const {
      products,
      total,
      page: currentPage,
      limit: currentLimit,
    } = await productService.getProducts(filter, {
      sort,
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: currentPage,
      pages: Math.ceil(total / currentLimit),
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      brand,
    } = req.body;

    // ✅ Basic validation
    if (!title || !price || !category || !brand) {
      return res.status(400).json({
        message: "Title, price, category and brand are required",
      });
    }

    // ✅ Convert price to number (handles "$129.99" or "129.99")
    const numericPrice = Number(
      typeof price === "string" ? price.replace("₹", "") : price,
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

// ✅ BULK CREATE PRODUCTS
export const createBulkProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Send a non-empty array of products",
      });
    }

    // ✅ Normalize each product same way as createProducts
    const normalized = products.map((p) => {
      const numericPrice = Number(
        typeof p.price === "string" ? p.price.replace("₹", "") : p.price,
      );
      return {
        image: p.image,
        alt: p.alt,
        category: p.category,
        title: p.title?.trim(),
        price: isNaN(numericPrice) ? 0 : numericPrice,
        subtitle: p.subtitle,
        stockText: p.stockText,
        rating: p.rating ? Number(p.rating) : 0,
        brand: p.brand,
      };
    });

    const inserted = await productService.createBulkProducts(normalized);

    res.status(201).json({
      message: `${inserted.length} products inserted`,
      data: inserted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkUpdateProducts = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        message: "Send a non-empty array of updates",
      });
    }

    // normalize same way as createBulkProducts
    const normalized = updates.map(({ id, data }) => {
      const numericPrice = data.price
        ? Number(
            typeof data.price === "string"
              ? data.price.replace("₹", "")
              : data.price,
          )
        : undefined;

      return {
        id,
        data: {
          ...(data.image && { image: data.image }),
          ...(data.alt && { alt: data.alt }),
          ...(data.category && { category: data.category }),
          ...(data.title && { title: data.title.trim() }),
          ...(data.price && {
            price: isNaN(numericPrice) ? undefined : numericPrice,
          }),
          ...(data.subtitle && { subtitle: data.subtitle }),
          ...(data.stockText && { stockText: data.stockText }),
          ...(data.rating && { rating: Number(data.rating) }),
          ...(data.brand && { brand: data.brand }),
        },
      };
    });

    const results = await Promise.all(
      normalized.map(({ id, data }) =>
        productService.updateProductById(id, data),
      ),
    );

    res.status(200).json({
      message: `${results.length} products updated`,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
