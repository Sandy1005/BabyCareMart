import "./ProductSearch.css";

function ProductSearch({

    searchTerm,

    setSearchTerm

}) {

    return (

        <div className="product-search">

            <input

                type="text"

                placeholder="Search products, brands, categories..."

                value={searchTerm}

                onChange={(e) =>

                    setSearchTerm(e.target.value)

                }

                className="search-input"

            />

        </div>

    );

}

export default ProductSearch;