import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { computed } from '@ember/object';

export default Component.extend(InViewportMixin, {
  lazyMapUrl: '',
  didEnterViewport() {
    this.set('lazyMapUrl', '/s/map.html');
  },

  remainingCount: computed('sponsorCount', function () {
    return 26 - this.get('sponsorCount');
  }),

});
