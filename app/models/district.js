import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  // ATTRIBUTES
  districtNumber: attr(),
  firstName: attr(),
  lastName: attr(),
  remotePhotoUrl: attr(),
  facebookUrl: attr(),
  twitterUrl: attr(),
  twitterHandle: attr(),
  instagram_url: attr(),
  instagramHandle: attr(),
  party: attr(),
  title: attr(),
  gender: attr(),
  cityCouncilUrl: attr(),
  fullName: attr(),
  phone1: attr(),
  email: attr(),
  phone2: attr(),
  photoUrl: attr(),
  isSponsor: attr(),
  sponsorOrder: attr(),

  // RELATIONSHIPS
  photos: hasMany('photo'),

  // COMPUTED PROPERTIES
  name: computed('firstName', 'lastName', function () {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),
});
