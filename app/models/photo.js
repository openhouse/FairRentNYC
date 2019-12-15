import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  // ATTRIBUTES
  vacantSpaceId: attr(),
  district: attr(),
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

  // RELATIONSHIPS
  district: belongsTo('district'),

  // COMPUTED PROPERTIES
  score: computed('districtPriority', 'overallPhotoRank', function () {
    let priority = this.get('districtPriority') / 51;
    let photoRank = this.get('normalizedPhotoRank');
    console.log(priority, photoRank);

    return Math.pow((Math.pow(priority, 2) + Math.pow(photoRank, 2)), 0.5);
  }),

});
