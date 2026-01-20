const Product = require('../models/Product');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// @desc    Fetch all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // Build query
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand
        ? { brand: { $regex: req.query.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
        : {};

    // Price Filter
    const priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
        priceFilter.price = {};
        if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    let query = { ...keyword, ...category, ...brand, ...priceFilter };

    // Multi-Vendor Logic: If accessing from Admin Dashboard
    if (req.query.param === 'admin' && req.user) {
        if (req.user.role === 'admin') {
            // content for Retailer: see only own products
            query.user = req.user._id;
        }
        // SuperAdmin sees all (no extra filter)
    }

    // Sort Logic
    let sort = {};
    if (req.query.sort) {
        switch (req.query.sort) {
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }
    } else {
        sort = { createdAt: -1 }; // Default to newest
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Enforce Ownership
        if (req.user.role !== 'superAdmin' && product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        cache.flushAll(); // Clear cache
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        images,
        brand,
        category,
        countInStock,
        originalPrice,
    } = req.body;

    const product = new Product({
        name: name || 'Sample name',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        images: images || [],
        brand: brand || 'Sample brand',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        numReviews: 0,
        description: description || 'Sample description',
        originalPrice: originalPrice || price || 0,
    });

    const createdProduct = await product.save();
    cache.flushAll(); // Clear cache
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        images,
        brand,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Enforce Ownership
        if (req.user.role !== 'superAdmin' && product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.images = images || []; // Save multiple images
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        cache.flushAll(); // Clear cache
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Get unique categories and brands for filters
// @route   GET /api/products/filters
// @access  Public
const getFilters = async (req, res) => {
    // Check cache first
    const cacheKey = 'product_filters';
    const cachedFilters = cache.get(cacheKey);
    if (cachedFilters) {
        return res.json(cachedFilters);
    }

    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');

    // Sort logically
    categories.sort();
    brands.sort();

    const filters = { categories, brands };
    cache.set(cacheKey, filters, 600); // Cache for 10 mins

    res.json(filters);
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getFilters,
};
