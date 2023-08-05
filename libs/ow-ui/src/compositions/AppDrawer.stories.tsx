import type { Meta, StoryFn } from '@storybook/react';

import { AppDrawer as AppDrawerComponent } from './AppDrawer';
import { Typography } from '@mui/material';

const Story: Meta<typeof AppDrawerComponent> = {
  component: AppDrawerComponent,
  title: 'components/Title Type Badge',
  parameters: {
    layout: 'centered',
  },
};
export default Story;

const Template: StoryFn<typeof AppDrawerComponent> = (args) => (
  <AppDrawerComponent {...args} />
);

export const AppDrawer = Template.bind({});
AppDrawer.args = {
  title: 'Drawer component title',
  drawerContent: <Typography> Any react component can go here</Typography>,
  children: <Typography>The main map application will go here</Typography>,
};
