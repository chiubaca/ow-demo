import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { TitleTypeBadge } from '../components/TitleTypeBadge';
import ListItemText from '@mui/material/ListItemText';
import { Tenure } from '../common';

export type TitleDetails = {
  titleNumber: string;
  propertyAddress: string;
  tenure: Tenure;
  onClick?: () => void;
};

type TitlesListProps = {
  titles: TitleDetails[];
};

export function TitlesList({ titles }: TitlesListProps) {
  return (
    <List>
      {titles.map((title, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={title.onClick}>
            <ListItemText
              primary={title.titleNumber.toUpperCase()}
              secondary={title.propertyAddress}
            />
            <TitleTypeBadge type={title.tenure} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
