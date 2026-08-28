import { Routes, Route } from "react-router-dom";

/* =========================================================
   CUSTOMER PAGES
========================================================= */

import Splash from "../pages/Customer/Splash";
import Home from "../pages/Customer/Home";
import Products from "../pages/Customer/Products";
import NewArrivals from "../pages/Customer/NewArrivals";
import ProductDetails from "../pages/Customer/ProductDetails";

import Categories from "../pages/Customer/Categories";
import CategoryProducts from "../pages/Customer/CategoryProducts";

import Cart from "../pages/Customer/Cart";
import Wishlist from "../pages/Customer/Wishlist";
import Checkout from "../pages/Customer/Checkout";

import Profile from "../pages/Customer/Profile";
import EditProfile from "../pages/Customer/EditProfile";
import ChangePassword from "../pages/Customer/ChangePassword";

import Orders from "../pages/Customer/Orders";
import MyOrders from "../pages/Customer/MyOrders";
import OrderDetails from "../pages/Customer/OrderDetails";
import OrderTracking from "../pages/Customer/OrderTracking";
import OrderSuccess from "../pages/Customer/OrderSuccess";

import CancelOrder from "../pages/Customer/CancelOrder";
import Invoice from "../pages/Customer/Invoice";

import ReturnRequest from "../pages/Customer/ReturnRequest";
import Returns from "../pages/Customer/Returns";

import Review from "../pages/Customer/Review";

import Addresses from "../pages/Customer/Addresses";
import SavedAddresses from "../pages/Customer/SavedAddresses";
import AddAddress from "../pages/Customer/AddAddress";
import EditAddress from "../pages/Customer/EditAddress";

import Notifications from "../pages/Customer/Notifications";

import Payment from "../pages/Customer/Payment";
import PaymentSuccess from "../pages/Customer/PaymentSuccess";
import PaymentFailed from "../pages/Customer/PaymentFailed";

import Support from "../pages/Customer/Support";
import TrackOrder from "../pages/Customer/TrackOrder";
import PrivacyPolicy from "../pages/Customer/Privacy";
import Terms from "../pages/Customer/Terms";


/* =========================================================
   AUTH PAGES
========================================================= */

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";


/* =========================================================
   ADMIN PAGES
========================================================= */

import Dashboard from "../pages/Admin/Dashboard";
import AdminProducts from "../pages/Admin/Products";
import AdminCategories from "../pages/Admin/Categories";
import AdminBrands from "../pages/Admin/Brands";
import AdminOrders from "../pages/Admin/Orders";
import AdminUsers from "../pages/Admin/Users";
import Analytics from "../pages/Admin/Analytics";
import Reviews from "../pages/Admin/Reviews";
import Coupons from "../pages/Admin/Coupons";
import Inventory from "../pages/Admin/Inventory";
import Reports from "../pages/Admin/Reports";
import AdminProfile from "../pages/Admin/AdminProfile";
import AdminNotifications from "../pages/Admin/Notifications";


/* =========================================================
   ROUTE GUARDS
========================================================= */

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";


