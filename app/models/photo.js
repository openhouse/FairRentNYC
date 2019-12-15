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

});
