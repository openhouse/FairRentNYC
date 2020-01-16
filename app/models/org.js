import DS from 'ember-data';
const { Model, attr } = DS;
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { notEmpty } from '@ember/object/computed';

export default Model.extend({
  // ATTRIBUTES
  name: attr(),
  order: attr(),
  url: attr(),
  hasLogo: attr(),
  active: attr(),

  /*
  COMPUTED PROPERTIES
  */
  isActive: notEmpty('active'),

  // responsive quote text
  logo: computed('id', 'hasLogo', function () {
    if (isPresent(this.get('hasLogo'))) {
      return `/s/logos/orgs/color--ao/${this.get('id')}.png`;
    }

    return null;
  }),

});
