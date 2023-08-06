import type { Meta, StoryFn } from '@storybook/react';

import { LayersList as LayerListComponent } from './LayersList';

const Story: Meta<typeof LayerListComponent> = {
  component: LayerListComponent,
  title: 'components/Layer List',
};
export default Story;

const Template: StoryFn<typeof LayerListComponent> = (args) => (
  <LayerListComponent {...args} />
);

export const TitleTypeBadge = Template.bind({});
TitleTypeBadge.args = {
  layers: ['Test layer', 'Test layer 2', 'And another layer'].map(
    (layerName) => ({
      isVisible: true,
      isLayerOn: true,
      layerName: layerName,
      onClick: () =>
        console.log(
          'This can do anything, toggling if a network request should be made'
        ),
    })
  ),
};