function AppRoutes() {
    return (
        <Routes>

            {/* =================================================
                PUBLIC ROUTES
            ================================================= */}

            {/* Splash */}
            <Route
                path="/"
                element={<Splash />}
            />

            {/* Home */}
            <Route
                path="/home"
                element={<Home />}
            />

            {/* Authentication */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* =================================================
                PRODUCT ROUTES
            ================================================= */}

            {/* All Products */}
            <Route
                path="/products"
                element={<Products />}
            />

            {/* Single Product */}
            <Route
                path="/products/:id"
                element={<ProductDetails />}
            />


            {/* =================================================
                CATEGORY ROUTES
            ================================================= */}

            {/* Category Landing Page */}
            <Route
                path="/categories"
                element={<Categories />}
            />

            {/* Individual Category Products */}
            <Route
                path="/categories/:categorySlug"
                element={<CategoryProducts />}
            />


            {/* =================================================
                NEW ARRIVALS
            ================================================= */}

            <Route
                path="/new-arrivals"
                element={<NewArrivals />}
            />


            {/* =================================================
                CUSTOMER BASIC PROTECTED ROUTES
            ================================================= */}

            {/* Cart */}
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                }
            />

            {/* Wishlist */}
            <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                }
            />

            {/* Checkout */}
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute>
                        <Checkout />
                    </ProtectedRoute>
                }
            />

            {/* Profile */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Edit Profile */}
            <Route
                path="/edit-profile"
                element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
            />

            {/* Change Password */}
            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                ORDER ROUTES
            ================================================= */}

            {/* Orders */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />

            {/* My Orders */}
            <Route
                path="/my-orders"
                element={
                    <ProtectedRoute>
                        <MyOrders />
                    </ProtectedRoute>
                }
            />

            {/* Order Details */}
            <Route
                path="/orders/:orderId"
                element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }
            />

            {/* General Track Order Page */}
            <Route
                path="/track-order"
                element={<TrackOrder />}
            />

            {/* Specific Order Tracking */}
            <Route
                path="/track-order/:id"
                element={
                    <ProtectedRoute>
                        <OrderTracking />
                    </ProtectedRoute>
                }
            />

            {/* Cancel Order */}
            <Route
                path="/cancel-order/:id"
                element={
                    <ProtectedRoute>
                        <CancelOrder />
                    </ProtectedRoute>
                }
            />

            {/* Invoice */}
            <Route
                path="/invoice/:id"
                element={
                    <ProtectedRoute>
                        <Invoice />
                    </ProtectedRoute>
                }
            />

            {/* Order Success */}
            <Route
                path="/order-success"
                element={
                    <ProtectedRoute>
                        <OrderSuccess />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                RETURN / EXCHANGE
            ================================================= */}

            {/* Return / Exchange Request */}
            <Route
                path="/return-exchange/:id"
                element={
                    <ProtectedRoute>
                        <ReturnRequest />
                    </ProtectedRoute>
                }
            />

            {/* All Returns */}
            <Route
                path="/returns"
                element={
                    <ProtectedRoute>
                        <Returns />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                SUPPORT
            ================================================= */}

            <Route
                path="/support"
                element={<Support />}
            />

            <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
            />

            <Route
                path="/terms"
                element={<Terms />}
            />


            {/* =================================================
                PRODUCT REVIEW
            ================================================= */}

            <Route
                path="/review/:orderId/:productId"
                element={
                    <ProtectedRoute>
                        <Review />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                ADDRESS ROUTES
            ================================================= */}

            <Route
                path="/addresses"
                element={
                    <ProtectedRoute>
                        <Addresses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/saved-addresses"
                element={
                    <ProtectedRoute>
                        <SavedAddresses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/add-address"
                element={
                    <ProtectedRoute>
                        <AddAddress />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-address/:id"
                element={
                    <ProtectedRoute>
                        <EditAddress />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                CUSTOMER NOTIFICATIONS
            ================================================= */}

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                PAYMENT ROUTES
            ================================================= */}

            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <Payment />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment-success"
                element={
                    <ProtectedRoute>
                        <PaymentSuccess />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment-failed"
                element={
                    <ProtectedRoute>
                        <PaymentFailed />
                    </ProtectedRoute>
                }
            />


            {/* =================================================
                ADMIN ROUTES
            ================================================= */}

            <Route
                path="/admin/dashboard"
                element={
                    <AdminRoute>
                        <Dashboard />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/products"
                element={
                    <AdminRoute>
                        <AdminProducts />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/categories"
                element={
                    <AdminRoute>
                        <AdminCategories />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/brands"
                element={
                    <AdminRoute>
                        <AdminBrands />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/orders"
                element={
                    <AdminRoute>
                        <AdminOrders />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <AdminUsers />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/analytics"
                element={
                    <AdminRoute>
                        <Analytics />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/reviews"
                element={
                    <AdminRoute>
                        <Reviews />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/coupons"
                element={
                    <AdminRoute>
                        <Coupons />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/inventory"
                element={
                    <AdminRoute>
                        <Inventory />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/reports"
                element={
                    <AdminRoute>
                        <Reports />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/notifications"
                element={
                    <AdminRoute>
                        <AdminNotifications />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/profile"
                element={
                    <AdminRoute>
                        <AdminProfile />
                    </AdminRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;