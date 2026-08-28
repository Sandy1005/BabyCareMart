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

import "../../styles/Admin/Brands.css";

function Brands() {

    /* ==========================================
                INITIAL BRAND
    ========================================== */

    const initialBrand = {

        name: "",

        logo: ""

    };

    /* ==========================================
                    STATES
    ========================================== */

    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState(initialBrand);

    const [selectedBrand, setSelectedBrand] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==========================================
                LOAD BRANDS
    ========================================== */

    useEffect(() => {

        fetchBrands();

    }, []);

    const fetchBrands = async () => {

        try {

            const response = await api.get("/brands");

            setBrands(response.data);

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

    const filteredBrands = brands.filter(

        (brand) =>

            brand.name

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
                ADD BRAND
    ========================================== */

    const openAddModal = () => {

        setFormData(initialBrand);

        setShowAddModal(true);

    };

    const closeAddModal = () => {

        setFormData(initialBrand);

        setShowAddModal(false);

    };

    const addBrand = async () => {

        if (

            !formData.name ||

            !formData.logo

        ) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await api.post(

                "/brands",

                formData

            );

            closeAddModal();

            fetchBrands();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                EDIT BRAND
    ========================================== */

    const openEditModal = (brand) => {

        setSelectedBrand(brand);

        setFormData({

            name: brand.name,

            logo: brand.logo

        });

        setShowEditModal(true);

    };

    const closeEditModal = () => {

        setSelectedBrand(null);

        setShowEditModal(false);

    };

    const updateBrand = async () => {

        if (!selectedBrand) return;

        try {

            await api.put(

                `/brands/${selectedBrand.id}`,

                formData

            );

            closeEditModal();

            fetchBrands();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                DELETE BRAND
    ========================================== */

    const openDeleteModal = (brand) => {

        setSelectedBrand(brand);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedBrand(null);

        setShowDeleteModal(false);

    };

    const deleteBrand = async () => {

        if (!selectedBrand) return;

        try {

            await api.delete(

                `/brands/${selectedBrand.id}`

            );

            closeDeleteModal();

            fetchBrands();

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

                Loading Brands...

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

                        Brand Management

                    </h1>

                    <p>

                        Manage all BabyCareMart brands.

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={openAddModal}

                >

                    <FaPlus />

                    Add Brand

                </button>

            </div>

            {/* ==========================================
                        SEARCH BAR
            ========================================== */}

            <div className="search-box">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search brands..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />

            </div>

            {/* ==========================================
                        BRAND TABLE
            ========================================== */}

            <div className="table-container">

                <table className="brand-table">

                    <thead>

                        <tr>

                            <th>

                                Logo

                            </th>

                            <th>

                                Brand Name

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredBrands.length===0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan="3"

                                        className="no-data"

                                    >

                                        No Brands Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredBrands.map((brand)=>(

                                    <tr

                                        key={brand.id}

                                    >

                                        <td>

                                            <img

                                                src={brand.logo}

                                                alt={brand.name}

                                                className="brand-logo"

                                                onError={(e)=>{

                                                    e.target.src="/images/no-image.png";

                                                }}

                                            />

                                        </td>

                                        <td>

                                            {brand.name}

                                        </td>

                                        <td>

                                            <div

                                                className="action-buttons"

                                            >

                                                <button

                                                    className="edit-btn"

                                                    onClick={()=>

                                                        openEditModal(brand)

                                                    }

                                                >

                                                    <FaEdit />

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={()=>

                                                        openDeleteModal(brand)

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
                        ADD BRAND MODAL
            ========================================== */}

            {

                showAddModal && (

                    <div className="modal-overlay">

                        <div className="brand-modal">

                            <div className="modal-header">

                                <h2>

                                    Add Brand

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

                                    placeholder="Brand Name"

                                    value={formData.name}

                                    onChange={handleChange}

                                />

                                <input

                                    type="text"

                                    name="logo"

                                    placeholder="Brand Logo URL"

                                    value={formData.logo}

                                    onChange={handleChange}

                                />

                                {

                                    formData.logo && (

                                        <img

                                            src={formData.logo}

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

                                        onClick={addBrand}

                                    >

                                        Save Brand

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        EDIT BRAND MODAL
            ========================================== */}

            {

                showEditModal && (

                    <div className="modal-overlay">

                        <div className="brand-modal">

                            <div className="modal-header">

                                <h2>

                                    Edit Brand

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

                                    name="logo"

                                    value={formData.logo}

                                    onChange={handleChange}

                                />

                                {

                                    formData.logo && (

                                        <img

                                            src={formData.logo}

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

                                        onClick={updateBrand}

                                    >

                                        Update Brand

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                        DELETE BRAND MODAL
            ========================================== */}

            {

                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <h2>

                                Delete Brand

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}

                                    {selectedBrand?.name}

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

                                    onClick={deleteBrand}

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

export default Brands;