import React, { useState, useCallback, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import Card from '../ui/Card.jsx';
import { formatCurrency  } from '../../utils/helpers.js';

/**
 * ClientesChart Component
 * Componente de gráficos profesionales para visualizar datos de clientes.
 * Usa Recharts para gráficos interactivos y responsivos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico
 * @param {string} props.type - Tipo de gráfico (bar, pie, line, area)
 * @param {string} props.title - Título del gráfico
 * @param {string} props.xKey - Clave para el eje X
 * @param {string} props.yKey - Clave para el eje Y
 * @param {string} props.colorKey - Clave para colores (opcional)
 */
const ClientesChart = ({
  data = [],
  type = 'bar',
  title = 'Gráfico de Clientes',
  xKey = 'name',
  yKey = 'value',
  colorKey = 'color',
  height = 400,
}) => {
  // Colores para gráficos
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6366F1',
  ];

  // Preparar datos para gráficos
  const chartData = data.map((item, index) => ({
    ...item,
    color: item[colorKey] || colors[index % colors.length],
  }));

  // Renderizar gráfico según tipo
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? formatCurrency(value) : value,
                name,
              ]}
            />
            <Legend />
            <Bar dataKey={yKey} fill='#3B82F6' />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey={yKey}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? formatCurrency(value) : value,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? formatCurrency(value) : value,
                name,
              ]}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey={yKey}
              stroke='#3B82F6'
              strokeWidth={2}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? formatCurrency(value) : value,
                name,
              ]}
            />
            <Legend />
            <Area
              type='monotone'
              dataKey={yKey}
              stroke='#3B82F6'
              fill='#3B82F6'
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      default:
        return <div>Tipo de gráfico no soportado</div>;
    }
  };

  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>{title}</h3>
      <ResponsiveContainer width='100%' height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </Card>
  );
};

export default ClientesChart;
