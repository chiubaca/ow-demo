import type { Meta, StoryFn } from '@storybook/react';

import { TitleTypeBadge as TitleTypeBadgeComponent } from './TitleTypeBadge';

const Story: Meta<typeof TitleTypeBadgeComponent> = {
  component: TitleTypeBadgeComponent,
  title: 'components/Title Type Badge',
  parameters: {
    layout: 'centered',
  },
};
export default Story;

const Template: StoryFn<typeof TitleTypeBadgeComponent> = (args) => (
  <TitleTypeBadgeComponent {...args} />
);

export const TitleTypeBadge = Template.bind({});
TitleTypeBadge.args = {
  type: 'freehold',
};
