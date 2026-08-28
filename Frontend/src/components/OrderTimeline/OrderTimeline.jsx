import {

    FaCheck,

    FaClipboardCheck,

    FaBox,

    FaShippingFast,

    FaTruck,

    FaHome

} from "react-icons/fa";

import "./OrderTimeline.css";

function OrderTimeline({

    status

}){

    /*==========================================
                TIMELINE STEPS
    ==========================================*/

    const steps=[

        {

            title:"Order Placed",

            description:"Your order has been placed successfully.",

            icon:<FaClipboardCheck />

        },

        {

            title:"Processing",

            description:"Your order is being prepared.",

            icon:<FaBox />

        },

        {

            title:"Packed",

            description:"Your order has been packed.",

            icon:<FaBox />

        },

        {

            title:"Shipped",

            description:"Your order has left our warehouse.",

            icon:<FaShippingFast />

        },

        {

            title:"Out For Delivery",

            description:"Your package is out for delivery.",

            icon:<FaTruck />

        },

        {

            title:"Delivered",

            description:"Order delivered successfully.",

            icon:<FaHome />

        }

    ];

    /*==========================================
            CURRENT STATUS INDEX
    ==========================================*/

    const currentIndex=steps.findIndex(

        (step)=>step.title===status

    );
        return(

        <div className="order-timeline">

            {

                steps.map((step,index)=>{

                    /*==========================================
                            STEP STATE
                    ==========================================*/

                    let stepClass="pending";

                    if(index<currentIndex){

                        stepClass="completed";

                    }

                    else if(index===currentIndex){

                        stepClass="active";

                    }

                    return(

                        <div

                            key={index}

                            className={`timeline-step ${stepClass}`}

                        >

                            {/*==================================
                                    TIMELINE CIRCLE
                            ==================================*/}

                            <div className="timeline-circle">

                                {

                                    stepClass==="completed"

                                    ?

                                    <FaCheck />

                                    :

                                    step.icon

                                }

                            </div>

                            {/*==================================
                                    TIMELINE LINE
                            ==================================*/}

                            {

                                index!==steps.length-1 && (

                                    <div

                                        className="timeline-line"

                                    ></div>

                                )

                            }

                            {/*==================================
                                    CONTENT
                            ==================================*/}

                            <div className="timeline-content">

                                <h3>

                                    {step.title}

                                </h3>

                                <p>

                                    {step.description}

                                </p>

                            </div>

                        </div>

                    );

                })

            }
        </div>
    );
}
export default OrderTimeline;