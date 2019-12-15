import Route from '@ember/routing/route';
import fetch from 'ember-fetch/ajax';
import { hash } from 'rsvp';

// import councilMembers from 'fairrentnyc/council-districts/district_data/cm_master_file_no_geo';
export default Route.extend({
  model(params) {
    let sponsorDistricts = [
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
    ];
    let promises = {
      districts: fetch('/council-districts/district_data/cm_master_file_no_geo.json'),
      photos: fetch('/s/photos.json'),
    };

    return hash(promises).then(function (results) {
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
      });
      return results;

    });

  },

});
