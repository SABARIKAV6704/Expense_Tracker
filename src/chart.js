// src/Chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ transactions }) => {
  const addedTransactions = transactions.filter(transaction => transaction.price > 0);
  const spentTransactions = transactions.filter(transaction => transaction.price < 0);

  const totalAdded = addedTransactions.reduce((acc, transaction) => acc + transaction.price, 0);
  const totalSpent = spentTransactions.reduce((acc, transaction) => acc + Math.abs(transaction.price), 0);

  const chartData = {
    labels: ['Income', 'Spent Amount'],
    datasets: [
      {
        label: 'Expenses vs Income',
        data: [totalAdded, totalSpent],
        backgroundColor: ['#44c767', '#c11'],
        borderColor: ['#3e9a5b', '#a00'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2c3e50', // Dark color for legend text
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `₹${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    cutout: '85%', // Creates a donut chart effect
    elements: {
      arc: {
        borderWidth: 2, // Border width for pie slices
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '20px' }}>
        Expenses vs Income
      </h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default Chart;
