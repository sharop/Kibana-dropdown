//const PLUGIN_NAME = 'kibana_dropdown';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'combo_3',
    uiExports: {
      visTypes: ['plugins/combo_3/combo_3']  
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

  });
};
