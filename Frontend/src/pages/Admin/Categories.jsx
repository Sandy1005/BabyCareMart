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

import "../../styles/Admin/Categories.css";

function Categories() {

    /* ==========================================
                INITIAL CATEGORY
    ========================================== */

    const initialCategory = {

        name: "",

        image: "",

        description: ""

    };

    /* ==========================================
                    STATES
    ========================================== */

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState(initialCategory);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==========================================
                LOAD CATEGORIES
    ========================================== */

    useEffect(() => {

        fetchCategories();

    }, []);

    const fetchCategories = async () => {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);

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

    const filteredCategories = categories.filter(

        (category) =>

            category.name

                ?.toLowerCase()

                .includes(search.toLowerCase())

    );

    /* ==========================================
                HANDLE INPUT
    ========================================== */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    /* ==========================================
                ADD CATEGORY
    ========================================== */

    const openAddModal = () => {

        setFormData(initialCategory);

        setShowAddModal(true);

    };

    const closeAddModal = () => {

        setShowAddModal(false);

        setFormData(initialCategory);

    };

    const addCategory = async () => {

        if (

            !formData.name ||

            !formData.image

        ) {

            alert("Please fill all required fields.");

            return;

        }

        try {

            await api.post(

                "/categories",

                formData

            );

            closeAddModal();

            fetchCategories();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                EDIT CATEGORY
    ========================================== */

    const openEditModal = (category) => {

        setSelectedCategory(category);

        setFormData({

            name: category.name,

            image: category.image,

            description: category.description || ""

        });

        setShowEditModal(true);

    };

    const closeEditModal = () => {

        setSelectedCategory(null);

        setShowEditModal(false);

    };

    const updateCategory = async () => {

        if (!selectedCategory) return;

        try {

            await api.put(

                `/categories/${selectedCategory.id}`,

                formData

            );

            closeEditModal();

            fetchCategories();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                DELETE CATEGORY
    ========================================== */

    const openDeleteModal = (category) => {

        setSelectedCategory(category);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedCategory(null);

        setShowDeleteModal(false);

    };

    const deleteCategory = async () => {

        if (!selectedCategory) return;

        try {

            await api.delete(

                `/categories/${selectedCategory.id}`

            );

            closeDeleteModal();

            fetchCategories();

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

                Loading Categories...

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

                        Category Management

                    </h1>

                    <p>

                        Manage all BabyCareMart categories.

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={openAddModal}

                >

                    <FaPlus />

                    Add Category

                </button>

            </div>

            {/* ==========================================
                        SEARCH BAR
            ========================================== */}

            <div className="search-box">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search categories..."

                    value={search}

                    onChange={(e)=>

                        setSearch(e.target.value)

                    }

                />

            </div>

            {/* ==========================================
                        CATEGORY TABLE
            ========================================== */}

            <div className="table-container">

                <table className="category-table">

                    <thead>

                        <tr>

                            <th>

                                Image

                            </th>

                            <th>

                                Category Name

                            </th>

                            <th>

                                Description

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredCategories.length===0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan="4"

                                        className="no-data"

                                    >

                                        No Categories Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredCategories.map((category)=>(

                                    <tr

                                        key={category.id}

                                    >

                                        <td>

                                            <img

                                                src={

                                                    category.image ||

                                                    "/images/no-image.png"

                                                }

                                                alt={category.name}

                                                className="category-image"

                                            />

                                        </td>

                                        <td>

                                            {category.name}

                                        </td>

                                        <td>

                                            {

                                                category.description ||

                                                "-"

                                            }

                                        </td>

                                        <td>

                                            <div

                                                className="action-buttons"

                                            >

                                                <button

                                                    className="edit-btn"

                                                    onClick={()=>

                                                        openEditModal(category)

                                                    }

                                                >

                                                    <FaEdit />

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={()=>

                                                        openDeleteModal(category)

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
                        ADD CATEGORY MODAL
            ========================================== */}

            {

                showAddModal && (

                    <div className="modal-overlay">

                        <div className="category-modal">

                            <div className="modal-header">

                                <h2>

                                    Add Category

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

                                    placeholder="Category Name"

                                    value={formData.name}

                                    onChange={handleChange}

                                />

                                <input

                                    type="text"

                                    name="image"

                                    placeholder="Category Image URL"

                                    value={formData.image}

                                    onChange={handleChange}

                                />

                                <textarea

                                    rows="4"

                                    name="description"

                                    placeholder="Category Description"

                                    value={formData.description}

                                    onChange={handleChange}

                                />

                                {

                                    formData.image && (

                                        <img

                                            src={formData.image}

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

                                        onClick={addCategory}

                                    >

                                        Save Category

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        EDIT CATEGORY MODAL
            ========================================== */}

            {

                showEditModal && (

                    <div className="modal-overlay">

                        <div className="category-modal">

                            <div className="modal-header">

                                <h2>

                                    Edit Category

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

                                    name="image"

                                    value={formData.image}

                                    onChange={handleChange}

                                />

                                <textarea

                                    rows="4"

                                    name="description"

                                    value={formData.description}

                                    onChange={handleChange}

                                />

                                {

                                    formData.image && (

                                        <img

                                            src={formData.image}

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

                                        onClick={updateCategory}

                                    >

                                        Update Category

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        DELETE CATEGORY MODAL
            ========================================== */}

            {

                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <h2>

                                Delete Category

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}

                                    {selectedCategory?.name}

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

                                    onClick={deleteCategory}

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

export default Categories;