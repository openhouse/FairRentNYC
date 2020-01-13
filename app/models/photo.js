import DS from 'ember-data';
import { computed } from '@ember/object';
import { notEmpty, alias } from '@ember/object/computed';
const { Model, attr, belongsTo } = DS;
import { isPresent } from '@ember/utils';

export default Model.extend({
  // ATTRIBUTES
  vacantSpaceId: attr(),
  districtPriority: attr(),
  address: attr(),
  x: attr(),
  y: attr(),
  photoUrl: attr(),
  photoUrlAllForLocation: attr(),
  overallPhotoRank: attr(),
  normalizedPhotoRank: attr(),
  display: attr(),
  photoLocationRankInDistrict: attr(),
  photoQualityRankingInDistrict: attr(),
  businessName: attr(),
  vacant: attr(),
  personInPhoto: attr(),
  flickrId: attr(),
  sizes: attr(),
  quote: attr(),
  shortQuote: attr(),
  borough: attr(),
  neighborhood: attr(),
  cssY: attr(),
  display: attr(),
  testimonial: attr(),
  testimonialRank: attr(),
  quoteName: attr(),

  // RELATIONSHIPS
  district: belongsTo('district'),

  // COMPUTED PROPERTIES
  isMapPhoto: notEmpty('display'),
  isTestimonial: notEmpty('testimonial'),
  testimonialOrder: alias('testimonialRank'),
  score: computed('districtPriority', 'overallPhotoRank', function () {
    let priority = this.get('districtPriority') / 51;
    let photoRank = this.get('normalizedPhotoRank');
    return Math.pow((Math.pow(priority, 2) + Math.pow(photoRank, 2)), 0.5);
  }),

  cssYPercent: computed('cssY', function () {
    let cssY = this.get('cssY');
    if (isPresent(cssY)) {
      return cssY;
    } else {
      return 62;
    }
  }),

});
