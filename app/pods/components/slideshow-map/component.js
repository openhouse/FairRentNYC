import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';

export default Component.extend({
  /*
  lat: 40.6811437,
  lng: -73.9741527,
  */
  photos: null,
  districts: null,

  lat: 40.81352403,
  lng: -73.94097228,
  zoom: 12,
  photo: computed('photos.@each', function () {
    return this.get('photos.firstObject');
  }),

  district: computed('districts.@each', function () {
    return this.get('districts.firstObject');
  }),

});
