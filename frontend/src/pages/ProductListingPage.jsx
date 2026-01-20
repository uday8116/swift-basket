import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import PageTransition from '../components/PageTransition';
import './ProductListingPage.css';

const ProductListingPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [count, setCount] = useState(0);

    // Filters State - Initialize from URL if present
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [brand, setBrand] = useState(searchParams.get('brand') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    const [availableFilters, setAvailableFilters] = useState({ categories: [], brands: [] });

    // Fetch available filters - brands and categories from home-content (admin-managed)
    // Default categories to show if none are configured
    const defaultCategories = ['Men', 'Women', 'Kids', 'Accessories'];

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // Fetch admin-created brands and categories from home-content
                const homeContentResponse = await fetch('http://localhost:5001/api/home-content');
                const homeContentData = await homeContentResponse.json();
                const adminBrands = (homeContentData.brands || []).map(b => b.name);
                const adminCategories = (homeContentData.categories || []).map(c => c.name);

                // Use admin content if available, otherwise fall back to defaults
                setAvailableFilters({
                    categories: adminCategories.length > 0 ? adminCategories : defaultCategories,
                    brands: adminBrands
                });
            } catch (error) {
                console.error("Error fetching filters:", error);
                // Set defaults on error
                setAvailableFilters({
                    categories: defaultCategories,
                    brands: []
                });
            }
        };
        fetchFilters();
    }, []);

    // Sync state when URL changes (e.g. clicking Navbar links or HomePage cards)
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat !== null) setCategory(cat);

        const kw = searchParams.get('keyword');
        if (kw !== null) setKeyword(kw);

        const br = searchParams.get('brand');
        if (br !== null) setBrand(br);

        // Reset page when filters change to avoid empty pages
        setPage(1);

    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Build query string
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (page > 1) params.append('pageNumber', page);
                if (category) params.append('category', category);
                if (brand) params.append('brand', brand);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (sort) params.append('sort', sort);

                const response = await fetch(`http://localhost:5001/api/products?${params.toString()}`);
                const data = await response.json();

                // Backend now returns { products, page, pages, count }
                setProducts(data.products || []);
                setPage(data.page || 1);
                setPages(data.pages || 1);
                setCount(data.count || 0);

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                // Simulate a slight delay for smoother transition if network is too fast
                setTimeout(() => setLoading(false), 300);
            }
        };
        fetchProducts();
    }, [keyword, page, category, brand, minPrice, maxPrice, sort]);

    // Handlers
    const handleSortChange = (e) => setSort(e.target.value);
    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        // Simple logic: if checked, set brand, if unchecked clear it (can be improved to array)
        if (checked) setBrand(value);
        else setBrand('');
    };
    const handlePriceChange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    return (
        <PageTransition>
            <div className="product-listing-page container">
                <div className="breadcrumbs">
                    <span>Home</span> / <span>Products</span>
                </div>

                <div className="listing-layout">
                    <aside className="filters-sidebar">
                        <div className="filter-group">
                            <h4>SEARCH</h4>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-group">
                            <h4>CATEGORIES</h4>
                            <label className="radio-label">
                                <input type="radio" name="category" value="" onChange={(e) => setCategory('')} checked={category === ''} />
                                <span className="custom-radio"></span>
                                All
                            </label>
                            {availableFilters.categories.map((cat) => (
                                <label key={cat} className="radio-label">
                                    <input type="radio" name="category" value={cat} onChange={(e) => setCategory(e.target.value)} checked={category === cat} />
                                    <span className="custom-radio"></span>
                                    {cat}
                                </label>
                            ))}
                        </div>

                        <div className="filter-group">
                            <h4>BRAND</h4>
                            {availableFilters.brands.map((b) => (
                                <label key={b} className="checkbox-label">
                                    <input type="checkbox" value={b} onChange={handleBrandChange} checked={brand === b} />
                                    <span className="custom-checkbox"></span>
                                    {b}
                                </label>
                            ))}
                        </div>

                        <div className="filter-group">
                            <h4>PRICE</h4>
                            <label className="radio-label">
                                <input type="radio" name="price" onChange={() => handlePriceChange('', '')} defaultChecked />
                                <span className="custom-radio"></span>
                                All
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="price" onChange={() => handlePriceChange('0', '1000')} />
                                <span className="custom-radio"></span>
                                Under Rs. 1000
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="price" onChange={() => handlePriceChange('1000', '5000')} />
                                <span className="custom-radio"></span>
                                Rs. 1000 - 5000
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="price" onChange={() => handlePriceChange('5000', '')} />
                                <span className="custom-radio"></span>
                                Above Rs. 5000
                            </label>
                        </div>
                    </aside>

                    <main className="product-grid-container">
                        <div className="sort-bar">
                            <span className="bold">Showing {count} Products </span>
                            <div className='flex gap-2 items-center'>
                                <span className="bold">Sort by: </span>
                                <select value={sort} onChange={handleSortChange}>
                                    <option value="newest">Newest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="products-grid grid grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-4 text-center">No products found.</div>
                        ) : (
                            <div className="products-grid grid grid-cols-4 gap-4">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Simple Pagination */}
                        {!loading && pages > 1 && (
                            <div className="pagination mt-4 flex justify-center gap-2">
                                {[...Array(pages).keys()].map(x => (
                                    <button
                                        key={x + 1}
                                        onClick={() => setPage(x + 1)}
                                        className={`px-3 py-1 border ${page === x + 1 ? 'bg-black text-white' : 'bg-white'}`}
                                    >
                                        {x + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductListingPage;
