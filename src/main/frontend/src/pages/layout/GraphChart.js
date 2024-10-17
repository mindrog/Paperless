import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const GraphChart = () => {
    const [chartData, setChartData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/graph-data');
            const data = await response.json();
            console.log("data : ", data); // 데이터 확인용
    
            setChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: 'Monthly Sales',
                        data: data.values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching the graph data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        responsive: true,
        animation: {
            duration: 2000,
            easing: 'easeInOutBounce',
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            {/* <h2>Animated Bar Chart</h2> */}
            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default GraphChart;
