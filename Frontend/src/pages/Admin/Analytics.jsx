import { useEffect, useState } from "react";

import {
    FaUsers,
    FaBoxOpen,
    FaShoppingBag,
    FaRupeeSign,
    FaTags,
    FaBuilding
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Analytics.css";

function Analytics() {

    /* ==========================================
                STATES
    ========================================== */

    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);

    const [users, setUsers] = useState([]);

    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    /* ==========================================
                LOAD DATA
    ========================================== */

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const [

                ordersRes,

                productsRes,

                usersRes,

                categoriesRes,

                brandsRes

            ] = await Promise.all([

                api.get("/orders"),

                api.get("/products"),

                api.get("/users"),

                api.get("/categories"),

                api.get("/brands")

            ]);

            setOrders(ordersRes.data);

            setProducts(productsRes.data);

            setUsers(usersRes.data);

            setCategories(categoriesRes.data);

            setBrands(brandsRes.data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    /* ==========================================
            TOTAL REVENUE
    ========================================== */

    const totalRevenue = orders.reduce(

        (sum, order)=>

            sum + Number(order.total || 0),

        0

    );

    /* ==========================================
            ORDER STATUS
    ========================================== */

    const deliveredOrders = orders.filter(

        order=>order.orderStatus==="Delivered"

    ).length;

    const pendingOrders = orders.filter(

        order=>order.orderStatus==="Pending"

    ).length;

    const processingOrders = orders.filter(

        order=>order.orderStatus==="Processing"

    ).length;

    const shippedOrders = orders.filter(

        order=>order.orderStatus==="Shipped"

    ).length;

    const cancelledOrders = orders.filter(

        order=>order.orderStatus==="Cancelled"

    ).length;

    /* ==========================================
            PAYMENT METHODS
    ========================================== */

    const upiOrders = orders.filter(

        order=>order.paymentMethod==="UPI"

    ).length;

    const codOrders = orders.filter(

        order=>order.paymentMethod==="Cash on Delivery"

    ).length;

    const cardOrders = orders.filter(

        order=>

        order.paymentMethod==="Credit Card" ||

        order.paymentMethod==="Debit Card"

    ).length;

    /* ==========================================
            RECENT ORDERS
    ========================================== */

    const recentOrders =

        [...orders]

        .reverse()

        .slice(0,5);

    /* ==========================================
            LOADING
    ========================================== */

    if(loading){

        return(

            <h2 className="loading-text">

                Loading Analytics...

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

                        Analytics Dashboard

                    </h1>

                    <p>

                        Monitor sales, customers and business performance.

                    </p>

                </div>

            </div>

            {/* ==========================================
                    SUMMARY CARDS
            ========================================== */}

            <div className="analytics-cards">

                <div className="analytics-card revenue">

                    <div className="card-icon">

                        <FaRupeeSign />

                    </div>

                    <div>

                        <span>

                            Total Revenue

                        </span>

                        <h2>

                            ₹

                            {

                                totalRevenue.toLocaleString()

                            }

                        </h2>

                    </div>

                </div>

                <div className="analytics-card orders">

                    <div className="card-icon">

                        <FaShoppingBag />

                    </div>

                    <div>

                        <span>

                            Orders

                        </span>

                        <h2>

                            {orders.length}

                        </h2>

                    </div>

                </div>

                <div className="analytics-card users">

                    <div className="card-icon">

                        <FaUsers />

                    </div>

                    <div>

                        <span>

                            Users

                        </span>

                        <h2>

                            {users.length}

                        </h2>

                    </div>

                </div>

                <div className="analytics-card products">

                    <div className="card-icon">

                        <FaBoxOpen />

                    </div>

                    <div>

                        <span>

                            Products

                        </span>

                        <h2>

                            {products.length}

                        </h2>

                    </div>

                </div>

                <div className="analytics-card categories">

                    <div className="card-icon">

                        <FaTags />

                    </div>

                    <div>

                        <span>

                            Categories

                        </span>

                        <h2>

                            {categories.length}

                        </h2>

                    </div>

                </div>

                <div className="analytics-card brands">

                    <div className="card-icon">

                        <FaBuilding />

                    </div>

                    <div>

                        <span>

                            Brands

                        </span>

                        <h2>

                            {brands.length}

                        </h2>

                    </div>

                </div>

            </div>

            {/* ==========================================
                    ANALYTICS GRID
            ========================================== */}

            <div className="analytics-grid">

                {/* ==========================================
                        ORDER STATUS
                ========================================== */}

                <div className="analytics-box">

                    <h3>

                        Order Status

                    </h3>

                    <div className="status-list">

                        <div className="status-item">

                            <span>

                                Delivered

                            </span>

                            <strong>

                                {deliveredOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Processing

                            </span>

                            <strong>

                                {processingOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Pending

                            </span>

                            <strong>

                                {pendingOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Shipped

                            </span>

                            <strong>

                                {shippedOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Cancelled

                            </span>

                            <strong>

                                {cancelledOrders}

                            </strong>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        PAYMENT METHODS
                ========================================== */}

                <div className="analytics-box">

                    <h3>

                        Payment Methods

                    </h3>

                    <div className="status-list">

                        <div className="status-item">

                            <span>

                                UPI

                            </span>

                            <strong>

                                {upiOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Credit / Debit Card

                            </span>

                            <strong>

                                {cardOrders}

                            </strong>

                        </div>

                        <div className="status-item">

                            <span>

                                Cash On Delivery

                            </span>

                            <strong>

                                {codOrders}

                            </strong>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                    RECENT ORDERS
            ========================================== */}

            <div className="analytics-box">

                <h3>

                    Latest Orders

                </h3>

                <table className="recent-orders-table">

                    <thead>

                        <tr>

                            <th>

                                Order ID

                            </th>

                            <th>

                                Customer

                            </th>

                            <th>

                                Amount

                            </th>

                            <th>

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            recentOrders.map((order)=>(

                                <tr

                                    key={order.id}

                                >

                                    <td>

                                        {order.id}

                                    </td>

                                    <td>

                                        {order.customerName}

                                    </td>

                                    <td>

                                        ₹

                                        {

                                            order.total

                                            .toLocaleString()

                                        }

                                    </td>

                                    <td>

                                        <span

                                            className="status-badge"

                                        >

                                            {

                                                order.orderStatus

                                            }

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>
                        {/* ==========================================
                    TOP PRODUCTS
            ========================================== */}

            <div className="analytics-grid">

                <div className="analytics-box">

                    <h3>

                        Top Products

                    </h3>

                    <div className="analytics-list">

                        {

                            products

                            .slice(0,5)

                            .map((product)=>(

                                <div

                                    className="analytics-list-item"

                                    key={product.id}

                                >

                                    <img

                                        src={product.image}

                                        alt={product.name}

                                    />

                                    <div>

                                        <h4>

                                            {product.name}

                                        </h4>

                                        <span>

                                            ₹

                                            {

                                                Number(product.price)

                                                .toLocaleString()

                                            }

                                        </span>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* ==========================================
                        TOP BRANDS
                ========================================== */}

                <div className="analytics-box">

                    <h3>

                        Top Brands

                    </h3>

                    <div className="analytics-list">

                        {

                            brands

                            .slice(0,5)

                            .map((brand)=>(

                                <div

                                    className="analytics-list-item"

                                    key={brand.id}

                                >

                                    <img

                                        src={brand.logo}

                                        alt={brand.name}

                                    />

                                    <div>

                                        <h4>

                                            {brand.name}

                                        </h4>

                                        <span>

                                            Premium Brand

                                        </span>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

            {/* ==========================================
                    BUSINESS SUMMARY
            ========================================== */}

            <div className="analytics-box">

                <h3>

                    Business Summary

                </h3>

                <div className="summary-grid">

                    <div className="summary-card">

                        <h4>

                            Average Order Value

                        </h4>

                        <h2>

                            ₹

                            {

                                orders.length

                                ?

                                Math.round(

                                    totalRevenue /

                                    orders.length

                                ).toLocaleString()

                                :

                                0

                            }

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h4>

                            Total Revenue

                        </h4>

                        <h2>

                            ₹

                            {

                                totalRevenue

                                .toLocaleString()

                            }

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h4>

                            Active Customers

                        </h4>

                        <h2>

                            {

                                users.filter(

                                    user=>user.role==="user"

                                ).length

                            }

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h4>

                            Success Rate

                        </h4>

                        <h2>

                            {

                                orders.length

                                ?

                                Math.round(

                                    (deliveredOrders /

                                    orders.length)

                                    *100

                                )

                                :

                                0

                            }

                            %

                        </h2>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );

}

export default Analytics;