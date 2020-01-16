import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  orgsSorting: ['order'],
  orgsSorted: sort('orgs', 'orgsSorting'),

});
