import Route from '@ember/routing/route';
import store from '@ember-data/store';
import fetch from 'ember-fetch/ajax';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { isPresent } from '@ember/utils';

export default Route.extend({
  store: service(),

  model(params) {
    let self = this;
    let store = this.get('store');
    let sponsorDistricts = this.get('sponsorDistricts');
    let promises = {
      districts: fetch('/council-districts/district_data/cm_master_file_no_geo.json'),
      sheets: fetch('/s/sheets.json'),
    };

    return hash(promises).then(function (results) {
      let data = [];
      results.districts.forEach((district)=> {
        district.photoUrl = `/s/city-council/district-${district.district}.jpg`;
        delete district.council_member.committees;
        let dataItem = {
          type: 'district',
          id: district.id,
          attributes: {
            districtNumber: district.district,
            firstName: district.council_member.first_name,
            lastName: district.council_member.last_name,
            remotePhotoUrl: district.council_member.photo_url,
            facebookUrl: district.council_member.facebook_url,
            twitterUrl: district.council_member.twitter_url,
            twitterHandle: district.council_member.twitter_handle,
            instagram_url: district.council_member.instagram_url,
            instagramHandle: district.council_member.instagram_handle,
            party: district.council_member.party,
            title: district.council_member.title,
            gender: district.council_member.gender,
            cityCouncilUrl: district.council_member.city_council_url,
            fullName: district.council_member.PersonFullName,
            phone1: district.council_member.PersonPhone,
            email: district.council_member.PersonEmail,
            phone2: district.council_member.PersonPhone2,
            photoUrl: district.photoUrl,
          },
        };
        data.push(dataItem);

      });

      results.sheets.photos.forEach((photo)=> {
        let dataItem = {
          type: 'photo',
          id: photo.flickrId,
          attributes: {
            districtPriority: photo.districtPriority,
            address: photo.address,
            x: photo.x,
            y: photo.y,
            photoUrl: photo.photoUrl,
            photoUrlAllForLocation: photo.photoUrlAllForLocation,
            overallPhotoRank: photo.overallPhotoRank,
            normalizedPhotoRank: photo.normalizedPhotoRank,
            display: photo.display,
            photoLocationRankInDistrict: photo.photoLocationRankInDistrict,
            photoQualityRankingInDistrict: photo.photoQualityRankingInDistrict,
            businessName: photo.businessName,
            vacant: photo.vacant,
            personInPhoto: photo.personInPhoto,
            flickrId: photo.flickrId,
            sizes: photo.sizes,
            quote: photo.quote,
            rawQuoteMd: photo.quoteMd,
            rawQuoteSm: photo.quoteSm,
            rawQuoteXs: photo.quoteXs,
            shortQuote: photo.shortQuote,
            borough: photo.borough,
            neighborhood: photo.neighborhood,
            cssY: photo.cssY,
            display: photo.display,
            testimonial: photo.testimonial,
            testimonialRank: photo.testimonialRank,
            quoteName: photo.nameOfQuotePerson,
          },
        };
        if (isPresent(photo.district)) {
          dataItem.relationships = {
            district: {
              data: {
                type: 'district',
                id: photo.district,
              },
            },
          };
        }

        data.push(dataItem);
      });

      results.sheets.sponsorhoods.forEach((item)=> {
        let dataItem = {
          type: 'sponsorhood',
          id: item.id,
          attributes: {
            order: item.order,
          },
          relationships: {
            district: {
              data: {
                type: 'district',
                id: item.district,
              },
            },
          },

        };
        data.push(dataItem);
      });

      results.sheets.orgs.forEach((item)=> {
        let dataItem = {
          type: 'org',
          id: item.id,
          attributes: {
            name: item.name,
            order: item.order,
            url: item.url,
            hasLogo: item.hasLogo,
            active: item.active,
            // logo: item.logo,
          },
        };
        data.push(dataItem);
      });

      results.sheets.articles.forEach((item)=> {
        let dataItem = {
          type: 'article',
          id: item.id,
          attributes: {
            order: item.order,
            url: item.url,
            outlet: item.outlet,
            text: item.text,
            featured: item.featured,
            active: item.active,
            hasLogo: item.hasLogo,
          },
        };
        data.push(dataItem);
      });

      store.push({
        data: data,
      });

      return {
        photos: store.peekAll('photo'),
        districts: store.peekAll('district'),
        orgs: store.peekAll('org'),
        articles: store.peekAll('article'),
        sponsorCount: results.sheets.sponsorhoods.length,
      };




      // return results;

    });

  },

  title: 'Fair Rent NYC - Pass Commercial Rent Stabilization Bill 1796',
  project: 'Fair Rent NYC - Pass Commercial Rent Stabilization Bill 1796',
  description: 'Rent closes NYC spaces. Pass #FairRentNYC Commercial Rent Stabilization for diverse affordable neighborhoods.',
  // canonical: 'http://fairrentnyc.nycartc.com',
  canonical: 'http://dev51.nycartc.com',
  host: 'http://dev51.nycartc.com',
  image: '/s/img/fairrentnyc-og-image-10.jpg',

  headTags: Ember.computed('title', function () {
    let tags = [];
    tags.push({
      type: 'title',
      tagId: 'title-tag',
      content: this.get('title'),
    });
    tags.push({
      type: 'description',
      tagId: 'description-tag',
      content: this.get('description'),
    });

    tags.push({
      type: 'link',
      tagId: 'link-canonical-tag',
      attrs: {
        href: this.get('canonical'),
      },
    });

    tags.push({
      type: 'meta',
      tagId: 'meta-fb-app_id-tag',
      attrs: {
        property: 'fb:app_id',
        content: '1534813103259735',
      },
    });

    tags.push({
      type: 'meta',
      tagId: 'meta-og-locale-tag',
      attrs: {
        property: 'og:locale',
        content: 'en_US',
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-type-tag',
      attrs: {
        property: 'og:type',
        content: 'website',
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-title-tag',
      attrs: {
        property: 'og:title',
        content: this.get('project'),
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-description-tag',
      attrs: {
        property: 'og:description',
        content: this.get('description'),
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-url-tag',
      attrs: {
        property: 'og:url',
        content: this.get('canonical'),
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-site_name-tag',
      attrs: {
        property: 'og:site_name',
        content: this.get('title'),
      },
    });

    tags.push({
      type: 'meta',
      tagId: 'meta-og-image-tag',
      attrs: {
        property: 'og:image',
        content: `${this.get('host')}${this.get('image')}`,
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-image-width-tag',
      attrs: {
        property: 'og:image:width',
        content: 1200,
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-og-image-height-tag',
      attrs: {
        property: 'og:image:height',
        content: 630,
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-image-tag',
      attrs: {
        name: 'twitter:image',
        content: `${this.get('host')}${this.get('image')}`,
      },
    });

    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-card-tag',
      attrs: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-site-tag',
      attrs: {
        name: 'twitter:site',
        content: '@NYCArtC',
      },
    });

    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-creator-tag',
      attrs: {
        name: 'twitter:creator',
        content: '@NYCArtC',
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-title-tag',
      attrs: {
        name: 'twitter:title',
        content: this.get('project'),
      },
    });
    tags.push({
      type: 'meta',
      tagId: 'meta-twitter-description-tag',
      attrs: {
        name: 'twitter:description',
        content: this.get('description'),
      },
    });

    return tags;
  }),

});
