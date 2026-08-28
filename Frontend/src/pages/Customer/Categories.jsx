import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";

import api from "../../services/api";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import "../../styles/Customer/Categories.css";

function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.error("Failed to load categories:", error);

            setError(
                "Unable to load categories. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleCategoryClick = (categoryName) => {

        navigate(
            `/products?category=${encodeURIComponent(categoryName)}`
        );

    };

    return (
        <>
            <Navbar />

            <main className="categories-page">

                {/* =========================================
                    HERO
                ========================================= */}

                <section className="categories-hero">

                    <div className="categories-hero-content">

                        <span className="categories-badge">
                            EXPLORE OUR COLLECTION
                        </span>

                        <h1>
                            Shop by Category
                        </h1>

                        <p>
                            Discover everything your little one needs,
                            carefully organized into categories for
                            easy shopping.
                        </p>

                    </div>

                </section>


                {/* =========================================
                    CATEGORY SECTION
                ========================================= */}

                <section className="categories-section">

                    <div className="categories-heading">

                        <div>

                            <span className="section-label">
                                BABYCARE MART
                            </span>

                            <h2>
                                Find What Your Baby Needs
                            </h2>

                            <p>
                                Choose a category and explore our
                                collection of quality baby products.
                            </p>

                        </div>

                        <div className="category-count">

                            <FaShoppingBag />

                            <span>
                                {categories.length} Categories
                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        LOADING
                    ===================================== */}

                    {loading && (

                        <div className="categories-grid">

                            {[1, 2, 3, 4, 5, 6].map((item) => (

                                <div
                                    className="category-page-skeleton"
                                    key={item}
                                >

                                    <div className="skeleton-image"></div>

                                    <div className="skeleton-content">

                                        <div className="skeleton-title"></div>

                                        <div className="skeleton-button"></div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}


                    {/* =====================================
                        ERROR
                    ===================================== */}

                    {!loading && error && (

                        <div className="categories-error">

                            <h3>
                                Something went wrong
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={fetchCategories}
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* =====================================
                        CATEGORY CARDS
                    ===================================== */}

                    {!loading &&
                        !error &&
                        categories.length > 0 && (

                            <div className="categories-grid">

                                {categories.map((category) => (

                                    <article
                                        className="category-page-card"
                                        key={category.id}
                                        onClick={() =>
                                            handleCategoryClick(
                                                category.name
                                            )
                                        }
                                    >

                                        <div className="category-page-image">

                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                loading="lazy"
                                            />

                                            <div className="category-page-overlay">

                                                <span>
                                                    Explore Category
                                                </span>

                                                <FaArrowRight />

                                            </div>

                                        </div>


                                        <div className="category-page-content">

                                            <div>

                                                <h3>
                                                    {category.name}
                                                </h3>

                                                <p>
                                                    Shop now and discover
                                                    our collection
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    handleCategoryClick(
                                                        category.name
                                                    );
                                                }}
                                            >
                                                Shop Now
                                                <FaArrowRight />
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}


                    {/* =====================================
                        EMPTY
                    ===================================== */}

                    {!loading &&
                        !error &&
                        categories.length === 0 && (

                            <div className="categories-empty">

                                <FaShoppingBag />

                                <h3>
                                    No Categories Available
                                </h3>

                                <p>
                                    Categories will appear here once
                                    they are added.
                                </p>

                            </div>

                        )}

                </section>

            </main>

            <Footer />
        </>
    );
}

export default Categories;