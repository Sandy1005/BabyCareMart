import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import "./SalesChart.css";

function SalesChart({ orders }) {

    const monthNames = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];

    const monthlySales = new Array(12)

        .fill(0)

        .map((_, index) => ({

            month: monthNames[index],

            sales: 0

        }));

    orders.forEach((order) => {

        const date = new Date(order.orderDate);

        if (isNaN(date.getTime())) return;

        const month = date.getMonth();

        monthlySales[month].sales += Number(order.total || 0);

    });

    return (

        <div className="sales-chart">

            <h2>

                Monthly Sales

            </h2>

            <ResponsiveContainer

                width="100%"

                height={350}

            >

                <BarChart

                    data={monthlySales}

                >

                    <CartesianGrid

                        strokeDasharray="3 3"

                    />

                    <XAxis

                        dataKey="month"

                    />

                    <YAxis />

                    <Tooltip />

                    <Bar

                        dataKey="sales"

                        radius={[8,8,0,0]}

                        fill="#2563eb"

                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default SalesChart;