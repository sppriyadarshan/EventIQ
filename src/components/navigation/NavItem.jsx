import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Tooltip from '../ui/Tooltip';

/**
 * EventIQ NavItem Component
 * Handles active state styling, collapsed mode tooltips, and responsive drawer clicks.
 */
export const NavItem = ({
  to,
  label,
  icon: Icon,
  isCollapsed = false,
  onClick,
  className = '',
}) => {
  const content = (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-150 select-none',
          isActive
            ? 'bg-brand-burgundy-soft text-brand-burgundy font-bold shadow-subtle'
            : 'text-brand-warm-gray hover:text-brand-burgundy hover:bg-brand-burgundy-soft/30',
          isCollapsed && 'justify-center px-0 w-11 h-11 mx-auto',
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                isActive ? 'text-brand-burgundy' : 'text-brand-warm-gray group-hover:text-brand-burgundy'
              )}
            />
          )}
          {!isCollapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default NavItem;
