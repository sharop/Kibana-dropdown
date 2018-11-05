import "./combopicker.less"
import "./comboController"

import optionsTemplate from 'plugins/combo_3/comboOptions.html'
import template from 'plugins/combo_3/combo_3.html'
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';

const ComboVisProvider = (Private) => {
  const VisFactory = Private(VisFactoryProvider);

 
  return VisFactory.createAngularVisualization({
    name: 'combo_3',
    title: 'Dropdown Picker',
    icon: 'fa-caret-square-o-down',
    description: 'Set filters via a dropdown selector',
    category: CATEGORY.OTHER,
    visConfig: {
      template: template
    },
    responseHandler:'none', // If U need to change the data, you will do here.
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([
      {
        group: 'metrics',
        name: 'count',
        title: 'Count',
        min: 1,
        max: 1,
        aggFilter: ['count','avg']
      },
      {
        group: 'buckets',
        name: 'dropdownfield',
        title: 'Field to filter on',
        min: 1,
        max: 1,
        aggFilter: '!geohash_grid'
      }
      ])
    }
  });
}

VisTypesRegistryProvider.register(ComboVisProvider);

export default ComboVisProvider;