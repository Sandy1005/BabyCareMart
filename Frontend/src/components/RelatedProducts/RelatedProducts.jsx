import { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";

import api from "../../services/api";

import "./RelatedProducts.css";

function RelatedProducts({

    product

}){

    const [relatedProducts,setRelatedProducts]=useState([]);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        fetchRelatedProducts();

    },[product]);

    const fetchRelatedProducts=async()=>{

        try{

            const response=await api.get("/products");

            const related=response.data.filter(item=>

                item.category===product.category

                &&

                item.id!==product.id

            ).slice(0,4);

            setRelatedProducts(related);

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

            <section className="related-products">

                <h2>

                    Loading Related Products...

                </h2>

            </section>

        );

    }

    return(

        <section className="related-products">

            <div className="related-header">

                <h2>

                    Related Products

                </h2>

                <p>

                    Parents also loved these products.

                </p>

            </div>

            <div className="related-grid">                {

                    relatedProducts.length > 0 ? (

                        relatedProducts.map((item) => (

                            <ProductCard

                                key={item.id}

                                product={item}

                            />

                        ))

                    ) : (

                        <div className="no-related-products">

                            <h3>

                                No Related Products Found

                            </h3>

                            <p>

                                There are currently no products available in this category.

                            </p>

                        </div>

                    )

                }

            </div>

        </section>

    );

}

export default RelatedProducts;