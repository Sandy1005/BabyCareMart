import "./ProductSort.css";

function ProductSort({

    sortOption,

    setSortOption

}){

    return(

        <div className="product-sort">

            <label>

                Sort By

            </label>

            <select

                value={sortOption}

                onChange={(e)=>

                    setSortOption(e.target.value)

                }

                className="sort-select"

            >

                <option value="default">

                    Default

                </option>

                <option value="priceLow">

                    Price : Low to High

                </option>

                <option value="priceHigh">

                    Price : High to Low

                </option>

                <option value="rating">

                    Highest Rating

                </option>

                <option value="newest">

                    Newest

                </option>

                <option value="nameAZ">

                    Name (A-Z)

                </option>

                <option value="nameZA">

                    Name (Z-A)

                </option>

            </select>

        </div>

    );

}

export default ProductSort;