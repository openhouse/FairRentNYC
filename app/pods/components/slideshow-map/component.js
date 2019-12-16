import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Component.extend({
  // SERVICES
  clock: service('slideshow-clock'),

  // PROPERTIES
  photos: null,
  zoom: 12,
  displaySeconds: 5, // 4
  transitionSeconds: 1,
  map: null,

  // COMPUTED PROPERTIES
  scoreSorting: ['score'],
  scoredPhotos: sort('photos', 'scoreSorting'),

  prevPhoto: computed('scoredPhotos.[]', 'currentPhotoIndex', function () {
    let photos = this.get('scoredPhotos');
    return photos[(this.get('currentPhotoIndex') - 1) % photos.length];
  }),

  photo: computed('scoredPhotos.[]', 'currentPhotoIndex', function () {
    let photos = this.get('scoredPhotos');
    return photos[this.get('currentPhotoIndex') % photos.length];
  }),

  nextPhoto: computed('scoredPhotos.[]', 'currentPhotoIndex', function () {
    let photos = this.get('scoredPhotos');
    return photos[(this.get('currentPhotoIndex') + 1) % photos.length];
  }),

  cPI: 0,
  secondsFromTick: 0,

  moveMap: observer('photo.id', function () {
    console.log('moveMap', this.get('photo.id'));
    let map = this.get('map');
    let zoom = this.get('zoom');
    let transitionSeconds = this.get('transitionSeconds');
    let photo = this.get('photo');
    map.flyTo([photo.get('y'), photo.get('x')], zoom, {
      animate: true,
      duration: transitionSeconds,
    });
  }),

  currentPhotoIndex: computed('clock.time', 'displaySeconds', 'transitionSeconds', function () {
    let clockTime = this.get('clock.time');
    let display = this.get('displaySeconds');
    let transition = this.get('transitionSeconds');
    let cycleLength = display + transition;
    let secondsFromTick = this.get('secondsFromTick');
    let cPI = this.get('cPI');
    secondsFromTick++;
    if (secondsFromTick >= cycleLength) {
      secondsFromTick = 0;
      cPI++;
      this.set('cPI', cPI);
    }

    this.set('secondsFromTick', secondsFromTick);
    if (secondsFromTick === 0) {
      return cPI;
    }
  }),

  actions: {
    initMap(event) {
      let map = event.target;
      this.set('map', event.target);
    },
  },

});
