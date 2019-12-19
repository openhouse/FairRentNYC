import Component from '@ember/component';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Component.extend({
  districtsSorting: ['sponsorOrder'],
  districtsSorted: sort('districts', 'districtsSorting'),
  sponsors: computed('districtsSorted.[]', function () {
    let districts = this.get('districtsSorted');
    let sponsors = [];
    districts.forEach((district) => {
      if (district.get('isSponsor')) {
        let sponsor = district;
        if (isPresent(sponsor.get('twitterHandle'))) {
          // member.href = `https://twitter.com/intent/tweet?text=%F0%9F%8F%86%20NYC%27s%20diverse%20dance%20cultures%20thank%20%40${member.twitter_handle}%20%26%20%40NYCCouncil%20for%20passing%20%23LetNYCDance%20Bill%201652%21%20http%3A%2F%2FLetNYCDance.org`;
          // member.href = `https://twitter.com/intent/tweet?text=%F0%9F%8F%86%20NYC%27s%20diverse%20community%20spaces%20thank%20%${member.twitter_handle}%20for%20supporting%20%23TalksNotRaids%20Bill%201156%21%20http%3A%2F%2FTalksNotRaids.com`;
          sponsor.href = `https://twitter.com/intent/tweet?text=%F0%9F%8F%86%20NYC%27s%20diverse%20community%20spaces%20thank%20%40NYCCouncil%20Member%20%40${sponsor.get('twitterHandle')}%20for%20supporting%20%23FairRentNYC%20Bill%201796%21&url=https%3A%2F%2FFairRentNYC.com`;
        } else {
          sponsor.href = sponsor.get('cityCouncilUrl');
        }

        sponsors.push(sponsor);

      }
    });
    return sponsors;
  }),

});
