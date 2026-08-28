import { useEffect, useState } from "react";

import { FaArrowRight, FaBolt } from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

import api from "../../services/api";

import "../../styles/Customer/NewArrivals.css";


function NewArrivals() {

    /* =========================================================
                        STATES
    ========================================================= */

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);


    /* =========================================================
                    LOAD NEW ARRIVALS
    ========================================================= */

    useEffect(() => {

        fetchNewArrivals();

    }, []);


    /* =========================================================
                    FETCH PRODUCTS
    ========================================================= */

    const fetchNewArrivals = async () => {

        try {

            setLoading(true);

            setError(false);


            /*
                Load products, categories and brands
                exactly like the existing Products page.
            */

            const [
                productsResponse,
                categoriesResponse,
                brandsResponse
            ] = await Promise.all([

                api.get("/products"),

                api.get("/categories"),

                api.get("/brands")

            ]);


            const categories =
                categoriesResponse.data || [];


            const brands =
                brandsResponse.data || [];


            /*
                Convert API product data into the
                same structure used by ProductCard.
            */

            const updatedProducts =
                (productsResponse.data || []).map(
                    (product) => {

                        const category =
                            categories.find(
                                (item) =>
                                    Number(item.id) ===
                                    Number(product.categoryId)
                            );


                        const brand =
                            brands.find(
                                (item) =>
                                    Number(item.id) ===
                                    Number(product.brandId)
                            );


                        const originalPrice =
                            Number(product.price || 0);


                        const sellingPrice =
                            Number(
                                product.discountPrice ??
                                product.price ??
                                0
                            );


                        const discount =
                            originalPrice > sellingPrice
                                ? Math.round(
                                    (
                                        (
                                            originalPrice -
                                            sellingPrice
                                        )
                                        /
                                        originalPrice
                                    ) * 100
                                )
                                : 0;


                        return {

                            ...product,

                            category:
                                category
                                    ? category.name
                                    : "Unknown",


                            brand:
                                brand
                                    ? brand.name
                                    : "Unknown",


                            originalPrice,

                            price: sellingPrice,

                            discount,

                            inStock:
                                Number(
                                    product.stock || 0
                                ) > 0

                        };

                    }
                );


            /*
                NEW ARRIVALS LOGIC

                Your existing Products page uses
                descending ID for "newest".

                Therefore we use the same logic here.

                Highest ID = newest product.
            */

            const newestProducts =
                updatedProducts
                    .sort(
                        (a, b) =>
                            Number(b.id) -
                            Number(a.id)
                    )
                    .slice(0, 12);


            setProducts(newestProducts);

        }

        catch (error) {

            console.error(
                "New Arrivals Error:",
                error
            );

            setError(true);

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
                        LOADING
    ========================================================= */

    if (loading) {

        return (

            <>

                <Navbar />

                <main className="new-arrivals-page">

                    <section className="new-arrivals-loading">

                        <div className="loading-spinner"></div>

                        <h2>
                            Loading New Arrivals...
                        </h2>

                        <p>
                            Discover the latest products
                            for your little one.
                        </p>

                    </section>

                </main>

                <Footer />

            </>

        );

    }


    /* =========================================================
                        ERROR
    ========================================================= */

    if (error) {

        return (

            <>

                <Navbar />

                <main className="new-arrivals-page">

                    <section className="new-arrivals-error">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Unable to Load New Arrivals
                        </h2>

                        <p>
                            Something went wrong while
                            loading the latest products.
                        </p>

                        <button
                            onClick={fetchNewArrivals}
                            className="retry-btn"
                        >
                            Try Again
                        </button>

                    </section>

                </main>

                <Footer />

            </>

        );

    }


    /* =========================================================
                            JSX
    ========================================================= */

    return (

        <>

            {/* =================================================
                                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                        NEW ARRIVALS PAGE
            ================================================= */}

            <main className="new-arrivals-page">


                {/* =================================================
                            HERO SECTION
                ================================================= */}

                <section className="new-arrivals-hero">

                    <div className="hero-content">

                        <span className="hero-label">

                            <FaBolt />

                            JUST LANDED

                        </span>


                        <h1>

                            New Arrivals

                            <span>
                                for Your Little One
                            </span>

                        </h1>


                        <p>

                            Discover the latest baby products,
                            carefully selected for comfort,
                            quality and everyday happiness.

                        </p>


                        <div className="hero-stats">

                            <div>

                                <strong>
                                    {products.length}+
                                </strong>

                                <span>
                                    Latest Products
                                </span>

                            </div>


                            <div>

                                <strong>
                                    100%
                                </strong>

                                <span>
                                    Quality Focused
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Fresh
                                </strong>

                                <span>
                                    New Collection
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="hero-decoration">

                        <div className="floating-circle circle-one"></div>

                        <div className="floating-circle circle-two"></div>

                        <div className="floating-circle circle-three"></div>

                        <div className="hero-badge">

                            <FaBolt />

                            Fresh Picks

                        </div>

                    </div>

                </section>


                {/* =================================================
                            SECTION HEADER
                ================================================= */}

                <section className="new-arrivals-section">

                    <div className="new-arrivals-header">

                        <div>

                            <span className="section-label">
                                EXPLORE THE LATEST
                            </span>

                            <h2>
                                Freshly Added Products
                            </h2>

                            <p>
                                Shop the newest additions
                                to BabyCareMart.
                            </p>

                        </div>


                        <div className="product-count">

                            <strong>
                                {products.length}
                            </strong>

                            <span>
                                New Products
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                            PRODUCT GRID
                    ================================================= */}

                    {
                        products.length === 0

                            ?

                            (

                                <div className="empty-new-arrivals">

                                    <h3>
                                        No New Arrivals Found
                                    </h3>

                                    <p>
                                        New products will appear
                                        here when they are added.
                                    </p>

                                </div>

                            )

                            :

                            (

                                <div className="new-arrivals-grid">

                                    {
                                        products.map(
                                            (product) => (

                                                <div
                                                    key={product.id}
                                                    className="new-arrival-product"
                                                >

                                                    <div className="new-product-tag">

                                                        <FaBolt />

                                                        NEW

                                                    </div>


                                                    <ProductCard
                                                        product={
                                                            product
                                                        }
                                                    />

                                                </div>

                                            )
                                        )
                                    }

                                </div>

                            )
                    }

                </section>


                {/* =================================================
                        BOTTOM CTA
                ================================================= */}

                <section className="new-arrivals-cta">

                    <div>

                        <span>
                            KEEP DISCOVERING
                        </span>

                        <h2>
                            Find More Baby Essentials
                        </h2>

                        <p>
                            Explore our complete collection
                            of baby products.
                        </p>

                    </div>


                    <a
                        href="/products"
                        className="browse-products-btn"
                    >

                        Browse All Products

                        <FaArrowRight />

                    </a>

                </section>

            </main>


            {/* =================================================
                                FOOTER
            ================================================= */}

            <Footer />

        </>

    );

}


export default NewArrivals;