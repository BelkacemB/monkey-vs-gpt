'use client'

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PortfolioChart({ valuations, benchmark }: { valuations: ValuationData, benchmark: StockData[] }) {
  const firstDate = new Date(valuations.monkeyValuations[0].SK);
  firstDate.setDate(firstDate.getDate() - 1);
  const formattedFirstDate = firstDate.toISOString().split('T')[0];

  const dates = [formattedFirstDate, ...valuations.monkeyValuations.map(v => v.SK)]

  const monkeyData = [100, ...valuations.monkeyValuations.map(v => (v.value / 10000 * 100).toFixed(2))];
  const chatGptData = [100, ...valuations.chatGptValuations.map(v => (v.value / 10000 * 100).toFixed(2))];
  const normalizedBenchmarkData = benchmark ? benchmark.map(b => ((b.close / benchmark[0].close) * 100).toFixed(2)) : [];

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Monkey Portfolio',
        data: monkeyData,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
      {
        label: 'ChatGPT Portfolio',
        data: chatGptData,
        borderColor: 'rgba(0, 255, 255, 1)',
        tension: 0.4,
      },
      {
        label: 'Benchmark (S&P 500)',
        data: normalizedBenchmarkData,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to adjust its height
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
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6, // Limit the number of x-axis labels on smaller screens
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: string) {
            return value + '%';
          }
        }
      },
    },
  };

  return (
    <div className="p-4 rounded-lg shadow-lg md:mx-16">
      <div className="h-[300px] md:h-[400px]"> {/* Set a fixed height for the chart container */}
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
