import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { sort } from '@ember/object/computed';

export default Component.extend({
  // PROPERTIES
  photos: null,
  districts: null,
  zoom: 12,

  // COMPUTED PROPERTIES
  scoreSorting: ['score'],
  scoredPhotos: sort('photos', 'scoreSorting'),

  photo: computed('scoredPhotos.@each', function () {
    return this.get('scoredPhotos.firstObject');
  }),

  district: computed('districts.@each', function () {
    return this.get('districts.firstObject');
  }),

});
