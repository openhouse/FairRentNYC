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

  sponsorEmailBody: computed('lastName', function () {
    let message = `
Council Member ${this.get('lastName')},

Too many important neighborhood places are closing due to rent increases. We lose neighborhood culture.

As a resident of your district, I thank you for sponsoring #FairRentNYC Commercial Rent Stabilization Bill #1796!

Now I ask that you pass Commercial Rent Stabilization Bill #1796.

This is very important to me, please let me know how you intend to speak with your colleagues about Commercial Rent Stabilization Bill #1796.

More info: http://FairRentNYC.com

Thank you`;
    return message.trim();
  }),

  nonSponsorEmailBody: computed('lastName', function () {
    let message = `
Council Member ${this.get('lastName')},

Too many important neighborhood places are closing due to rent increases. We lose neighborhood culture.

As a resident of your district, I ask you to sponsor #FairRentNYC Commercial Rent Stabilization Bill #1796.

This is very important to me, please let me know where you stand on Commercial Rent Stabilization Bill #1796.

More info: FairRentNYC.com

Thank you`;
    return message.trim();
  }),

  emailUrl: computed('isSponsor', 'sponsorEmailBody', 'nonSponsorEmailBody', 'email', function () {
    let email = this.get('email');
    let subject = '';
    let body = '';
    if (this.get('isSponsor')) {
      subject = 'Pass #FairRentNYC Commercial Rent Stabilization Bill #1796';
      body = this.get('sponsorEmailBody');
    } else {
      subject = 'Sponsor #FairRentNYC Commercial Rent Stabilization Bill #1796';
      body = this.get('nonSponsorEmailBody');
    }

    let url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return url;
  }),

});
