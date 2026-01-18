const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            // Inventory Integrity Check
            for (const item of orderItems) {
                const product = await Product.findById(item.product || item._id);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.name}`);
                }
                if (product.countInStock < item.qty) {
                    res.status(400);
                    throw new Error(`Product ${product.name} is out of stock`);
                }
            }

            const order = new Order({
                orderItems: orderItems.map((x) => ({
                    ...x,
                    product: x.product || x._id, // Use product if already mapped, else use _id
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Automated Inventory Management: Decrement countInStock
            for (const item of createdOrder.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.countInStock = Math.max(0, product.countInStock - item.qty);
                    await product.save();
                }
            }

            // Send Confirmation Email
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: 'Order Confirmation - Swift Basket',
                    message: `Thank you for your order, ${req.user.name}! \n\nYour Order ID is ${createdOrder._id}.\nTotal Amount: Rs. ${createdOrder.totalPrice}\n\nWe will notify you when your items are shipped.\n\nHappy Shopping,\nSwift Basket Team`,
                });
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error(error);
        const status = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(status).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    let query = {};

    if (req.user.role === 'admin') { // Retailer
        // Find products belonging to this retailer
        const myProducts = await Product.find({ user: req.user._id }).select('_id');
        // Find orders that contain at least one of these products
        query = { 'orderItems.product': { $in: myProducts } };
    }
    // SuperAdmin (role === 'superAdmin' or isAdmin) sees all (query stays {})

    const orders = await Order.find(query).populate('user', 'id name');
    res.json(orders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
};
