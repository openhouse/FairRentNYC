import Route from '@ember/routing/route';
import store from '@ember-data/store';
import fetch from 'ember-fetch/ajax';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

// import councilMembers from 'fairrentnyc/council-districts/district_data/cm_master_file_no_geo';
export default Route.extend({
  store: service(),
  sponsorDistricts: [
    33,
    16,
    34,
    8,
    37,
    39,
    1,
    26,
    25,
    5,
  ],
  model(params) {
    let store = this.get('store');
    let sponsorDistricts = this.get('sponsorDistricts');
    let promises = {
      districts: fetch('/council-districts/district_data/cm_master_file_no_geo.json'),
      photos: fetch('/s/photos.json'),
    };

    return hash(promises).then(function (results) {
      let data = [];
      results.sponsorDistricts = sponsorDistricts;
      results.districts.forEach((district)=> {
        if (sponsorDistricts.includes(district.district)) {
          district.isSponsor = true;
          district.sponsorOrder = sponsorDistricts.indexOf(district.district);
        } else {
          district.isSponsor = false;
        }

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
            isSponsor: district.isSponsor,
            sponsorOrder: district.sponsorOrder,
          },
        };
        data.push(dataItem);

      });

      results.photos.forEach((photo)=> {
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

      store.push({
        data: data,
      });
      return {
        photos: store.peekAll('photo'),
        districts: store.peekAll('district'),
      };




      // return results;

    });

  },

});
