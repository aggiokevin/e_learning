import React from 'react';
import Card from '../Common/Card';

const StatCard = ({ icon, title, value, subtitle, color = 'bg-primary-600' }) => {
  return (
    <Card hover>
      <div className="flex items-center">
        <div className={`${color} p-4 rounded-lg mr-4`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
