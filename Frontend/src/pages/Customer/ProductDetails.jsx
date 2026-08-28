import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";

import api from "../../services/api";

import "../../styles/Customer/ProductDetails.css";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProduct();

    }, [id]);

    /*==========================================
                LOAD PRODUCT
    ==========================================*/

    const loadProduct = async () => {

        try {

            setLoading(true);

            const [

                productResponse,

                categoriesResponse,

                brandsResponse

            ] = await Promise.all([

                api.get(`/products/${id}`),

                api.get("/categories"),

                api.get("/brands")

            ]);

            const productData = productResponse.data;

            const categories = categoriesResponse.data;

            const brands = brandsResponse.data;

            const category = categories.find(

                item =>

                    Number(item.id) ===

                    Number(productData.categoryId)

            );

            const brand = brands.find(

                item =>

                    Number(item.id) ===

                    Number(productData.brandId)

            );

            const originalPrice =

                Number(productData.price);

            const sellingPrice =

                Number(productData.discountPrice);

            const discount =

                originalPrice > sellingPrice

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

                    :

                    0;

            setProduct({

                ...productData,

                category:

                    category

                        ?

                        category.name

                        :

                        "Unknown",

                brand:

                    brand

                        ?

                        brand.name

                        :

                        "Unknown",

                originalPrice,

                price:sellingPrice,

                discount,

                saving:

                    originalPrice -

                    sellingPrice,

                inStock:

                    productData.stock > 0

            });

        }

        catch(error){

            console.log(error);

            toast.error(

                "Unable to load product."

            );

        }

        finally{

            setLoading(false);

        }

    };

    /*==========================================
                LOADING
    ==========================================*/

    if(loading){

        return(

            <div className="loading-product">

                Loading Product...

            </div>

        );

    }

    if(!product){

        return(

            <div className="loading-product">

                Product Not Found

            </div>

        );

    }
        /*==========================================
                JSX
    ==========================================*/

    return(

        <>

            <Navbar />

            {/*==========================================
                    BREADCRUMB
            ==========================================*/}

            <section className="breadcrumb">

                <Link to="/">

                    Home

                </Link>

                <span>/</span>

                <Link to="/products">

                    Products

                </Link>

                <span>/</span>

                <span>

                    {product.category}

                </span>

                <span>/</span>

                <strong>

                    {product.name}

                </strong>

            </section>

            {/*==========================================
                    PRODUCT DETAILS
            ==========================================*/}

            <section className="product-details-container">

                <ProductGallery

                    images={product.images}

                    name={product.name}

                />

                <ProductInfo

                    product={product}

                />

            </section>

            {/*==========================================
                    PRODUCT DESCRIPTION
            ==========================================*/}

            <section className="product-description">

                <h2>

                    Product Description

                </h2>

                <p>

                    {

                        product.description ||

                        "No description available."

                    }

                </p>

            </section>

            {/*==========================================
                    SPECIFICATIONS
            ==========================================*/}

            <section className="product-specifications">

                <h2>

                    Product Specifications

                </h2>

                <div className="specifications-grid">

                    <div className="spec-item">

                        <span>

                            Brand

                        </span>

                        <strong>

                            {product.brand}

                        </strong>

                    </div>

                    <div className="spec-item">

                        <span>

                            Category

                        </span>

                        <strong>

                            {product.category}

                        </strong>

                    </div>

                    <div className="spec-item">

                        <span>

                            Rating

                        </span>

                        <strong>

                            {product.rating} ★

                        </strong>

                    </div>

                    <div className="spec-item">

                        <span>

                            Reviews

                        </span>

                        <strong>

                            {product.reviewCount}

                        </strong>

                    </div>

                    <div className="spec-item">

                        <span>

                            Discount

                        </span>

                        <strong>

                            {product.discount}%

                        </strong>

                    </div>

                    <div className="spec-item">

                        <span>

                            Availability

                        </span>

                        <strong>

                            {

                                product.inStock

                                ?

                                `In Stock (${product.stock})`

                                :

                                "Out Of Stock"

                            }

                        </strong>

                    </div>

                </div>

            </section>
                        {/*==========================================
                    DELIVERY INFORMATION
            ==========================================*/}

            <section className="delivery-information">

                <h2>

                    Delivery Information

                </h2>

                <div className="delivery-grid">

                    <div className="delivery-card">

                        <h3>

                            🚚 Fast Delivery

                        </h3>

                        <p>

                            Orders placed before 6 PM are dispatched on the

                            same day. Delivery usually takes 2–5 business days.

                        </p>

                    </div>

                    <div className="delivery-card">

                        <h3>

                            💳 Secure Payments

                        </h3>

                        <p>

                            Pay securely using UPI, Credit Card, Debit Card,

                            Net Banking or Cash on Delivery.

                        </p>

                    </div>

                    <div className="delivery-card">

                        <h3>

                            🔄 Easy Returns

                        </h3>

                        <p>

                            Eligible products can be returned or exchanged

                            within 7 days from the delivery date.

                        </p>

                    </div>

                    <div className="delivery-card">

                        <h3>

                            🛡️ Genuine Products

                        </h3>

                        <p>

                            Every product sold on BabyCareMart is sourced

                            directly from trusted brands and verified sellers.

                        </p>

                    </div>

                </div>

            </section>

            {/*==========================================
                    PRODUCT FEATURES
            ==========================================*/}

            <section className="product-features">

                <h2>

                    Product Highlights

                </h2>

                <ul>

                    <li>

                        Premium quality materials

                    </li>

                    <li>

                        100% Baby Safe & Non-Toxic

                    </li>

                    <li>

                        Trusted by thousands of parents

                    </li>

                    <li>

                        Comfortable, durable and lightweight

                    </li>

                    <li>

                        Carefully quality tested before shipping

                    </li>

                </ul>

            </section>

            {/*==========================================
                    SAFETY INFORMATION
            ==========================================*/}

            <section className="safety-information">

                <h2>

                    Safety Information

                </h2>

                <p>

                    Adult supervision is recommended while using this product.

                    Always inspect the product before every use and discontinue

                    use if any damage or loose parts are noticed. Keep the

                    product clean and store it in a cool, dry place away from

                    direct sunlight.

                </p>

            </section>

            {/*==========================================
                    RELATED PRODUCTS
            ==========================================*/}

            <RelatedProducts

                product={product}

            />
                        {/*==========================================
                    FOOTER
            ==========================================*/}

            <Footer />

        </>

    );

}

export default ProductDetails;