import { useEffect, useState } from "react";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTimes
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Products.css";   

function Products() {

    /* ==========================================
                INITIAL PRODUCT
    ========================================== */

    const initialProduct = {

        name: "",

        brand: "",

        category: "",

        price: "",

        stock: "",

        description: "",

        images: [""]

    };

    /* ==========================================
                    STATES
    ========================================== */

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState(initialProduct);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==========================================
                LOAD PRODUCTS
    ========================================== */

    useEffect(() => {

        fetchProducts();

    }, []);

    const fetchProducts = async () => {

        try {

            const response = await api.get("/products");

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                    SEARCH
    ========================================== */

    const filteredProducts = products.filter(

        (product) =>

            product.name

                ?.toLowerCase()

                .includes(search.toLowerCase())

    );

    /* ==========================================
                HANDLE INPUT
    ========================================== */

    const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        if (name === "image") {

            setFormData({

                ...formData,

                images: [value]

            });

        }

        else {

            setFormData({

                ...formData,

                [name]: value

            });

        }

    };

    /* ==========================================
                ADD PRODUCT
    ========================================== */

    const openAddModal = () => {

        setFormData(initialProduct);

        setShowAddModal(true);

    };

    const closeAddModal = () => {

        setShowAddModal(false);

        setFormData(initialProduct);

    };

    const addProduct = async () => {

        if (

            !formData.name ||

            !formData.brand ||

            !formData.category ||

            !formData.price ||

            !formData.stock ||

            !formData.images[0]

        ) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await api.post(

                "/products",

                formData

            );

            closeAddModal();

            fetchProducts();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                EDIT PRODUCT
    ========================================== */

    const openEditModal = (product) => {

        setSelectedProduct(product);

        setFormData({

            name: product.name,

            brand: product.brand,

            category: product.category,

            price: product.price,

            stock: product.stock,

            description: product.description || "",

            images: product.images || [""]

        });

        setShowEditModal(true);

    };

    const closeEditModal = () => {

        setSelectedProduct(null);

        setShowEditModal(false);

    };

    const updateProduct = async () => {

        if (!selectedProduct) return;

        try {

            await api.put(

                `/products/${selectedProduct.id}`,

                formData

            );

            closeEditModal();

            fetchProducts();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                DELETE PRODUCT
    ========================================== */

    const openDeleteModal = (product) => {

        setSelectedProduct(product);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedProduct(null);

        setShowDeleteModal(false);

    };

    const deleteProduct = async () => {

        if (!selectedProduct) return;

        try {

            await api.delete(

                `/products/${selectedProduct.id}`

            );

            closeDeleteModal();

            fetchProducts();

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

            <h2 className="loading-text">

                Loading Products...

            </h2>

        );

    }
        /* ==========================================
                    RETURN UI
    ========================================== */

    return (

        <AdminLayout>

            {/* ==========================================
                        PAGE HEADER
            ========================================== */}

            <div className="page-header">

                <div>

                    <h1>

                        Product Management

                    </h1>

                    <p>

                        Manage all BabyCareMart products.

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={openAddModal}

                >

                    <FaPlus />

                    Add Product

                </button>

            </div>

            {/* ==========================================
                        SEARCH BAR
            ========================================== */}

            <div className="search-box">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search products..."

                    value={search}

                    onChange={(e) =>

                        setSearch(e.target.value)

                    }

                />

            </div>

            {/* ==========================================
                        PRODUCT TABLE
            ========================================== */}

            <div className="table-container">

                <table className="product-table">

                    <thead>

                        <tr>

                            <th>Image</th>

                            <th>Name</th>

                            <th>Brand</th>

                            <th>Category</th>

                            <th>Price</th>

                            <th>Stock</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredProducts.length === 0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan="7"

                                        className="no-data"

                                    >

                                        No Products Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredProducts.map((product) => (

                                    <tr key={product.id}>

                                        <td>

                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    "/images/no-image.png"
                                                }
                                                alt={product.name}
                                                className="admin-product-image"
                                            />

                                        </td>

                                        <td>

                                            {product.name}

                                        </td>

                                        <td>

                                            {product.brand}

                                        </td>

                                        <td>

                                            {product.category}

                                        </td>

                                        <td>

                                            ₹{product.price}

                                        </td>

                                        <td>

                                            {product.stock}

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button

                                                    className="edit-btn"

                                                    onClick={() =>

                                                        openEditModal(product)

                                                    }

                                                >

                                                    <FaEdit />

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={() =>

                                                        openDeleteModal(product)

                                                    }

                                                >

                                                    <FaTrash />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </table>

            </div>
                        {/* ==========================================
                        ADD PRODUCT MODAL
            ========================================== */}

            {

                showAddModal && (

                    <div className="modal-overlay">

                        <div className="product-modal">

                            <div className="modal-header">

                                <h2>

                                    Add Product

                                </h2>

                                <button

                                    className="close-btn"

                                    onClick={closeAddModal}

                                >

                                    <FaTimes />

                                </button>

                            </div>

                            <div className="modal-body">

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="brand"
                                    placeholder="Brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />

                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />

                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="image"
                                    placeholder="Image URL"
                                    value={formData.images[0]}
                                    onChange={handleChange}
                                />

                                <textarea
                                    rows="4"
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                {

                                    formData.images[0] && (

                                        <img

                                            src={formData.images[0]}

                                            alt="Preview"

                                            className="preview-image"

                                        />

                                    )

                                }

                                <div className="modal-actions">

                                    <button

                                        className="cancel-btn"

                                        onClick={closeAddModal}

                                    >

                                        Cancel

                                    </button>

                                    <button

                                        className="save-btn"

                                        onClick={addProduct}

                                    >

                                        Save Product

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        EDIT PRODUCT MODAL
            ========================================== */}

            {

                showEditModal && (

                    <div className="modal-overlay">

                        <div className="product-modal">

                            <div className="modal-header">

                                <h2>

                                    Edit Product

                                </h2>

                                <button

                                    className="close-btn"

                                    onClick={closeEditModal}

                                >

                                    <FaTimes />

                                </button>

                            </div>

                            <div className="modal-body">

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />

                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="image"
                                    value={formData.images[0]}
                                    onChange={handleChange}
                                />

                                <textarea
                                    rows="4"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                {

                                    formData.images[0] && (

                                        <img

                                            src={formData.images[0]}

                                            alt="Preview"

                                            className="preview-image"

                                        />

                                    )

                                }

                                <div className="modal-actions">

                                    <button

                                        className="cancel-btn"

                                        onClick={closeEditModal}

                                    >

                                        Cancel

                                    </button>

                                    <button

                                        className="save-btn"

                                        onClick={updateProduct}

                                    >

                                        Update Product

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        DELETE MODAL
            ========================================== */}

            {

                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <h2>

                                Delete Product

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}

                                    {selectedProduct?.name}

                                </strong>

                                ?

                            </p>

                            <div className="modal-actions">

                                <button

                                    className="cancel-btn"

                                    onClick={closeDeleteModal}

                                >

                                    Cancel

                                </button>

                                <button

                                    className="delete-btn"

                                    onClick={deleteProduct}

                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </AdminLayout>

    );

}

export default Products;