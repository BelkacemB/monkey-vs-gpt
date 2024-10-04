'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PortfolioChart({ valuations }: { valuations: ValuationData }) {
  const firstDate = new Date(valuations.monkeyValuations[0].SK);
  firstDate.setDate(firstDate.getDate() - 1);
  const formattedFirstDate = firstDate.toISOString().split('T')[0];

  const dates = [formattedFirstDate, ...valuations.monkeyValuations.map(v => v.SK)]
  const monkeyData = [10000, ...valuations.monkeyValuations.map(v => v.value)];
  const chatGptData = [10000, ...valuations.chatGptValuations.map(v => v.value)];

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Monkey Portfolio',
        data: monkeyData,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4, // Add this line
      },
      {
        label: 'ChatGPT Portfolio',
        data: chatGptData,
        borderColor: 'rgba(0, 255, 255, 1)',
        tension: 0.4, // Add this line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Valuations Over Time',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="p-4 rounded-lg shadow-lg">
      <Line options={options} data={data} />
    </div>
  );
}