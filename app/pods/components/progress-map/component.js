import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default Component.extend(InViewportMixin, {
  timepiece: service('timepiece'),

  lazyMapUrl: '',
  // show map if in viewport
  didEnterViewport() {
    this.set('lazyMapUrl', '/s/map.html');
  },

  remainingCount: computed('sponsorCount', function () {
    return 26 - this.get('sponsorCount');
  }),


  // show map after 3 seconds
  tick: 0,
  timeObserver: observer('timepiece.second', function () {
    this.get('timepiece.second');
    let tick = this.get('tick');
    // tick every second
    tick++;
    this.set('tick', tick);
    if (tick === 3) {
      this.set('lazyMapUrl', '/s/map.html');
    }
  }),

});
