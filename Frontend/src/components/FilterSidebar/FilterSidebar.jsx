import "./FilterSidebar.css";

function FilterSidebar({

    categories = [],

    brands = [],

    filters,

    setFilters,

    clearFilters

}) {

    const handleCategory = (category) => {

        setFilters({

            ...filters,

            category

        });

    };

    const handleBrand = (brand) => {

        setFilters({

            ...filters,

            brand

        });

    };

    const handlePrice = (priceRange) => {

        setFilters({

            ...filters,

            price: priceRange

        });

    };

    const handleRating = (rating) => {

        setFilters({

            ...filters,

            rating

        });

    };

    const handleAvailability = (availability) => {

        setFilters({

            ...filters,

            availability

        });

    };

    return (

        <aside className="filter-sidebar">

            <div className="filter-header">

                <h3>

                    Filters

                </h3>

                <button

                    className="clear-filter-btn"

                    onClick={clearFilters}

                >

                    Clear All

                </button>

            </div>

            {/* Category Filter */}

            <div className="filter-section">

                <h4>

                    Category

                </h4>

                {

                    categories.map((category) => (

                        <label

                            key={category}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="category"

                                checked={

                                    filters.category === category

                                }

                                onChange={() =>

                                    handleCategory(category)

                                }

                            />

                            <span>

                                {category}

                            </span>

                        </label>

                    ))

                }

            </div>

            {/* Brand Filter */}

            <div className="filter-section">

                <h4>

                    Brand

                </h4>

                {

                    brands.map((brand) => (

                        <label

                            key={brand}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="brand"

                                checked={

                                    filters.brand === brand

                                }

                                onChange={() =>

                                    handleBrand(brand)

                                }

                            />

                            <span>

                                {brand}

                            </span>

                        </label>

                    ))

                }

            </div>
                        {/* Price Filter */}

            <div className="filter-section">

                <h4>

                    Price

                </h4>

                {

                    [

                        "0-500",

                        "500-1000",

                        "1000-3000",

                        "3000+"

                    ].map((price) => (

                        <label

                            key={price}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="price"

                                checked={

                                    filters.price === price

                                }

                                onChange={() =>

                                    handlePrice(price)

                                }

                            />

                            <span>

                                ₹ {price}

                            </span>

                        </label>

                    ))

                }

            </div>

            {/* Rating Filter */}

            <div className="filter-section">

                <h4>

                    Rating

                </h4>

                {

                    [5, 4, 3, 2, 1].map((rating) => (

                        <label

                            key={rating}

                            className="filter-option"

                        >

                            <input

                                type="radio"

                                name="rating"

                                checked={

                                    filters.rating === rating

                                }

                                onChange={() =>

                                    handleRating(rating)

                                }

                            />

                            <span>

                                {rating} ★ & Above

                            </span>

                        </label>

                    ))

                }

            </div>

            {/* Availability Filter */}

            <div className="filter-section">

                <h4>

                    Availability

                </h4>

                <label className="filter-option">

                    <input

                        type="radio"

                        name="availability"

                        checked={

                            filters.availability === "In Stock"

                        }

                        onChange={() =>

                            handleAvailability("In Stock")

                        }

                    />

                    <span>

                        In Stock

                    </span>

                </label>

                <label className="filter-option">

                    <input

                        type="radio"

                        name="availability"

                        checked={

                            filters.availability === "Out of Stock"

                        }

                        onChange={() =>

                            handleAvailability("Out of Stock")

                        }

                    />

                    <span>

                        Out of Stock

                    </span>

                </label>

            </div>

        </aside>

    );

}

export default FilterSidebar;