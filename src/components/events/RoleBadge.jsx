import React from 'react';
import Badge from '../ui/Badge';

export const ROLE_LABELS = {
  ADMIN: 'Event Organizer',
  FACULTY: 'Faculty Coordinator',
  PARTICIPANT: 'Participant',
  LOGISTICS: 'Staff',
  LOGISTICS_STAFF: 'Staff',
};

export const RoleBadge = ({ role, className = '' }) => {
  const label = ROLE_LABELS[role] || 'Participant';

  return (
    <Badge variant="burgundy" size="sm" className={className}>
      {label}
    </Badge>
  );
};

export default RoleBadge;
