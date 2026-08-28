import { useEffect, useMemo, useState } from "react";

import {
    FaTicketAlt,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Coupons.css";

function Coupons() {

    /* ==========================================
                    STATES
    ========================================== */

    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);

    const [editingCoupon, setEditingCoupon] = useState(null);

    const [formData, setFormData] = useState({

        code: "",

        description: "",

        discountType: "Percentage",

        discountValue: "",

        minimumOrder: "",

        maximumDiscount: "",

        expiryDate: "",

        usageLimit: "",

        usedCount: 0,

        status: "Active"

    });

    /* ==========================================
                    LOAD COUPONS
    ========================================== */

    useEffect(() => {

        fetchCoupons();

    }, []);

    const fetchCoupons = async () => {

        try {

            const response = await api.get("/coupons");

            const sortedCoupons = response.data.sort(

                (a, b) =>

                    new Date(b.expiryDate) -

                    new Date(a.expiryDate)

            );

            setCoupons(sortedCoupons);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                    SEARCH & FILTER
    ========================================== */

    const filteredCoupons = useMemo(() => {

        return coupons.filter(coupon => {

            const matchesSearch =

                coupon.code

                    .toLowerCase()

                    .includes(search.toLowerCase())

                ||

                coupon.description

                    .toLowerCase()

                    .includes(search.toLowerCase());

            const matchesFilter =

                filter === "All"

                ||

                coupon.status === filter;

            return matchesSearch && matchesFilter;

        });

    }, [

        coupons,

        search,

        filter

    ]);

    /* ==========================================
                    STATISTICS
    ========================================== */

    const totalCoupons = coupons.length;

    const activeCoupons = coupons.filter(

        item => item.status === "Active"

    ).length;

    const inactiveCoupons = coupons.filter(

        item => item.status === "Inactive"

    ).length;

    const expiredCoupons = coupons.filter(

        item =>

            new Date(item.expiryDate) < new Date()

    ).length;

    /* ==========================================
                    FORM
    ========================================== */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const resetForm = () => {

        setEditingCoupon(null);

        setFormData({

            code: "",

            description: "",

            discountType: "Percentage",

            discountValue: "",

            minimumOrder: "",

            maximumDiscount: "",

            expiryDate: "",

            usageLimit: "",

            usedCount: 0,

            status: "Active"

        });

    };

    const openAddModal = () => {

        resetForm();

        setShowModal(true);

    };

    const openEditModal = (coupon) => {

        setEditingCoupon(coupon);

        setFormData({

            ...coupon

        });

        setShowModal(true);

    };

    const closeModal = () => {

        setShowModal(false);

        resetForm();

    };

    /* ==========================================
                    SAVE COUPON
    ========================================== */

    const saveCoupon = async () => {

        try {

            if (editingCoupon) {

                await api.put(

                    `/coupons/${editingCoupon.id}`,

                    {

                        ...formData,

                        discountValue: Number(formData.discountValue),

                        minimumOrder: Number(formData.minimumOrder),

                        maximumDiscount: Number(formData.maximumDiscount),

                        usageLimit: Number(formData.usageLimit),

                        usedCount: Number(formData.usedCount)

                    }

                );

            }

            else {

                await api.post(

                    "/coupons",

                    {

                        id: `CPN${Date.now()}`,

                        ...formData,

                        discountValue: Number(formData.discountValue),

                        minimumOrder: Number(formData.minimumOrder),

                        maximumDiscount: Number(formData.maximumDiscount),

                        usageLimit: Number(formData.usageLimit),

                        usedCount: 0

                    }

                );

            }

            closeModal();

            fetchCoupons();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                    DELETE
    ========================================== */

    const deleteCoupon = async (id) => {

        const confirmDelete = window.confirm(

            "Delete this coupon?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/coupons/${id}`);

            fetchCoupons();

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

                Loading Coupons...

            </div>

        );

    }

    /* ==========================================
                    PAGE START
    ========================================== */

    return (

            <AdminLayout>

                <div className="coupons-page">

                    <div className="coupons-header">

                        <div>

                            <h1>

                                Coupons Management

                            </h1>

                            <p>

                                Create and manage discount coupons.

                            </p>

                        </div>

                        <button

                            className="add-coupon-btn"

                            onClick={openAddModal}

                        >

                            <FaPlus />

                            Add Coupon

                        </button>

                    </div>

                    {/* ==========================================
                            STATISTICS
                    ========================================== */}

                    <div className="coupon-stats">

                        <div className="stat-card">

                            <FaTicketAlt />

                            <div>

                                <h2>{totalCoupons}</h2>

                                <p>Total Coupons</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaCheckCircle />

                            <div>

                                <h2>{activeCoupons}</h2>

                                <p>Active</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaTimesCircle />

                            <div>

                                <h2>{inactiveCoupons}</h2>

                                <p>Inactive</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaTicketAlt />

                            <div>

                                <h2>{expiredCoupons}</h2>

                                <p>Expired</p>

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                            SEARCH & FILTER
                    ========================================== */}

                    <div className="coupon-toolbar">

                        <div className="coupon-search">

                            <FaSearch />

                            <input

                                type="text"

                                placeholder="Search Coupon..."

                                value={search}

                                onChange={(e)=>

                                    setSearch(e.target.value)

                                }

                            />

                        </div>

                        <select

                            value={filter}

                            onChange={(e)=>

                                setFilter(e.target.value)

                            }

                        >

                            <option value="All">All</option>

                            <option value="Active">Active</option>

                            <option value="Inactive">Inactive</option>

                        </select>

                    </div>
                                        {/* ==========================================
                            COUPONS TABLE
                    ========================================== */}

                    <div className="coupons-table">

                        <table>

                            <thead>

                                <tr>

                                    <th>Coupon Code</th>

                                    <th>Description</th>

                                    <th>Discount</th>

                                    <th>Minimum Order</th>

                                    <th>Maximum Discount</th>

                                    <th>Usage</th>

                                    <th>Expiry</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredCoupons.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan="9"

                                                className="no-data"

                                            >

                                                No Coupons Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        filteredCoupons.map(coupon => (

                                            <tr key={coupon.id}>

                                                <td>

                                                    <strong>

                                                        {coupon.code}

                                                    </strong>

                                                </td>

                                                <td>

                                                    {coupon.description}

                                                </td>

                                                <td>

                                                    {

                                                        coupon.discountType === "Percentage"

                                                        ?

                                                        `${coupon.discountValue}%`

                                                        :

                                                        `₹${coupon.discountValue}`

                                                    }

                                                </td>

                                                <td>

                                                    ₹{coupon.minimumOrder}

                                                </td>

                                                <td>

                                                    ₹{coupon.maximumDiscount}

                                                </td>

                                                <td>

                                                    {

                                                        coupon.usedCount

                                                    }

                                                    /

                                                    {

                                                        coupon.usageLimit

                                                    }

                                                </td>

                                                <td>

                                                    {coupon.expiryDate}

                                                </td>

                                                <td>

                                                    <span

                                                        className={`coupon-status ${

                                                            coupon.status

                                                                .toLowerCase()

                                                        }`}

                                                    >

                                                        {coupon.status}

                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="coupon-actions">

                                                        <button

                                                            className="edit-btn"

                                                            onClick={() =>

                                                                openEditModal(

                                                                    coupon

                                                                )

                                                            }

                                                        >

                                                            <FaEdit />

                                                        </button>

                                                        <button

                                                            className="delete-btn"

                                                            onClick={() =>

                                                                deleteCoupon(

                                                                    coupon.id

                                                                )

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
                            ADD / EDIT MODAL
                    ========================================== */}

                    {

                        showModal && (

                            <div className="modal-overlay">

                                <div className="coupon-modal">

                                    <h2>

                                        {

                                            editingCoupon

                                            ?

                                            "Edit Coupon"

                                            :

                                            "Add Coupon"

                                        }

                                    </h2>

                                    <div className="coupon-form">

                                        <input

                                            type="text"

                                            name="code"

                                            placeholder="Coupon Code"

                                            value={formData.code}

                                            onChange={handleChange}

                                        />

                                        <input

                                            type="text"

                                            name="description"

                                            placeholder="Description"

                                            value={formData.description}

                                            onChange={handleChange}

                                        />

                                        <select

                                            name="discountType"

                                            value={formData.discountType}

                                            onChange={handleChange}

                                        >

                                            <option>

                                                Percentage

                                            </option>

                                            <option>

                                                Fixed

                                            </option>

                                        </select>

                                        <input

                                            type="number"

                                            name="discountValue"

                                            placeholder="Discount Value"

                                            value={formData.discountValue}

                                            onChange={handleChange}

                                        />

                                        <input

                                            type="number"

                                            name="minimumOrder"

                                            placeholder="Minimum Order"

                                            value={formData.minimumOrder}

                                            onChange={handleChange}

                                        />

                                        <input

                                            type="number"

                                            name="maximumDiscount"

                                            placeholder="Maximum Discount"

                                            value={formData.maximumDiscount}

                                            onChange={handleChange}

                                        />
                                                                                <input

                                            type="date"

                                            name="expiryDate"

                                            value={formData.expiryDate}

                                            onChange={handleChange}

                                        />

                                        <input

                                            type="number"

                                            name="usageLimit"

                                            placeholder="Usage Limit"

                                            value={formData.usageLimit}

                                            onChange={handleChange}

                                        />

                                        <input

                                            type="number"

                                            name="usedCount"

                                            placeholder="Used Count"

                                            value={formData.usedCount}

                                            onChange={handleChange}

                                            disabled={!editingCoupon}

                                        />

                                        <select

                                            name="status"

                                            value={formData.status}

                                            onChange={handleChange}

                                        >

                                            <option value="Active">

                                                Active

                                            </option>

                                            <option value="Inactive">

                                                Inactive

                                            </option>

                                        </select>

                                    </div>

                                    <div className="coupon-modal-actions">

                                        <button

                                            className="cancel-btn"

                                            onClick={closeModal}

                                        >

                                            Cancel

                                        </button>

                                        <button

                                            className="save-btn"

                                            onClick={saveCoupon}

                                        >

                                            {

                                                editingCoupon

                                                ?

                                                "Update Coupon"

                                                :

                                                "Create Coupon"

                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )

                    }

                </div>
        </AdminLayout>
    );

}

export default Coupons;