import { useEffect, useMemo, useState } from "react";

import {
    FaChartLine,
    FaRupeeSign,
    FaShoppingCart,
    FaUsers,
    FaBoxOpen,
    FaStar,
    FaClipboardList
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Reports.css";

function Reports() {

    /* ==========================================
                    STATES
    ========================================== */

    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);

    const [users, setUsers] = useState([]);

    const [reviews, setReviews] = useState([]);

    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] = useState(true);

    /* ==========================================
                    LOAD DATA
    ========================================== */

    useEffect(() => {

        loadReports();

    }, []);

    const loadReports = async () => {

        try {

            const [

                ordersRes,

                productsRes,

                usersRes,

                reviewsRes,

                couponsRes

            ] = await Promise.all([

                api.get("/orders"),

                api.get("/products"),

                api.get("/users"),

                api.get("/reviews"),

                api.get("/coupons")

            ]);

            setOrders(ordersRes.data);

            setProducts(productsRes.data);

            setUsers(usersRes.data);

            setReviews(reviewsRes.data);

            setCoupons(couponsRes.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                DASHBOARD STATISTICS
    ========================================== */

    const totalRevenue = useMemo(() => {

        return orders.reduce(

            (sum, order) =>

                sum + Number(order.total || 0),

            0

        );

    }, [orders]);

    const totalOrders = orders.length;

    const totalProducts = products.length;

    const totalCustomers = users.filter(

        user =>

            user.role === "user"

    ).length;

    const totalReviews = reviews.length;

    const totalCoupons = coupons.length;

    const averageOrderValue =

        totalOrders === 0

            ? 0

            : (

                totalRevenue /

                totalOrders

            ).toFixed(2);

    const averageRating =

        reviews.length === 0

            ? 0

            : (

                reviews.reduce(

                    (sum, review) =>

                        sum + Number(review.rating),

                    0

                ) /

                reviews.length

            ).toFixed(1);

    /* ==========================================
                LOADING
    ========================================== */

    if (loading) {

        return (

            <div className="admin-loading">

                Loading Reports...

            </div>

        );

    }

    /* ==========================================
                PAGE START
    ========================================== */

    return (

            <AdminLayout>

                <div className="reports-page">

                    <div className="reports-header">

                        <div>

                            <h1>

                                Reports & Analytics

                            </h1>

                            <p>

                                Business overview and sales insights.

                            </p>

                        </div>

                    </div>

                    {/* ==========================================
                            REPORT CARDS
                    ========================================== */}

                    <div className="reports-stats">

                        <div className="stat-card">

                            <FaRupeeSign />

                            <div>

                                <h2>

                                    ₹

                                    {totalRevenue.toLocaleString()}

                                </h2>

                                <p>

                                    Total Revenue

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaShoppingCart />

                            <div>

                                <h2>

                                    {totalOrders}

                                </h2>

                                <p>

                                    Total Orders

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaUsers />

                            <div>

                                <h2>

                                    {totalCustomers}

                                </h2>

                                <p>

                                    Customers

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaBoxOpen />

                            <div>

                                <h2>

                                    {totalProducts}

                                </h2>

                                <p>

                                    Products

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaClipboardList />

                            <div>

                                <h2>

                                    ₹

                                    {Number(

                                        averageOrderValue

                                    ).toLocaleString()}

                                </h2>

                                <p>

                                    Avg Order Value

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaStar />

                            <div>

                                <h2>

                                    {averageRating}

                                </h2>

                                <p>

                                    Average Rating

                                </p>

                            </div>

                        </div>

                    </div>
                                        {/* ==========================================
                            REPORT SECTIONS
                    ========================================== */}

                    <div className="reports-grid">

                        {/* ==============================
                                SALES REPORT
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Sales Report

                            </h2>

                            <div className="report-content">

                                <div className="report-item">

                                    <span>Total Revenue</span>

                                    <strong>

                                        ₹{totalRevenue.toLocaleString()}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Total Orders</span>

                                    <strong>

                                        {totalOrders}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Average Order Value</span>

                                    <strong>

                                        ₹{Number(averageOrderValue).toLocaleString()}

                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                                PRODUCT REPORT
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Product Report

                            </h2>

                            <div className="report-content">

                                <div className="report-item">

                                    <span>Total Products</span>

                                    <strong>

                                        {totalProducts}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Low Stock</span>

                                    <strong>

                                        {

                                            products.filter(

                                                item =>

                                                    item.stock > 0 &&

                                                    item.stock <= 10

                                            ).length

                                        }

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Out Of Stock</span>

                                    <strong>

                                        {

                                            products.filter(

                                                item =>

                                                    item.stock <= 0

                                            ).length

                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                                CUSTOMER REPORT
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Customer Report

                            </h2>

                            <div className="report-content">

                                <div className="report-item">

                                    <span>Total Customers</span>

                                    <strong>

                                        {totalCustomers}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Admins</span>

                                    <strong>

                                        {

                                            users.filter(

                                                user =>

                                                    user.role === "admin"

                                            ).length

                                        }

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Total Users</span>

                                    <strong>

                                        {users.length}

                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                                REVIEW REPORT
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Review Report

                            </h2>

                            <div className="report-content">

                                <div className="report-item">

                                    <span>Total Reviews</span>

                                    <strong>

                                        {totalReviews}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Average Rating</span>

                                    <strong>

                                        {averageRating} ⭐

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>5 Star Reviews</span>

                                    <strong>

                                        {

                                            reviews.filter(

                                                review =>

                                                    Number(review.rating) === 5

                                            ).length

                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                                COUPON REPORT
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Coupon Report

                            </h2>

                            <div className="report-content">

                                <div className="report-item">

                                    <span>Total Coupons</span>

                                    <strong>

                                        {totalCoupons}

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Active Coupons</span>

                                    <strong>

                                        {

                                            coupons.filter(

                                                coupon =>

                                                    coupon.status === "Active"

                                            ).length

                                        }

                                    </strong>

                                </div>

                                <div className="report-item">

                                    <span>Total Coupon Usage</span>

                                    <strong>

                                        {

                                            coupons.reduce(

                                                (sum, coupon) =>

                                                    sum +

                                                    Number(coupon.usedCount || 0),

                                                0

                                            )

                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ==============================
                                TOP PRODUCTS
                        ============================== */}

                        <div className="report-card">

                            <h2>

                                Top Rated Products

                            </h2>

                            <div className="top-products">

                                {

                                    [...products]

                                        .sort(

                                            (a, b) =>

                                                b.rating -

                                                a.rating

                                        )

                                        .slice(0, 5)

                                        .map(product => (

                                            <div

                                                key={product.id}

                                                className="product-row"

                                            >

                                                <img

                                                    src={product.images?.[0]}

                                                    alt={product.name}

                                                />

                                                <div>

                                                    <h4>

                                                        {product.name}

                                                    </h4>

                                                    <span>

                                                        ⭐ {product.rating}

                                                    </span>

                                                </div>

                                            </div>

                                        ))

                                }

                            </div>

                        </div>

                    </div>
                                        {/* ==========================================
                            QUICK INSIGHTS
                    ========================================== */}

                    <div className="report-insights">

                        <div className="insight-card success">

                            <h3>

                                Highest Rated Product

                            </h3>

                            {

                                products.length > 0 ? (

                                    (() => {

                                        const highestRated = [...products].sort(

                                            (a, b) =>

                                                b.rating - a.rating

                                        )[0];

                                        return (

                                            <>

                                                <h2>

                                                    {highestRated.name}

                                                </h2>

                                                <p>

                                                    ⭐ {highestRated.rating}

                                                </p>

                                            </>

                                        );

                                    })()

                                ) : (

                                    <p>

                                        No Products Available

                                    </p>

                                )

                            }

                        </div>

                        <div className="insight-card warning">

                            <h3>

                                Low Stock Products

                            </h3>

                            <h2>

                                {

                                    products.filter(

                                        product =>

                                            product.stock > 0 &&

                                            product.stock <= 10

                                    ).length

                                }

                            </h2>

                            <p>

                                Products require restocking.

                            </p>

                        </div>

                        <div className="insight-card danger">

                            <h3>

                                Out Of Stock

                            </h3>

                            <h2>

                                {

                                    products.filter(

                                        product =>

                                            product.stock <= 0

                                    ).length

                                }

                            </h2>

                            <p>

                                Products unavailable for purchase.

                            </p>

                        </div>

                    </div>

                    {/* ==========================================
                            REPORT ACTIONS
                    ========================================== */}

                    <div className="report-actions">

                        <button

                            className="print-btn"

                            onClick={() => window.print()}

                        >

                            Print Report

                        </button>

                        <button

                            className="refresh-btn"

                            onClick={loadReports}

                        >

                            Refresh Report

                        </button>

                    </div>

                </div>
        </AdminLayout>
    );

}

export default Reports;