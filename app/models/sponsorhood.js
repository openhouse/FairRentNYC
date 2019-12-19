import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  // ATTRIBUTES
  order: attr(),

  // RELATIONSHIPS
  district: belongsTo('district'),

});
