import React from 'react';

const StatusBadge = ({ status }:{status: string}) => {
  let statusText;
  let textColor;

  switch (status) {
    case 'paid':
      statusText = 'Paid';
      textColor = '#28a745'; 
      break;
    case 'failed':
      statusText = 'Failed';
      textColor = '#dc3545'; 
      break;
    case 'pending':
      statusText = 'Pending';
      textColor = '#FF535B'; 
      break;
    case 'unpaid':
      statusText = 'Unpaid';
      textColor = '#FF535B'; 
      break;  
    case 'confirmed':
      statusText = 'Confirmed';
      break;
    case 'unconfirmed':
      statusText = 'Unconfirmed';
      break;
    default:
      statusText = 'Unknown';
  }

  const badgeStyle = {
    color: textColor || 'white',
    backgroundColor: textColor ? 'transparent' : getStatusColor(status),
    padding: '5px 10px',
    borderRadius: '5px',
  };

  return (
    <span style={badgeStyle}>
      {statusText}
    </span>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'rgba(234, 171, 64, 0.24)';
    case 'unconfirmed':
      return 'rgba(255, 0, 0, 0.24)'; 
    default:
      return 'transparent';
  }
};

export default StatusBadge;



export interface BadgeProps{
  status: string,
  onClick: () => void
}

export const Badge = ({ status, onClick }: BadgeProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  let badgeText = '';
  let badgeColor = '';
  let color = ''

  switch (status) {
    case 'pending':
    case 'unconfirmed':
      badgeText = 'Unconfirmed';
      badgeColor = 'rgba(234, 171, 64, 0.24)';
      color = 'rgba(203, 138, 20, 1)'
      break;
    case 'paid':
    case 'confirmed':
      badgeText = 'Confirmed';
      badgeColor = 'green';
      break;
    default:
      badgeText = 'Unknown';
      badgeColor = 'gray';
  }

  return (
    <div
      onClick={handleClick}
      style={{
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: badgeColor,
        color: color,
        cursor: 'pointer' ,
      }}
    >
      {badgeText}
    </div>
  );
};

