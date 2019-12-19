import Route from '@ember/routing/route';
import store from '@ember-data/store';
import fetch from 'ember-fetch/ajax';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

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
            borough: photo.borough,
            neighborhood: photo.neighborhood,
            cssY: photo.cssY,
          },
          relationships: {
            district: {
              data: {
                type: 'district',
                id: photo.district,
              },
            },
          },

        };
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

      store.push({
        data: data,
      });

      return {
        photos: store.peekAll('photo'),
        districts: store.peekAll('district'),
        sponsorCount: results.sheets.sponsorhoods.length,
      };




      // return results;

    });

  },

});
