import { useState } from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import {
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff,
  Layers,
} from '@mui/icons-material';

type LayerListProps = {
  layers: {
    isVisible: boolean;
    isLayerOn: boolean;
    layerName: string;
    onClick: () => void;
  }[];
};

export const LayersList = ({ layers }: LayerListProps) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List component="nav" aria-labelledby="nested-layer-list">
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Layers />
        </ListItemIcon>
        <ListItemText primary="All layers" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {layers.map((l, index) => {
            return (
              <ListItemButton
                onClick={l.onClick}
                disabled={!l.isVisible}
                sx={{ pl: 4 }}
                key={index}
              >
                <ListItemIcon>
                  {l.isLayerOn ? <Visibility /> : <VisibilityOff />}
                </ListItemIcon>
                <ListItemText primary={l.layerName} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
};
