import { FaSearch, FaTimes } from "react-icons/fa";

import "./SearchBar.css";

function SearchBar({

    search,

    setSearch,

    placeholder = "Search products..."

}) {

    const handleClear = () => {

        setSearch("");

    };

    return (

        <div className="searchbar-container">

            <FaSearch className="search-icon" />

            <input

                type="text"

                className="search-input"

                placeholder={placeholder}

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

            />

            {

                search && (

                    <button

                        className="clear-search-btn"

                        onClick={handleClear}

                    >

                        <FaTimes />

                    </button>

                )

            }

        </div>

    );

}

export default SearchBar;