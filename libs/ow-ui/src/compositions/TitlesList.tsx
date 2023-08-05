import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { TitleTypeBadge } from '../components/TitleTypeBadge';
import ListItemText from '@mui/material/ListItemText';

export type TitleDetails = {
  titleNumber: string;
  propertyAddress: string;
  tenure: 'leasehold' | 'freehold';
};

type TitlesListProps = {
  titles: TitleDetails[];
};

export function TitlesList({ titles }: TitlesListProps) {
  return (
    <List>
      {titles.map((title, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton>
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
