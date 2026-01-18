const { getProducts } = require('../productController');
const Product = require('../../models/Product');
const NodeCache = require('node-cache');

// Mock dependencies
jest.mock('../../models/Product');
jest.mock('node-cache');

describe('Product Controller - getProducts', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: { pageNumber: 1 },
            user: { role: 'superAdmin' },
            originalUrl: '/api/products' // Needed for cache key
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        // Reset mocks
        jest.clearAllMocks();
        // Mock cache.get to return null (cache miss)
        NodeCache.prototype.get = jest.fn().mockReturnValue(null);
        NodeCache.prototype.set = jest.fn();
    });

    it('should fetch all products for SuperAdmin', async () => {
        // Mock Product.find & countDocuments
        Product.countDocuments.mockResolvedValue(10);
        Product.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue([{ name: 'Product 1' }, { name: 'Product 2' }]),
        });

        await getProducts(req, res);

        expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({})); // No extra filters
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            products: expect.any(Array),
            page: 1,
            pages: 1
        }));
    });

    it('should filter products for Retailer', async () => {
        req.query.param = 'admin';
        req.user.role = 'admin'; // Retailer role
        req.user._id = 'retailerId';

        Product.countDocuments.mockResolvedValue(5);
        Product.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue([{ name: 'My Product' }]),
        });

        await getProducts(req, res);

        // Verify that query included user: retailerId
        expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({ user: 'retailerId' }));
    });
});
