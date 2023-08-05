import * as React from 'react';
import Chip from '@mui/material/Chip';

type TitleTypeBadgeProps = {
  type: 'leasehold' | 'freehold';
};

const typeColorMapper = {
  leasehold: '#b5b5f3',
  freehold: '#4fb04f',
};

export function TitleTypeBadge({ type }: TitleTypeBadgeProps) {
  return (
    <Chip
      label={type.toUpperCase()}
      style={{ backgroundColor: typeColorMapper[type] }}
    />
  );
}
