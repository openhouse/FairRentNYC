import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort, filterBy } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Component.extend({
  // SERVICES
  timepiece: service('timepiece'),

  // PROPERTIES
  photos: null,
  zoom: 12,
  displaySeconds: 5, // 4
  transitionSeconds: 1,
  map: null,

  // COMPUTED PROPERTIES
  mapPhotos: filterBy('photos', 'isMapPhoto', true),
  scoreSorting: ['score'],
  scoredPhotosSorted: sort('mapPhotos', 'scoreSorting'),
  scoredPhotos: computed('scoredPhotosSorted.[]', function () {
    let photos = this.get('scoredPhotosSorted');
    let shortIndex = Math.floor(photos.get('length') * 0.381966011250145);

    let output = [photos[shortIndex]].concat(photos.slice(0, shortIndex - 1)).concat(photos.slice(shortIndex + 1));
    return output;
  }),

  prevPhoto: computed('scoredPhotos.[]', 'currentPhotoIndex', 'photos.length', function () {
    let photos = this.get('scoredPhotos');
    return photos[(this.get('currentPhotoIndex') - 1) % photos.length];
  }),

  photo: computed('scoredPhotos.[]', 'currentPhotoIndex', 'photos.length', function () {
    let photos = this.get('scoredPhotos');
    return photos[this.get('currentPhotoIndex') % photos.length];
  }),

  nextPhoto: computed('scoredPhotos.[]', 'currentPhotoIndex', 'photos.length', function () {
    let photos = this.get('scoredPhotos');
    return photos[(this.get('currentPhotoIndex') + 1) % photos.length];
  }),

  moveMap: observer('photo.id', function () {
    let photo = this.get('photo');
    let map = this.get('map');
    let zoom = this.get('zoom');
    let transitionSeconds = this.get('transitionSeconds');
    map.flyTo([photo.get('y'), photo.get('x')], zoom, {
      animate: true,
      duration: transitionSeconds,
    });
  }),

  imagesShown: 0,
  currentPhotoIndex: 0,
  tick: -1,

  timeObserver: observer('timepiece.second', function () {
    this.get('timepiece.second');
    let tick = this.get('tick');
    let display = this.get('displaySeconds');
    let transition = this.get('transitionSeconds');
    let currentPhotoIndex = this.get('currentPhotoIndex');
    let cycleLength = display + transition;
    // advance photo every cycleLength
    if (tick % cycleLength   === 0) {
      currentPhotoIndex++;
      this.set('currentPhotoIndex', currentPhotoIndex);
    }
    // tick every second
    tick++;
    this.set('tick', tick);
  }),

  /*
  currentPhotoIndex: computed('clock.time', 'displaySeconds', 'transitionSeconds', function () {
    let clockTime = this.get('clock.time');
    let display = this.get('displaySeconds');
    let transition = this.get('transitionSeconds');
    let cycleLength = display + transition;
    let secondsFromTick = this.get('secondsFromTick');
    let cPI = this.get('cPI');
    secondsFromTick++;
    if (this.get('imagesShown') < 2) {
      secondsFromTick = cycleLength;
      this.set('imagesShown', this.get('imagesShown') + 1);
    }

    if (secondsFromTick >= cycleLength) {
      secondsFromTick = 0;
      cPI++;
      this.set('cPI', cPI);
    }

    this.set('secondsFromTick', secondsFromTick);
    if (secondsFromTick === 0) {
      if (cPI < 0) {
        return 0;
      }

      return cPI;
    }
    // return cPI;
    // return 41;
  }),
  */
  actions: {
    initMap(event) {
      let map = event.target;
      this.set('map', event.target);
    },
  },

});
