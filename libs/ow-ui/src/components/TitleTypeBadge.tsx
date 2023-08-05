import * as React from 'react';
import Chip from '@mui/material/Chip';
import { Tenure } from '../common';

type TitleTypeBadgeProps = {
  type: Tenure;
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
