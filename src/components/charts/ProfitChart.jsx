import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfitChart = () => {
  // Datos de ejemplo
  const data = [
    { name: 'Ene', profit: 400 },
    { name: 'Feb', profit: 300 },
    { name: 'Mar', profit: 600 },
    { name: 'Abr', profit: 800 },
    { name: 'May', profit: 500 },
    { name: 'Jun', profit: 900 },
    { name: 'Jul', profit: 1200 },
  ];

  return (
    <div className="profit-chart">
      <h3>Evolución de Beneficios</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}€`, 'Beneficio']} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#2563eb" 
              activeDot={{ r: 8 }} 
              name="Beneficio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart; 