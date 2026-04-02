import React from 'react';

export const Skeleton = ({ type }) => {
  const classes = `skeleton skeleton-${type}`;
  return <div className={classes} />;
};

export const DashboardSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <Skeleton type="title" />
      </div>
      
      <div className="summary-cards">
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="card" />
      </div>

      <div className="charts-container">
        <Skeleton type="chart-large" />
        <Skeleton type="chart-small" />
      </div>
    </div>
  );
};
