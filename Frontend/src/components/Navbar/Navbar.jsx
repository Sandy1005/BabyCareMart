import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaChevronDown,
  FaHome,
  FaBoxOpen,
  FaThLarge,
  FaHeadset,
  FaUndoAlt,
  FaTruck,
  FaShieldAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import api from "../../services/api";

import "./Navbar.css";


/* ============================================================
   NAVBAR COMPONENT
   ============================================================ */

const Navbar = () => {

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] =
    useState(0);


  /* ============================================================
     FETCH CART COUNT
     ============================================================ */

  const fetchCartCount = async () => {
    try {

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {
        setCartCount(0);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user || user.id === undefined || user.id === null) {
        setCartCount(0);
        return;
      }


      const response = await api.get("/cart");


      const allCartItems =
        Array.isArray(response.data)
          ? response.data
          : [];


      const userCartItems =
        allCartItems.filter(
          (item) =>
            String(item.userId) ===
            String(user.id)
        );


      const totalCartQuantity =
        userCartItems.reduce(
          (total, item) => {

            const quantity =
              Number(item.quantity);

            if (
              Number.isFinite(quantity) &&
              quantity > 0
            ) {
              return total + quantity;
            }

            return total + 1;
          },
          0
        );


      setCartCount(totalCartQuantity);

    }
    catch (error) {

      console.error(
        "Navbar Cart Count Error:",
        error
      );

      setCartCount(0);
    }
  };


  /* ============================================================
     FETCH WISHLIST COUNT
     ============================================================ */

  const fetchWishlistCount = async () => {
    try {

      const storedUser =
        localStorage.getItem("user");


      /*
        If user is not logged in,
        count should be 0.
      */

      if (!storedUser) {
        setWishlistCount(0);
        return;
      }


      const user = JSON.parse(storedUser);


      if (!user || user.id === undefined || user.id === null) {
        setWishlistCount(0);
        return;
      }


      /*
        Fetch ALL wishlist records.
      */

      const response =
        await api.get("/wishlist");


      const allWishlistItems =
        Array.isArray(response.data)
          ? response.data
          : [];


      /*
        Get only the current user's wishlist.
      */

      const userWishlistItems =
        allWishlistItems.filter(
          (item) =>
            String(item.userId) ===
            String(user.id)
        );


      /*
        Wishlist does not use quantity.

        Every wishlist record represents
        one product.
      */

      setWishlistCount(
        userWishlistItems.length
      );

    }
    catch (error) {

      console.error(
        "Navbar Wishlist Count Error:",
        error
      );

      setWishlistCount(0);
    }
  };


  /* ============================================================
     UPDATE BOTH COUNTS
     ============================================================ */

  const updateCounts = () => {

    fetchCartCount();

    fetchWishlistCount();

  };


  /* ============================================================
     INITIAL LOAD + LIVE COUNT UPDATE
     ============================================================ */

  useEffect(() => {

    /*
      Load counts immediately.
    */

    updateCounts();


    /*
      Your ProductCard already sends:

      cartUpdated
      wishlistUpdated

      so update immediately when those events occur.
    */

    const handleCartUpdate = () => {
      fetchCartCount();
    };


    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };


    /*
      Also listen for storage changes.
    */

    const handleStorageChange = () => {
      updateCounts();
    };


    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );


    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );


    window.addEventListener(
      "storage",
      handleStorageChange
    );

    const countInterval =
      setInterval(() => {

        fetchCartCount();

        fetchWishlistCount();

      }, 1000);


    /*
      Cleanup.
    */

    return () => {

      clearInterval(countInterval);


      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );


      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );


      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  /* ============================================================
     SEARCH
     ============================================================ */

  const handleSearch = (e) => {

    e.preventDefault();

    const value =
      searchText.trim();


    if (!value) {
      return;
    }


    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );


    setMobileMenuOpen(false);

  };


  /* ============================================================
     MOBILE MENU
     ============================================================ */

  const closeMobileMenu = () => {

    setMobileMenuOpen(false);

  };


  /* ============================================================
     JSX
     ============================================================ */

  return (

    <header className="navbar-wrapper">


      {/* =====================================================
          TOP INFORMATION BAR
      ====================================================== */}

      <div className="navbar-topbar">

        <div className="navbar-topbar-inner">

          <span>

            <FaTruck />

            Free Shipping Above ₹999

          </span>


          <span className="topbar-divider">

            |

          </span>


          <span>

            <FaShieldAlt />

            100% Genuine Products

          </span>


          <span className="topbar-divider">

            |

          </span>


          <span>

            <FaHeadset />

            24×7 Customer Support

          </span>


          <span className="topbar-divider">

            |

          </span>


          <span>

            ❤️ Made With Love for Babies

          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="navbar-main">

        <div className="navbar-main-inner">


          {/* =================================================
              LOGO
          ================================================= */}

          <NavLink
            to="/"
            className="navbar-brand"
            onClick={closeMobileMenu}
          >

            <div className="brand-logo-box">

              <img
                src="/assets/logo.png"
                alt="BabyCareMart"
                className="brand-logo"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

              <span className="brand-fallback">
                🧸
              </span>

            </div>


            <div className="brand-text">

              <h1>
                BabyCare<span>Mart</span>
              </h1>

              <p>
                Everything Your Baby Needs
              </p>

            </div>

          </NavLink>


          {/* =================================================
              SEARCH BAR
          ================================================= */}

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >

        <select
            className="category-select"
            defaultValue=""
            onChange={(e) => {
                const selectedCategory = e.target.value;

                if (!selectedCategory) {
                    navigate("/products");
                    return;
                }

                navigate(
                    `/products?category=${encodeURIComponent(
                        selectedCategory
                    )}`
                );
            }}
        >
            <option value="">
                All Categories
            </option>

            <option value="Baby Toys">
                Baby Toys
            </option>

            <option value="Baby Clothing">
                Baby Clothing
            </option>

            <option value="Feeding">
                Feeding
            </option>

            <option value="Diapers">
                Diapers
            </option>

            <option value="Baby Care">
                Baby Care
            </option>

            <option value="Bath Essentials">
                Bath Essentials
            </option>
        </select>


            <div className="search-divider"></div>


            <input
              type="text"
              placeholder="Search for baby products..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />


            <button
              type="submit"
              className="search-button"
              aria-label="Search"
            >

              <FaSearch />

            </button>

          </form>


          {/* =================================================
              RIGHT SIDE ACTIONS
          ================================================= */}

          <div className="navbar-actions">


            {/* ===============================================
                WISHLIST
            ================================================ */}

            <NavLink
              to="/wishlist"
              end
              className={({ isActive }) =>
                `navbar-action ${
                  isActive
                    ? "navbar-action-active"
                    : ""
                }`
              }
              aria-label="Wishlist"
            >

              <FaHeart />


              {/* 
                ALWAYS SHOW COUNT

                Empty:
                0

                One:
                1

                Two:
                2
              */}

              <span className="action-badge">
                {wishlistCount}
              </span>

            </NavLink>


            {/* ===============================================
                CART
            ================================================ */}

            <NavLink
              to="/cart"
              end
              className={({ isActive }) =>
                `navbar-action ${
                  isActive
                    ? "navbar-action-active"
                    : ""
                }`
              }
              aria-label="Cart"
            >

              <FaShoppingCart />


              {/* 
                ALWAYS SHOW COUNT

                Empty:
                0

                One item:
                1

                Two items:
                2

                Product quantity 2 + another
                product quantity 1:

                3
              */}

              <span className="action-badge">
                {cartCount}
              </span>

            </NavLink>


            {/* ===============================================
                PROFILE
            ================================================ */}

            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `navbar-action ${
                  isActive
                    ? "navbar-action-active"
                    : ""
                }`
              }
              aria-label="Profile"
            >

              <FaUserCircle />

            </NavLink>


            {/* ===============================================
                MOBILE MENU
            ================================================ */}

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              aria-label="Menu"
            >

              {mobileMenuOpen ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION LINKS
      ====================================================== */}

      <nav
        className={`navbar-navigation ${
          mobileMenuOpen
            ? "mobile-navigation-open"
            : ""
        }`}
      >

        <div className="navbar-navigation-inner">


          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <FaHome />

            <span>
              Home
            </span>

          </NavLink>


          <NavLink
            to="/products"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <FaBoxOpen />

            <span>
              Products
            </span>

          </NavLink>


          <NavLink
            to="/categories"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <FaThLarge />

            <span>
              Categories
            </span>

          </NavLink>


          <NavLink
            to="/new-arrivals"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link navbar-link-new ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <span className="new-arrival-icon">
              ✦
            </span>

            <span>
              New Arrivals
            </span>

          </NavLink>


          <NavLink
            to="/returns"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <FaUndoAlt />

            <span>
              Returns
            </span>

          </NavLink>


          <NavLink
            to="/support"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `navbar-link ${
                isActive
                  ? "navbar-link-active"
                  : ""
              }`
            }
          >

            <FaHeadset />

            <span>
              Support
            </span>

          </NavLink>

        </div>

      </nav>

    </header>

  );

};


export default Navbar;