import { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";

import api from "../../services/api";

import "./FeaturedProducts.css";

function FeaturedProducts(){

    const [products,setProducts]=useState([]);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        fetchFeaturedProducts();

    },[]);

    const fetchFeaturedProducts=async()=>{

        try{

            const response=await api.get("/products");

            const featured=response.data
                .filter(product=>product.featured===true)
                .slice(0,8);

            setProducts(featured);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    if(loading){

        return(

            <section className="featured-products">

                <h2 className="loading-text">

                    Loading Featured Products...

                </h2>

            </section>

        );

    }

    return(

        <section className="featured-products">

            <div className="featured-header">

                <span>

                    Featured Collection

                </span>

                <h2>

                    Best Selling Baby Products

                </h2>

                <p>

                    Carefully selected premium products loved by parents.

                </p>

            </div>

            <div className="featured-grid">
                                {

                    products.map((product)=>(

                        <ProductCard

                            key={product.id}

                            product={product}

                        />

                    ))

                }

            </div>

            <div className="featured-footer">

                <button

                    className="view-all-btn"

                    onClick={() =>

                        window.location.href="/products"

                    }

                >

                    View All Products

                </button>

            </div>

        </section>

    );

}

export default FeaturedProducts;