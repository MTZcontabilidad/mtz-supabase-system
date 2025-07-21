import React from 'react';
import { cn } from '@/utils/helpers.js';

/**
 * Componente Skeleton para mostrar estados de carga
 */
const Skeleton = ({
  className,
  width,
  height,
  rounded = 'md',
  animate = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        rounded === 'full' && 'rounded-full',
        rounded === 'md' && 'rounded-md',
        rounded === 'lg' && 'rounded-lg',
        rounded === 'xl' && 'rounded-xl',
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
};

/**
 * Skeleton para tablas
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex space-x-4'>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width='120px' height='20px' />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex space-x-4'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={colIndex === 0 ? '200px' : '120px'}
              height='16px'
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para cards
 */
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'
        >
          <div className='space-y-4'>
            <Skeleton width='60%' height='20px' />
            <Skeleton width='40%' height='16px' />
            <Skeleton width='80%' height='16px' />
            <div className='flex space-x-2'>
              <Skeleton width='60px' height='32px' rounded='full' />
              <Skeleton width='80px' height='32px' rounded='full' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton para formularios
 */
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <div className='space-y-6'>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className='space-y-2'>
          <Skeleton width='120px' height='16px' />
          <Skeleton width='100%' height='40px' />
        </div>
      ))}
      <div className='flex space-x-4 pt-4'>
        <Skeleton width='100px' height='40px' />
        <Skeleton width='100px' height='40px' />
      </div>
    </div>
  );
};

/**
 * Skeleton para gráficos
 */
export const ChartSkeleton = ({ width = '100%', height = '300px' }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
      <div className='space-y-4'>
        <Skeleton width='200px' height='20px' />
        <Skeleton width='100%' height={height} />
        <div className='flex justify-center space-x-4'>
          <Skeleton width='60px' height='16px' />
          <Skeleton width='60px' height='16px' />
          <Skeleton width='60px' height='16px' />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton para listas
 */
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className='flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg'
        >
          <Skeleton width='40px' height='40px' rounded='full' />
          <div className='flex-1 space-y-2'>
            <Skeleton width='60%' height='16px' />
            <Skeleton width='40%' height='14px' />
          </div>
          <Skeleton width='80px' height='32px' />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
