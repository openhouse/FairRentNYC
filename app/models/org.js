import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  // ATTRIBUTES
  name: attr(),
  order: attr(),
  url: attr(),
  logo: attr(),
});
