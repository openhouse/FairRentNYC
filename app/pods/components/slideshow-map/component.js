import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort, filterBy } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default Component.extend({
  // SERVICES
  timepiece: service('timepiece'),
  notifications: service('toast'),

  // PROPERTIES
  photos: null,
  zoom: 12,
  displaySeconds: 5, // 4
  transitionSeconds: 1,
  map: null,
  playing: true,

  // COMPUTED PROPERTIES
  mapPhotos: filterBy('photos', 'isMapPhoto', true),
  scoreSorting: ['score'],
  scoredPhotosSorted: sort('mapPhotos', 'scoreSorting'),

  scoredPhotosSortedAlternating: computed('scoredPhotosSorted.[]', function () {
    let photos = this.get('scoredPhotosSorted');

  }),

  scoredPhotos: computed('scoredPhotosSorted.[]', function () {
    let photos = this.get('scoredPhotosSorted');
    let shortIndex = Math.floor(photos.get('length') * 0.381966011250145) - 2;

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
  cycleLength: computed('displaySeconds', 'transitionSeconds', function () {
    return this.get('transitionSeconds') + this.get('displaySeconds');
  }),

  cyclePos: computed('tick', 'cycleLength', function () {
    return mod(this.get('tick') - 1, this.get('cycleLength'));
  }),

  timeObserver: observer('timepiece.second', function () {
    this.get('timepiece.second');
    let tick = this.get('tick');
    let display = this.get('displaySeconds');
    let transition = this.get('transitionSeconds');
    let currentPhotoIndex = this.get('currentPhotoIndex');
    let cycleLength = display + transition;
    // advance photo every cycleLength
    if (tick % cycleLength   === 0) {
      if (this.get('playing')) {
        currentPhotoIndex++;
        this.set('currentPhotoIndex', currentPhotoIndex);
      }
    }
    // tick every second
    tick++;
    this.set('tick', tick);
  }),

  actions: {
    initMap(event) {
      let map = event.target;
      this.set('map', event.target);
    },

    /*
      SLIDESHOW CONTROLS
    */
    copyLink() {
      let notifications = this.get('notifications');
      notifications.success('&#x1f517; Link Copied to Clipboard');
    },

    togglePlay() {
      let playing = this.get('playing');
      playing = !playing;
      this.set('playing', playing);
      if (playing) {
        let display = this.get('displaySeconds');
        let transition = this.get('transitionSeconds');
        let cycleLength = display + transition;
        this.set('tick', cycleLength);
      }
    },

    next() {
      let currentPhotoIndex = this.get('currentPhotoIndex');

      let photosCount = this.get('scoredPhotos.length');
      // currentPhotoIndex = (currentPhotoIndex + 1) % photosCount;
      currentPhotoIndex = mod(currentPhotoIndex + 1, photosCount);

      this.set('currentPhotoIndex', currentPhotoIndex);
      this.set('playing', false);
    },

    prev() {
      let currentPhotoIndex = this.get('currentPhotoIndex');

      let photosCount = this.get('scoredPhotos.length');
      currentPhotoIndex = mod(currentPhotoIndex - 1, photosCount);

      // currentPhotoIndex = (currentPhotoIndex - 1) % photosCount;
      console.log('currentPhotoIndex', currentPhotoIndex);
      console.log('photosCount', photosCount);

      this.set('currentPhotoIndex', currentPhotoIndex);
      this.set('playing', false);
    },

  },

});
