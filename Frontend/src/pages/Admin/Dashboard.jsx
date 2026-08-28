import { useEffect, useState } from "react";

import {
    FaBoxOpen,
    FaShoppingBag,
    FaUsers,
    FaRupeeSign
} from "react-icons/fa";

import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
import SalesChart from "../../components/Admin/SalesChart/SalesChart";
import RecentOrders from "../../components/Admin/RecentOrders/RecentOrders";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Dashboard.css";

function Dashboard() {

    const [products, setProducts] = useState([]);

    const [orders, setOrders] = useState([]);

    const [users, setUsers] = useState([]);

    const [revenue, setRevenue] = useState(0);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const [

                productsRes,

                ordersRes,

                usersRes

            ] = await Promise.all([

                api.get("/products"),

                api.get("/orders"),

                api.get("/users")

            ]);

            setProducts(productsRes.data);

            setOrders(ordersRes.data);

            setUsers(usersRes.data);

            const totalRevenue = ordersRes.data.reduce(

                (sum, order) => sum + Number(order.total || 0),

                0

            );

            setRevenue(totalRevenue);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <AdminLayout>

            <div className="dashboard-cards">

                <DashboardCard
                    title="Products"
                    value={products.length}
                    icon={<FaBoxOpen />}
                    color="#2563eb"
                />

                <DashboardCard
                    title="Orders"
                    value={orders.length}
                    icon={<FaShoppingBag />}
                    color="#16a34a"
                />

                <DashboardCard
                    title="Users"
                    value={users.length}
                    icon={<FaUsers />}
                    color="#9333ea"
                />

                <DashboardCard
                    title="Revenue"
                    value={`₹${revenue.toLocaleString()}`}
                    icon={<FaRupeeSign />}
                    color="#ea580c"
                />

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-chart">

                    <SalesChart orders={orders} />

                </div>

                <div className="dashboard-orders">

                    <RecentOrders orders={orders} />

                </div>

            </div>

        </AdminLayout>

    );

}

export default Dashboard;