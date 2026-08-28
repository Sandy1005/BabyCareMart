import { useEffect, useState } from "react";

import {
    FaEye,
    FaTrash,
    FaSearch
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Orders.css";

function Orders() {

    /* ==========================================
                STATES
    ========================================== */

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==========================================
                LOAD ORDERS
    ========================================== */

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const response = await api.get("/orders");

            setOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                SEARCH + FILTER
    ========================================== */

    const filteredOrders = orders.filter((order) => {

        const matchesSearch =

            order.id.toLowerCase().includes(search.toLowerCase()) ||

            order.customerName.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =

            statusFilter === "All"

                ? true

                : order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;

    });

    /* ==========================================
            UPDATE ORDER STATUS
    ========================================== */

    const updateStatus = async (

        id,

        newStatus

    ) => {

        try {

            const order = orders.find(

                (o) => o.id === id

            );

            await api.put(

                `/orders/${id}`,

                {

                    ...order,

                    orderStatus: newStatus

                }

            );

            fetchOrders();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                VIEW ORDER
    ========================================== */

    const openViewModal = (order) => {

        setSelectedOrder(order);

        setShowViewModal(true);

    };

    const closeViewModal = () => {

        setSelectedOrder(null);

        setShowViewModal(false);

    };

    /* ==========================================
                DELETE ORDER
    ========================================== */

    const openDeleteModal = (order) => {

        setSelectedOrder(order);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedOrder(null);

        setShowDeleteModal(false);

    };

    const deleteOrder = async () => {

        if (!selectedOrder) return;

        try {

            await api.delete(

                `/orders/${selectedOrder.id}`

            );

            closeDeleteModal();

            fetchOrders();

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

                Loading Orders...

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

                        Order Management

                    </h1>

                    <p>

                        Manage customer orders and update delivery status.

                    </p>

                </div>

            </div>

            {/* ==========================================
                    SEARCH + FILTER
            ========================================== */}

            <div className="orders-toolbar">

                <div className="search-box">

                    <FaSearch />

                    <input

                        type="text"

                        placeholder="Search Order ID or Customer..."

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                    />

                </div>

                <select

                    value={statusFilter}

                    onChange={(e)=>setStatusFilter(e.target.value)}

                    className="status-filter"

                >

                    <option value="All">

                        All Orders

                    </option>

                    <option value="Pending">

                        Pending

                    </option>

                    <option value="Processing">

                        Processing

                    </option>

                    <option value="Shipped">

                        Shipped

                    </option>

                    <option value="Delivered">

                        Delivered

                    </option>

                    <option value="Cancelled">

                        Cancelled

                    </option>

                </select>

            </div>

            {/* ==========================================
                    ORDERS TABLE
            ========================================== */}

            <div className="table-container">

                <table className="orders-table">

                    <thead>

                        <tr>

                            <th>

                                Order ID

                            </th>

                            <th>

                                Customer

                            </th>

                            <th>

                                Date

                            </th>

                            <th>

                                Total

                            </th>

                            <th>

                                Payment

                            </th>

                            <th>

                                Payment Status

                            </th>

                            <th>

                                Order Status

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredOrders.length===0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan="8"

                                        className="no-data"

                                    >

                                        No Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredOrders.map((order)=>(

                                    <tr

                                        key={order.id}

                                    >

                                        <td>

                                            <strong>

                                                {order.id}

                                            </strong>

                                        </td>

                                        <td>

                                            <div className="customer-info">

                                                <h4>

                                                    {order.customerName}

                                                </h4>

                                                <span>

                                                    {order.phone}

                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            {order.orderDate}

                                        </td>

                                        <td>

                                            ₹

                                            {

                                                order.total.toLocaleString()

                                            }

                                        </td>

                                        <td>

                                            {order.paymentMethod}

                                        </td>

                                        <td>

                                            <span

                                                className={

                                                    order.paymentStatus==="Paid"

                                                    ?

                                                    "paid"

                                                    :

                                                    "pending"

                                                }

                                            >

                                                {

                                                    order.paymentStatus

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <select

                                                className="status-select"

                                                value={order.orderStatus}

                                                onChange={(e)=>

                                                    updateStatus(

                                                        order.id,

                                                        e.target.value

                                                    )

                                                }

                                            >

                                                <option>

                                                    Pending

                                                </option>

                                                <option>

                                                    Processing

                                                </option>

                                                <option>

                                                    Shipped

                                                </option>

                                                <option>

                                                    Delivered

                                                </option>

                                                <option>

                                                    Cancelled

                                                </option>

                                            </select>

                                        </td>

                                        <td>

                                            <div

                                                className="action-buttons"

                                            >

                                                <button

                                                    className="view-btn"

                                                    onClick={()=>

                                                        openViewModal(order)

                                                    }

                                                >

                                                    <FaEye />

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={()=>

                                                        openDeleteModal(order)

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
                    VIEW ORDER MODAL
            ========================================== */}

            {

                showViewModal && selectedOrder && (

                    <div className="modal-overlay">

                        <div className="order-modal">

                            <div className="modal-header">

                                <h2>

                                    Order Details

                                </h2>

                                <button

                                    className="close-btn"

                                    onClick={closeViewModal}

                                >

                                    ✕

                                </button>

                            </div>

                            <div className="modal-body">

                                <div className="order-section">

                                    <h3>

                                        Customer Details

                                    </h3>

                                    <p>

                                        <strong>Name :</strong>

                                        {selectedOrder.customerName}

                                    </p>

                                    <p>

                                        <strong>Phone :</strong>

                                        {selectedOrder.phone}

                                    </p>

                                    <p>

                                        <strong>Email :</strong>

                                        {selectedOrder.email}

                                    </p>

                                    <p>

                                        <strong>Address :</strong>

                                        {selectedOrder.address}

                                    </p>

                                </div>

                                <div className="order-section">

                                    <h3>

                                        Payment Details

                                    </h3>

                                    <p>

                                        <strong>Method :</strong>

                                        {selectedOrder.paymentMethod}

                                    </p>

                                    <p>

                                        <strong>Status :</strong>

                                        {selectedOrder.paymentStatus}

                                    </p>

                                    <p>

                                        <strong>Total :</strong>

                                        ₹{selectedOrder.total.toLocaleString()}

                                    </p>

                                </div>

                                <div className="order-section">

                                    <h3>

                                        Ordered Products

                                    </h3>

                                    {

                                        selectedOrder.products.map((product)=>(

                                            <div

                                                className="ordered-product"

                                                key={product.id}

                                            >

                                                <img

                                                    src={product.image}

                                                    alt={product.name}

                                                    className="ordered-product-image"

                                                />

                                                <div>

                                                    <h4>

                                                        {product.name}

                                                    </h4>

                                                    <p>

                                                        ₹{product.price}

                                                    </p>

                                                    <p>

                                                        Qty : {product.quantity}

                                                    </p>

                                                </div>

                                            </div>

                                        ))

                                    }

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

                                Delete Order

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}

                                    {selectedOrder?.id}

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

                                    onClick={deleteOrder}

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

export default Orders;