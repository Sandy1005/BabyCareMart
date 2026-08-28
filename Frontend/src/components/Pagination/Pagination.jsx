import "./Pagination.css";

function Pagination({

    currentPage,

    totalPages,

    setCurrentPage

}){

    const changePage=(page)=>{

        if(page>=1 && page<=totalPages){

            setCurrentPage(page);

        }

    };

    return(

        <div className="pagination">            <button

                onClick={()=>changePage(currentPage-1)}

                disabled={currentPage===1}

            >

                Previous

            </button>

            {

                [...Array(totalPages)].map((_,index)=>(

                    <button

                        key={index}

                        className={
                            currentPage===index+1
                            ? "active-page"
                            : ""
                        }

                        onClick={()=>changePage(index+1)}

                    >

                        {index+1}

                    </button>

                ))

            }

            <button

                onClick={()=>changePage(currentPage+1)}

                disabled={currentPage===totalPages}

            >

                Next

            </button>

        </div>

    );

}

export default Pagination;