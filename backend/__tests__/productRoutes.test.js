const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Mock Mongoose connect to prevent real DB connection during these tests
// valid integration tests usually hit a real DB, but we want to avoid side effects here
jest.mock('mongoose', () => {
    const actual = jest.requireActual('mongoose');
    return {
        ...actual,
        connect: jest.fn().mockResolvedValue(true),
    };
});

// Mock models to control data returned
jest.mock('../models/Product', () => ({
    countDocuments: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn(),
}));

const Product = require('../models/Product');

describe('GET /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of products', async () => {
        const mockProducts = [{ name: 'Test Product', price: 100 }];
        Product.countDocuments.mockResolvedValue(1);
        Product.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue(mockProducts),
        });

        const res = await request(app).get('/api/products');

        expect(res.statusCode).toEqual(200);
        expect(res.body.products).toHaveLength(1);
        expect(res.body.products[0].name).toBe('Test Product');
    });
});
