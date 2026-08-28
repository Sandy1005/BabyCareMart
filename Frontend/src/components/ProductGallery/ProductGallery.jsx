import { useState, useEffect } from "react";

import {

    FaChevronLeft,

    FaChevronRight,

    FaSearchPlus,

    FaTimes

} from "react-icons/fa";

import "./ProductGallery.css";

function ProductGallery({

    images = [],

    name

}) {

    /*==========================================
                STATES
    ==========================================*/

    const [

        activeImage,

        setActiveImage

    ] = useState(0);

    const [

        showPreview,

        setShowPreview

    ] = useState(false);

    /*==========================================
                RESET IMAGE
    ==========================================*/

    useEffect(() => {

        setActiveImage(0);

    }, [images]);

    /*==========================================
                PREVIOUS IMAGE
    ==========================================*/

    const previousImage = () => {

        setActiveImage((previous) =>

            previous === 0

                ?

                images.length - 1

                :

                previous - 1

        );

    };

    /*==========================================
                NEXT IMAGE
    ==========================================*/

    const nextImage = () => {

        setActiveImage((previous) =>

            previous === images.length - 1

                ?

                0

                :

                previous + 1

        );

    };

    /*==========================================
                IMAGE SELECT
    ==========================================*/

    const selectImage = (index) => {

        setActiveImage(index);

    };
        /*==========================================
                NO IMAGE
    ==========================================*/

    if(images.length === 0){

        return(

            <div className="gallery-container">

                <div className="gallery-main">

                    <img

                        src="/images/no-image.png"

                        alt="No Image"

                    />

                </div>

            </div>

        );

    }

    /*==========================================
                JSX
    ==========================================*/

    return(

        <>

            <div className="gallery-container">

                {/*==================================
                        THUMBNAILS
                ==================================*/}

                <div className="gallery-thumbnails">

                    {

                        images.map((image,index)=>(

                            <button

                                key={index}

                                className={

                                    activeImage===index

                                    ?

                                    "thumbnail active"

                                    :

                                    "thumbnail"

                                }

                                onClick={()=>selectImage(index)}

                            >

                                <img

                                    src={image}

                                    alt={`${name}-${index+1}`}

                                />

                            </button>

                        ))

                    }

                </div>

                {/*==================================
                        MAIN IMAGE
                ==================================*/}

                <div className="gallery-main">

                    <button

                        className="gallery-arrow left"

                        onClick={previousImage}

                    >

                        <FaChevronLeft/>

                    </button>

                    <img

                        src={images[activeImage]}

                        alt={name}

                        onClick={()=>setShowPreview(true)}

                    />

                    <button

                        className="gallery-arrow right"

                        onClick={nextImage}

                    >

                        <FaChevronRight/>

                    </button>

                    <button

                        className="zoom-btn"

                        onClick={()=>setShowPreview(true)}

                    >

                        <FaSearchPlus/>

                    </button>

                </div>

            </div>

            {/*==================================
                    IMAGE PREVIEW
            ==================================*/}

            {

                showPreview && (

                    <div

                        className="preview-overlay"

                        onClick={()=>setShowPreview(false)}

                    >

                        <button

                            className="preview-close"

                        >

                            <FaTimes/>

                        </button>

                        <img

                            src={images[activeImage]}

                            alt={name}

                            onClick={(e)=>e.stopPropagation()}

                        />

                    </div>

                )

            }

        </>

    );

}

export default ProductGallery;