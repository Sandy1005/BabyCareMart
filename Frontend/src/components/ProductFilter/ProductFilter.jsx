import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ProductFilter.css";

function ProductFilter({

    selectedCategory,
    setSelectedCategory,

    selectedBrand,
    setSelectedBrand,

    selectedPrice,
    setSelectedPrice,

    selectedRating,
    setSelectedRating,

    inStock,
    setInStock

}){

    const [categories,setCategories]=useState([]);

    const [brands,setBrands]=useState([]);

    useEffect(()=>{

        fetchCategories();

        fetchBrands();

    },[]);

    const fetchCategories=async()=>{

        try{

            const response=await api.get("/categories");

            setCategories(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    const fetchBrands=async()=>{

        try{

            const response=await api.get("/brands");

            setBrands(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div className="product-filter">

            <h2>

                Filters

            </h2>
                        {/*==========================
                    CATEGORY
            ===========================*/}

            <div className="filter-section">

                <h3>

                    Category

                </h3>

                {

                    categories.map((category)=>(

                        <label

                            key={category.id}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="category"

                                checked={
                                    selectedCategory === category.name
                                }

                                onChange={()=>

                                    setSelectedCategory(category.name)

                                }

                            />

                            <span>

                                {category.name}

                            </span>

                        </label>

                    ))

                }

                <button

                    className="clear-btn"

                    onClick={()=>

                        setSelectedCategory("")

                    }

                >

                    Clear Category

                </button>

            </div>

            {/*==========================
                    BRAND
            ===========================*/}

            <div className="filter-section">

                <h3>

                    Brand

                </h3>

                {

                    brands.map((brand)=>(

                        <label

                            key={brand.id}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="brand"

                                checked={
                                    selectedBrand === brand.name
                                }

                                onChange={()=>

                                    setSelectedBrand(brand.name)

                                }

                            />

                            <span>

                                {brand.name}

                            </span>

                        </label>

                    ))

                }

                <button

                    className="clear-btn"

                    onClick={()=>

                        setSelectedBrand("")

                    }

                >

                    Clear Brand

                </button>

            </div>
                        {/*==========================
                    PRICE RANGE
            ==========================*/}

            <div className="filter-section">

                <h3>

                    Price Range

                </h3>

                <label className="filter-option">

                    <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === "0-500"}
                        onChange={() => setSelectedPrice("0-500")}
                    />

                    <span>

                        ₹0 - ₹500

                    </span>

                </label>

                <label className="filter-option">

                    <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === "500-1000"}
                        onChange={() => setSelectedPrice("500-1000")}
                    />

                    <span>

                        ₹500 - ₹1000

                    </span>

                </label>

                <label className="filter-option">

                    <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === "1000+"}
                        onChange={() => setSelectedPrice("1000+")}
                    />

                    <span>

                        Above ₹1000

                    </span>

                </label>

                <button

                    className="clear-btn"

                    onClick={() => setSelectedPrice("")}

                >

                    Clear Price

                </button>

            </div>

            {/*==========================
                    RATING
            ==========================*/}

            <div className="filter-section">

                <h3>

                    Rating

                </h3>

                <label className="filter-option">

                    <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === 4}
                        onChange={() => setSelectedRating(4)}
                    />

                    <span>

                        ⭐ 4 & Above

                    </span>

                </label>

                <label className="filter-option">

                    <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === 3}
                        onChange={() => setSelectedRating(3)}
                    />

                    <span>

                        ⭐ 3 & Above

                    </span>

                </label>

                <button

                    className="clear-btn"

                    onClick={() => setSelectedRating("")}

                >

                    Clear Rating

                </button>

            </div>

            {/*==========================
                    AVAILABILITY
            ==========================*/}

            <div className="filter-section">

                <h3>

                    Availability

                </h3>

                <label className="filter-option">

                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) =>
                            setInStock(e.target.checked)
                        }
                    />

                    <span>

                        In Stock Only

                    </span>

                </label>

            </div>

        </div>

    );

}

export default ProductFilter;