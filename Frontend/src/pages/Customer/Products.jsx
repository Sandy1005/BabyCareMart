import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import { toast } from "react-toastify";

import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import ProductCard from "../../components/ProductCard/ProductCard";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/Products.css";


function Products() {


    /* =========================================================
                        URL PARAMETERS
    ========================================================= */

    const [searchParams] = useSearchParams();


    /* =========================================================
                            STATES
    ========================================================= */

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [brands, setBrands] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    /* =========================================================
                        SEARCH STATE
    ========================================================= */

    const [search, setSearch] =
        useState(
            searchParams.get("search") || ""
        );


    /* =========================================================
                        FILTER STATES
    ========================================================= */

    const [filters, setFilters] =
        useState({

            category:
                searchParams.get("category") || "",

            brand: "",

            price: "",

            rating: "",

            availability: ""

        });


    /* =========================================================
                        LOAD DATA
    ========================================================= */

    useEffect(() => {

        loadData();

    }, []);


    /* =========================================================
                SYNC URL WITH SEARCH / CATEGORY
    ========================================================= */

    useEffect(() => {

        const urlSearch =
            searchParams.get("search") || "";


        const urlCategory =
            searchParams.get("category") || "";


        setSearch(urlSearch);


        setFilters((previousFilters) => ({

            ...previousFilters,

            category: urlCategory

        }));

    }, [searchParams]);


    /* =========================================================
                        API CALL
    ========================================================= */

    const loadData = async () => {

        try {

            setLoading(true);


            const [
                productsResponse,
                categoriesResponse,
                brandsResponse
            ] = await Promise.all([

                api.get("/products"),

                api.get("/categories"),

                api.get("/brands")

            ]);


            const productsData =
                Array.isArray(
                    productsResponse.data
                )
                    ? productsResponse.data
                    : [];


            const categoriesData =
                Array.isArray(
                    categoriesResponse.data
                )
                    ? categoriesResponse.data
                    : [];


            const brandsData =
                Array.isArray(
                    brandsResponse.data
                )
                    ? brandsResponse.data
                    : [];


            /* =================================================
                        FORMAT PRODUCTS
            ================================================= */

            const updatedProducts =
                productsData.map((product) => {


                    /* -------------------------------
                            CATEGORY
                    -------------------------------- */

                    const category =
                        categoriesData.find(

                            (item) =>

                                Number(item.id) ===
                                Number(product.categoryId)

                        );


                    /* -------------------------------
                                BRAND
                    -------------------------------- */

                    const brand =
                        brandsData.find(

                            (item) =>

                                Number(item.id) ===
                                Number(product.brandId)

                        );


                    /* -------------------------------
                            PRICES
                    -------------------------------- */

                    const originalPrice =
                        Number(product.price) || 0;


                    const discountPrice =
                        Number(
                            product.discountPrice
                        );


                    const sellingPrice =

                        Number.isFinite(
                            discountPrice
                        ) &&
                        discountPrice > 0

                            ? discountPrice

                            : originalPrice;


                    /* -------------------------------
                            DISCOUNT
                    -------------------------------- */

                    const discount =

                        originalPrice > sellingPrice &&
                        originalPrice > 0

                            ?

                            Math.round(

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


                    /* -------------------------------
                            STOCK
                    -------------------------------- */

                    const stock =
                        Number(product.stock) || 0;


                    /* -------------------------------
                        RETURN PRODUCT
                    -------------------------------- */

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

                        price:
                            sellingPrice,

                        discount,

                        stock,

                        inStock:
                            stock > 0

                    };

                });


            setProducts(
                updatedProducts
            );


            setCategories(
                categoriesData
            );


            setBrands(
                brandsData
            );

        }

        catch (error) {

            console.error(
                "Products Fetch Error:",
                error
            );


            toast.error(
                "Unable to load products."
            );


            setProducts([]);

            setCategories([]);

            setBrands([]);

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
                    CATEGORY FILTER OPTIONS
    ========================================================= */

    const categoryList = useMemo(() => {

        return [

            ...new Set(

                products
                    .map(
                        (product) =>
                            product.category
                    )
                    .filter(Boolean)

            )

        ];

    }, [products]);


    /* =========================================================
                        BRAND OPTIONS
    ========================================================= */

    const brandList = useMemo(() => {

        return [

            ...new Set(

                products
                    .map(
                        (product) =>
                            product.brand
                    )
                    .filter(Boolean)

            )

        ];

    }, [products]);


    /* =========================================================
                        CLEAR FILTERS
    ========================================================= */

    const clearFilters = () => {

        setSearch("");


        setFilters({

            category: "",

            brand: "",

            price: "",

            rating: "",

            availability: ""

        });

    };


    /* =========================================================
                        FILTER PRODUCTS
    ========================================================= */

    const filteredProducts =
        useMemo(() => {

            return products.filter(
                (product) => {


                    /* ==========================================
                                SEARCH
                    ========================================== */

                    const searchValue =
                        search
                            .trim()
                            .toLowerCase();


                    const matchesSearch =

                        !searchValue

                        ||

                        product.name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        product.brand
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        product.category
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );


                    /* ==========================================
                                CATEGORY
                    ========================================== */

                    const matchesCategory =

                        !filters.category

                        ||

                        product.category ===
                        filters.category;


                    /* ==========================================
                                BRAND
                    ========================================== */

                    const matchesBrand =

                        !filters.brand

                        ||

                        product.brand ===
                        filters.brand;


                    /* ==========================================
                                PRICE
                    ========================================== */

                    let matchesPrice = true;


                    if (
                        filters.price ===
                        "0-500"
                    ) {

                        matchesPrice =

                            product.price >= 0 &&

                            product.price <= 500;

                    }


                    else if (
                        filters.price ===
                        "500-1000"
                    ) {

                        matchesPrice =

                            product.price > 500 &&

                            product.price <= 1000;

                    }


                    else if (
                        filters.price ===
                        "1000-3000"
                    ) {

                        matchesPrice =

                            product.price > 1000 &&

                            product.price <= 3000;

                    }


                    else if (
                        filters.price ===
                        "3000+"
                    ) {

                        matchesPrice =
                            product.price > 3000;

                    }


                    /* ==========================================
                                RATING
                    ========================================== */

                    const matchesRating =

                        !filters.rating

                        ||

                        Number(product.rating || 0) >=
                        Number(filters.rating);


                    /* ==========================================
                            AVAILABILITY
                    ========================================== */

                    let matchesAvailability =
                        true;


                    if (
                        filters.availability ===
                        "In Stock"
                    ) {

                        matchesAvailability =
                            product.stock > 0;

                    }


                    else if (
                        filters.availability ===
                        "Out of Stock"
                    ) {

                        matchesAvailability =
                            product.stock === 0;

                    }


                    /* ==========================================
                                FINAL RESULT
                    ========================================== */

                    return (

                        matchesSearch &&

                        matchesCategory &&

                        matchesBrand &&

                        matchesPrice &&

                        matchesRating &&

                        matchesAvailability

                    );

                }

            );

        }, [

            products,

            search,

            filters

        ]);


    /* =========================================================
                            LOADING
    ========================================================= */

    if (loading) {

        return (

            <>

                <Navbar />


                <main className="products-page">

                    <div className="products-loading">

                        <h2>
                            Loading Products...
                        </h2>

                        <p>
                            Please wait while we load
                            our products.
                        </p>

                    </div>

                </main>


                <Footer />

            </>

        );

    }


    /* =========================================================
                            PAGE JSX
    ========================================================= */

    return (

        <>

            {/* =================================================
                            NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                        PRODUCTS PAGE
            ================================================= */}

            <main className="products-page">


                {/* =================================================
                            PAGE HEADER
                ================================================= */}

                <div className="products-header">

                    <div>

                        <h2>
                            Our Products
                        </h2>

                        <p>

                            Showing{" "}

                            <strong>
                                {filteredProducts.length}
                            </strong>

                            {" "}Products

                        </p>

                    </div>

                </div>


                {/* =================================================
                            SEARCH BAR
                ================================================= */}

                <div className="products-topbar">

                    <SearchBar

                        search={search}

                        setSearch={setSearch}

                        placeholder={
                            "Search products, brands..."
                        }

                    />

                </div>


                {/* =================================================
                            PRODUCTS LAYOUT
                ================================================= */}

                <div className="products-layout">


                    {/* =================================================
                                FILTER SIDEBAR
                    ================================================= */}

                    <FilterSidebar

                        categories={
                            categoryList
                        }

                        brands={
                            brandList
                        }

                        filters={
                            filters
                        }

                        setFilters={
                            setFilters
                        }

                        clearFilters={
                            clearFilters
                        }

                    />


                    {/* =================================================
                                PRODUCTS CONTENT
                    ================================================= */}

                    <div className="products-content">


                        {

                            filteredProducts.length === 0

                                ?

                                (

                                    <div className="no-products">

                                        <h3>
                                            No Products Found
                                        </h3>

                                        <p>
                                            Try changing your
                                            search or filters.
                                        </p>


                                        <button

                                            type="button"

                                            className="reset-filters-btn"

                                            onClick={
                                                clearFilters
                                            }

                                        >

                                            Reset Filters

                                        </button>

                                    </div>

                                )

                                :

                                (

                                    <div className="products-grid">

                                        {

                                            filteredProducts.map(
                                                (product) => (

                                                    <ProductCard

                                                        key={
                                                            product.id
                                                        }

                                                        product={
                                                            product
                                                        }

                                                    />

                                                )
                                            )

                                        }

                                    </div>

                                )

                        }


                    </div>


                </div>


            </main>


            {/* =================================================
                            FOOTER
            ================================================= */}

            <Footer />

        </>

    );

}


export default Products;