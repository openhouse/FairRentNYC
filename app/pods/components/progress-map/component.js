import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  remainingCount: computed('sponsorCount', function () {
    return 26 - this.get('sponsorCount');
  }),

});
