import { useEffect, useMemo, useState } from "react";

import {
    FaBoxes,
    FaBoxOpen,
    FaExclamationTriangle,
    FaTimesCircle,
    FaSearch,
    FaPlus,
    FaMinus,
    FaEdit,
    FaSave
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Inventory.css";

function Inventory() {

    /* ==========================================
                    STATES
    ========================================== */

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("All");

    const [editingId, setEditingId] = useState(null);

    const [stockValue, setStockValue] = useState("");

    /* ==========================================
                    LOAD DATA
    ========================================== */

    useEffect(() => {

        loadInventory();

    }, []);

    const loadInventory = async () => {

        try {

            const [

                productRes,

                categoryRes,

                brandRes

            ] = await Promise.all([

                api.get("/products"),

                api.get("/categories"),

                api.get("/brands")

            ]);

            setProducts(productRes.data);

            setCategories(categoryRes.data);

            setBrands(brandRes.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                    HELPERS
    ========================================== */

    const getCategoryName = (id) => {

        const category = categories.find(

            item => Number(item.id) === Number(id)

        );

        return category ? category.name : "Unknown";

    };

    const getBrandName = (id) => {

        const brand = brands.find(

            item => Number(item.id) === Number(id)

        );

        return brand ? brand.name : "Unknown";

    };

    const getStockStatus = (stock) => {

        if (stock <= 0) return "Out of Stock";

        if (stock <= 10) return "Low Stock";

        return "In Stock";

    };

    const getStatusClass = (stock) => {

        if (stock <= 0) return "out-stock";

        if (stock <= 10) return "low-stock";

        return "in-stock";

    };

    /* ==========================================
                SEARCH + FILTER
    ========================================== */

    const filteredProducts = useMemo(() => {

        return products.filter(product => {

            const matchesSearch =

                product.name

                    .toLowerCase()

                    .includes(search.toLowerCase());

            const status = getStockStatus(product.stock);

            const matchesFilter =

                filter === "All"

                ||

                status === filter;

            return matchesSearch && matchesFilter;

        });

    }, [

        products,

        search,

        filter

    ]);

    /* ==========================================
                    STATISTICS
    ========================================== */

    const totalProducts = products.length;

    const inStockProducts = products.filter(

        product => product.stock > 10

    ).length;

    const lowStockProducts = products.filter(

        product =>

            product.stock > 0 &&

            product.stock <= 10

    ).length;

    const outOfStockProducts = products.filter(

        product =>

            product.stock <= 0

    ).length;

    /* ==========================================
                    EDIT STOCK
    ========================================== */

    const startEditing = (product) => {

        setEditingId(product.id);

        setStockValue(product.stock);

    };

    const cancelEditing = () => {

        setEditingId(null);

        setStockValue("");

    };
        /* ==========================================
                UPDATE STOCK
    ========================================== */

    const saveStock = async (id) => {

        try {

            await api.patch(

                `/products/${id}`,

                {

                    stock: Number(stockValue)

                }

            );

            setEditingId(null);

            setStockValue("");

            loadInventory();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                QUICK STOCK UPDATE
    ========================================== */

    const increaseStock = async (product) => {

        try {

            await api.patch(

                `/products/${product.id}`,

                {

                    stock: product.stock + 1

                }

            );

            loadInventory();

        }

        catch (error) {

            console.log(error);

        }

    };

    const decreaseStock = async (product) => {

        if (product.stock <= 0) return;

        try {

            await api.patch(

                `/products/${product.id}`,

                {

                    stock: product.stock - 1

                }

            );

            loadInventory();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                LOADING
    ========================================== */

    if (loading) {

        return (

            <div className="admin-loading">

                Loading Inventory...

            </div>

        );

    }

    /* ==========================================
                PAGE START
    ========================================== */

    return (

            <AdminLayout>

                <div className="inventory-page">

                    <div className="inventory-header">

                        <div>

                            <h1>

                                Inventory Management

                            </h1>

                            <p>

                                Monitor and manage product stock.

                            </p>

                        </div>

                    </div>

                    {/* ==========================================
                            STATISTICS
                    ========================================== */}

                    <div className="inventory-stats">

                        <div className="stat-card">

                            <FaBoxes />

                            <div>

                                <h2>{totalProducts}</h2>

                                <p>Total Products</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaBoxOpen />

                            <div>

                                <h2>{inStockProducts}</h2>

                                <p>In Stock</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaExclamationTriangle />

                            <div>

                                <h2>{lowStockProducts}</h2>

                                <p>Low Stock</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaTimesCircle />

                            <div>

                                <h2>{outOfStockProducts}</h2>

                                <p>Out of Stock</p>

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                            TOOLBAR
                    ========================================== */}

                    <div className="inventory-toolbar">

                        <div className="inventory-search">

                            <FaSearch />

                            <input

                                type="text"

                                placeholder="Search Product..."

                                value={search}

                                onChange={(e) =>

                                    setSearch(e.target.value)

                                }

                            />

                        </div>

                        <select

                            value={filter}

                            onChange={(e) =>

                                setFilter(e.target.value)

                            }

                        >

                            <option value="All">

                                All Products

                            </option>

                            <option value="In Stock">

                                In Stock

                            </option>

                            <option value="Low Stock">

                                Low Stock

                            </option>

                            <option value="Out of Stock">

                                Out of Stock

                            </option>

                        </select>

                    </div>

                    {/* ==========================================
                            INVENTORY TABLE
                    ========================================== */}

                    <div className="inventory-table">

                        <table>

                            <thead>

                                <tr>

                                    <th>Image</th>

                                    <th>Product</th>

                                    <th>Category</th>

                                    <th>Brand</th>

                                    <th>Price</th>

                                    <th>Stock</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredProducts.map(product => (

                                        <tr key={product.id}>

                                            <td>

                                                <img

                                                    src={product.images?.[0]}

                                                    alt={product.name}

                                                    className="inventory-image"

                                                />

                                            </td>

                                            <td>

                                                {product.name}

                                            </td>

                                            <td>

                                                {

                                                    getCategoryName(

                                                        product.categoryId

                                                    )

                                                }

                                            </td>

                                            <td>

                                                {

                                                    getBrandName(

                                                        product.brandId

                                                    )

                                                }

                                            </td>

                                            <td>

                                                ₹{product.discountPrice}

                                            </td>
                                                                                        <td>

                                                {

                                                    editingId === product.id ?

                                                    (

                                                        <input

                                                            type="number"

                                                            min="0"

                                                            className="stock-input"

                                                            value={stockValue}

                                                            onChange={(e)=>

                                                                setStockValue(

                                                                    e.target.value

                                                                )

                                                            }

                                                        />

                                                    )

                                                    :

                                                    (

                                                        <strong>

                                                            {product.stock}

                                                        </strong>

                                                    )

                                                }

                                            </td>

                                            <td>

                                                <span

                                                    className={`stock-badge ${

                                                        getStatusClass(

                                                            product.stock

                                                        )

                                                    }`}

                                                >

                                                    {

                                                        getStockStatus(

                                                            product.stock

                                                        )

                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <div className="inventory-actions">

                                                    {

                                                        editingId === product.id ?

                                                        (

                                                            <>

                                                                <button

                                                                    className="save-btn"

                                                                    onClick={()=>

                                                                        saveStock(

                                                                            product.id

                                                                        )

                                                                    }

                                                                >

                                                                    <FaSave />

                                                                </button>

                                                                <button

                                                                    className="cancel-btn"

                                                                    onClick={

                                                                        cancelEditing

                                                                    }

                                                                >

                                                                    ✕

                                                                </button>

                                                            </>

                                                        )

                                                        :

                                                        (

                                                            <>

                                                                <button

                                                                    className="edit-btn"

                                                                    onClick={()=>

                                                                        startEditing(

                                                                            product

                                                                        )

                                                                    }

                                                                >

                                                                    <FaEdit />

                                                                </button>

                                                                <button

                                                                    className="plus-btn"

                                                                    onClick={()=>

                                                                        increaseStock(

                                                                            product

                                                                        )

                                                                    }

                                                                >

                                                                    <FaPlus />

                                                                </button>

                                                                <button

                                                                    className="minus-btn"

                                                                    onClick={()=>

                                                                        decreaseStock(

                                                                            product

                                                                        )

                                                                    }

                                                                >

                                                                    <FaMinus />

                                                                </button>

                                                            </>

                                                        )

                                                    }

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                </div>
                
        </AdminLayout>
    );

}

export default Inventory;