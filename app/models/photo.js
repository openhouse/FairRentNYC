import DS from 'ember-data';
import { computed } from '@ember/object';
import { notEmpty, alias } from '@ember/object/computed';
const { Model, attr, belongsTo } = DS;
import { isPresent } from '@ember/utils';

const defaultQuote = 'Pass Commercial Rent Stabilization';

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
  rawQuoteMd: attr(),
  rawQuoteSm: attr(),
  rawQuoteXs: attr(),
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

  /*
  COMPUTED PROPERTIES
  */
  //
  cdn9Url: computed('sizes.9.source', function () {
    return `https://res.cloudinary.com/nycartc/image/fetch/q_auto,f_auto/${this.get('sizes.9.source')}`;
  }),



  // responsive quote text
  quoteMd: computed('rawQuoteMd', function () {
    let rawQuoteMd = this.get('rawQuoteMd');
    if (isPresent(rawQuoteMd)) {
      return rawQuoteMd.trim();
    }

    return defaultQuote;
  }),

  quoteSm: computed('rawQuoteSm', 'quoteMd', function () {
    let rawQuoteSm = this.get('rawQuoteSm');
    if (isPresent(rawQuoteSm)) {
      return rawQuoteSm.trim();
    }

    return this.get('quoteMd');
  }),

  quoteXs: computed('rawQuoteXs', function () {
    let rawQuoteXs = this.get('rawQuoteXs');
    if (isPresent(rawQuoteXs)) {
      return rawQuoteXs.trim();
    }

    return this.get('quoteSm');
  }),

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
      return 57;
    }
  }),

});
