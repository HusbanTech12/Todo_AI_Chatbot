'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactElement;
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenu({ children, trigger, align = 'end' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: () => setOpen(!open),
        'aria-expanded': open,
        className: `${(trigger.props as any).className || ''} ${open ? 'bg-accent' : ''}`
      })}

      {open && (
        <div
          className={`absolute z-50 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ${alignmentClasses[align]} animate-in fade-in-80`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, disabled, className }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
}