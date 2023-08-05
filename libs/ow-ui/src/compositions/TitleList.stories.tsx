import type { Meta, StoryFn } from '@storybook/react';

import { TitleDetails, TitlesList as TitlesListComponent } from './TitlesList';

const Story: Meta<typeof TitlesListComponent> = {
  component: TitlesListComponent,
  title: 'components/Titles List',
  parameters: {
    // layout: 'centered',
  },
};
export default Story;

const Template: StoryFn<typeof TitlesListComponent> = (args) => (
  <TitlesListComponent {...args} />
);

const titles: TitleDetails[] = [
  {
    titleNumber: '243751',
    propertyAddress: '31-35 Kirby Street, London, EC1N 8TE',
    tenure: 'freehold',
  },
  {
    titleNumber: '342999',
    propertyAddress: '102-108 Clerkenwell Road, London (EC1M 5SA)',
    tenure: 'leasehold',
  },
  {
    titleNumber: '41229',
    propertyAddress: '75 Farringdon Road, London (EC1M 3JY)',
    tenure: 'freehold',
  },
  {
    titleNumber: '87401',
    propertyAddress: '45 Hatton Garden, London (EC1N 8EU)',
    tenure: 'freehold',
  },
  {
    titleNumber: 'AGL250417',
    propertyAddress:
      'First Floor Farringdon Place, 20 Farringdon Road, London (EC1M 3HE)',
    tenure: 'leasehold',
  },
];

export const TitleTypeBadge = Template.bind({});
TitleTypeBadge.args = {
  titles,
};
