import DS from 'ember-data';
import { computed } from '@ember/object';
import { notEmpty, alias } from '@ember/object/computed';
const { Model, attr, hasMany, belongsTo } = DS;

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

  // RELATIONSHIPS
  photos: hasMany('photo'),
  sponsorhood: belongsTo('sponsorhood'),

  // COMPUTED PROPERTIES
  isSponsor: notEmpty('sponsorhood.order'),
  sponsorOrder: alias('sponsorhood.order'),

  name: computed('firstName', 'lastName', function () {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),

  tweetText: computed('twitterHandle', 'isSponsor', function () {
    if (this.get('isSponsor')) {
      return `RENT closes NYC spaces. @${this.get('twitterHandle')}: PASS Commercial Rent Stabilization Bill 1796 for affordable diverse neighborhoods @NYCCouncil @NYCArtC`;
    } else {
      return `RENT closes NYC spaces. @${this.get('twitterHandle')}: PASS Commercial Rent Stabilization Bill 1796 for affordable diverse neighborhoods @NYCCouncil @NYCArtC`;
    }
  }),

  tweetUrl: computed('tweetText', function () {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.get('tweetText'))}&url=https://FairRentNYC.com&hashtags=FairRentNYC,StopDisplacement`;
  }),

});
