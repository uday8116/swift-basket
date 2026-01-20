const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all home content (brands and categories)
// @route   GET /api/home-content
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type, isActive: true } : { isActive: true };

        const content = await HomeContent.find(filter).sort({ order: 1, createdAt: -1 });

        // Group by type for convenience
        const brands = content.filter(item => item.type === 'brand');
        const categories = content.filter(item => item.type === 'category');

        res.json({ brands, categories, all: content });
    } catch (error) {
        console.error('Error fetching home content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get single home content item
// @route   GET /api/home-content/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const content = await HomeContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create home content item
// @route   POST /api/home-content
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { type, name, image, discount, order, isActive } = req.body;

        // Validate type
        if (!type || !['brand', 'category'].includes(type)) {
            return res.status(400).json({ message: 'Type must be brand or category' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Get the next order number if not provided
        let orderNum = order;
        if (orderNum === undefined) {
            const lastItem = await HomeContent.findOne({ type }).sort({ order: -1 });
            orderNum = lastItem ? lastItem.order + 1 : 0;
        }

        const content = new HomeContent({
            type,
            name,
            image: image || '',
            discount: discount || 'UP TO 60% OFF',
            order: orderNum,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedContent = await content.save();
        res.status(201).json(savedContent);
    } catch (error) {
        console.error('Error creating home content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update home content item
// @route   PUT /api/home-content/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { type, name, image, discount, order, isActive } = req.body;

        const content = await HomeContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Update fields
        if (type) content.type = type;
        if (name) content.name = name;
        if (image !== undefined) content.image = image;
        if (discount !== undefined) content.discount = discount;
        if (order !== undefined) content.order = order;
        if (isActive !== undefined) content.isActive = isActive;

        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (error) {
        console.error('Error updating home content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete home content item
// @route   DELETE /api/home-content/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const content = await HomeContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        await HomeContent.deleteOne({ _id: req.params.id });
        res.json({ message: 'Content removed' });
    } catch (error) {
        console.error('Error deleting home content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Reorder home content items
// @route   PUT /api/home-content/reorder
// @access  Private/Admin
router.put('/reorder/batch', protect, admin, async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Items array is required' });
        }

        const updatePromises = items.map(item =>
            HomeContent.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updatePromises);
        res.json({ message: 'Reorder successful' });
    } catch (error) {
        console.error('Error reordering content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
