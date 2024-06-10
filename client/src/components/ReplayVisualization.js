import React from 'react';
import { Line } from 'react-chartjs-2';

const ReplayVisualization = ({ data }) => {
  const chartData = {
    labels: data.timestamps,
    datasets: [
      {
        label: 'APM',
        data: data.apm,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h2>APM Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ReplayVisualization;
