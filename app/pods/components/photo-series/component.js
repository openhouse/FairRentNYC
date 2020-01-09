import Component from '@ember/component';
import { sort, filterBy } from '@ember/object/computed';

export default Component.extend({
  filteredPhotos: filterBy('photos', 'isTestimonial', true),
  seriesSorting: ['testimonialOrder'],
  seriesPhotos: sort('filteredPhotos', 'seriesSorting'),

});
