import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import ProductCard from "../../components/ProductCard/ProductCard";

import api from "../../services/api";

import "../../styles/Customer/CategoryProducts.css";


function CategoryProducts() {

    const { categorySlug } = useParams();


    /* =====================================================
                        STATES
    ===================================================== */

    const [products, setProducts] = useState([]);

    const [category, setCategory] = useState(null);

    const [loading, setLoading] = useState(true);


    /* =====================================================
                    CATEGORY SLUG
    ===================================================== */

    const slugToName = {

        "baby-toys": "Baby Toys",

        "baby-clothing": "Baby Clothing",

        "feeding": "Feeding",

        "diapers": "Diapers",

        "baby-care": "Baby Care",

        "bath-essentials": "Bath Essentials"

    };


    /* =====================================================
                        LOAD DATA
    ===================================================== */

    useEffect(() => {

        loadCategoryProducts();

    }, [categorySlug]);


    const loadCategoryProducts = async () => {

        try {

            setLoading(true);


            const [
                productsResponse,
                categoriesResponse
            ] = await Promise.all([

                api.get("/products"),

                api.get("/categories")

            ]);


            const categoryName =
                slugToName[categorySlug];


            const selectedCategory =
                categoriesResponse.data.find(
                    item =>
                        item.name === categoryName
                );


            if (!selectedCategory) {

                setCategory(null);

                setProducts([]);

                return;

            }


            setCategory(selectedCategory);


            const categoryProducts =
                productsResponse.data
                    .filter(
                        product =>
                            Number(product.categoryId) ===
                            Number(selectedCategory.id)
                    )
                    .map(product => ({

                        ...product,

                        originalPrice:
                            Number(product.price),

                        price:
                            Number(
                                product.discountPrice ??
                                product.price
                            ),

                        discount:
                            Number(product.price) >
                            Number(
                                product.discountPrice ??
                                product.price
                            )
                                ? Math.round(
                                    (
                                        (
                                            Number(product.price) -
                                            Number(
                                                product.discountPrice ??
                                                product.price
                                            )
                                        )
                                        /
                                        Number(product.price)
                                    ) * 100
                                )
                                : 0,

                        category:
                            selectedCategory.name,

                        inStock:
                            Number(product.stock) > 0

                    }));


            setProducts(categoryProducts);

        }

        catch (error) {

            console.log(
                "Category Products Error:",
                error
            );

            toast.error(
                "Unable to load category products."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =====================================================
                        PAGE TITLE
    ===================================================== */

    const categoryName =
        category?.name ||
        slugToName[categorySlug] ||
        "Category";


    /* =====================================================
                        NOT FOUND
    ===================================================== */

    if (!loading && !category) {

        return (

            <>

                <Navbar />

                <main className="category-products-page">

                    <div className="category-not-found">

                        <h1>
                            Category Not Found
                        </h1>

                        <p>
                            The requested category does not exist.
                        </p>

                        <Link
                            to="/categories"
                            className="category-back-btn"
                        >
                            Back To Categories
                        </Link>

                    </div>

                </main>

                <Footer />

            </>

        );

    }


    /* =====================================================
                        LOADING
    ===================================================== */

    if (loading) {

        return (

            <>

                <Navbar />

                <main className="category-products-page">

                    <div className="category-loading">

                        Loading {categoryName}...

                    </div>

                </main>

                <Footer />

            </>

        );

    }


    /* =====================================================
                        JSX
    ===================================================== */

    return (

        <>

            <Navbar />


            <main className="category-products-page">

                {/* =================================================
                            BREADCRUMB
                ================================================= */}

                <div className="category-breadcrumb">

                    <Link to="/home">
                        Home
                    </Link>

                    <span>
                        /
                    </span>

                    <Link to="/categories">
                        Categories
                    </Link>

                    <span>
                        /
                    </span>

                    <strong>
                        {categoryName}
                    </strong>

                </div>


                {/* =================================================
                            HEADER
                ================================================= */}

                <section className="category-products-header">

                    <div>

                        <span className="category-label">
                            BABYCARE MART
                        </span>

                        <h1>
                            {categoryName}
                        </h1>

                        <p>
                            Explore our collection of
                            quality {categoryName.toLowerCase()}
                            for your little one.
                        </p>

                    </div>


                    <div className="category-count">

                        <strong>
                            {products.length}
                        </strong>

                        <span>
                            Products
                        </span>

                    </div>

                </section>


                {/* =================================================
                            PRODUCTS
                ================================================= */}

                {

                    products.length === 0

                        ?

                        (

                            <div className="category-empty">

                                <h2>
                                    No Products Found
                                </h2>

                                <p>
                                    There are currently no products
                                    available in this category.
                                </p>

                                <Link
                                    to="/products"
                                    className="category-back-btn"
                                >
                                    Browse All Products
                                </Link>

                            </div>

                        )

                        :

                        (

                            <section className="category-products-grid">

                                {

                                    products.map(product => (

                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />

                                    ))

                                }

                            </section>

                        )

                }

            </main>


            <Footer />

        </>

    );

}


export default CategoryProducts;