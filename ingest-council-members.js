const fs = require("fs");
const { log } = console;
const rawData = require("./node_modules/council-districts/district_data/cm_master_file_no_geo.json");

let data = [];

let updates = {
  "Andrew Cohen": {
    id: 11,
    district: 11,
    council_member: {
      person_id: "7624",
      councildist: "NYCC11",
      last_name: "Dinowitz",
      first_name: "Eric",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-11.jpg",
      facebook_url: "https://www.facebook.com/EricDinowitzNYCity",
      twitter_url: "https://twitter.com/ericdinowitz",
      twitter_handle: "ericdinowitz",
      instagram_url: "https://www.instagram.com/ericdinowitznyc/",
      instagram_handle: "ericdinowitznyc",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-11",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7624,
      PersonGuid: "D45A07AD-97F3-4C8A-AE2B-E3F9906EC4AA",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpEs=",
      PersonFullName: "Eric Dinowitz",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1:
        "277 West 231st Street, 10463\r\nPhone (718) 549-7300\r\nFax (718) 549-9945\r\n\r\n",
      PersonCity1: "Bronx",
      PersonState1: "NY",
      PersonZip1: "10463",
      PersonPhone: "718-549-7300",
      PersonFax: "718-549-9945",
      PersonEmail: "dinowitz@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d11/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 18th Floor - Suite 1868",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-7080",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Andy L. King": {
    id: 12,
    district: 12,
    council_member: {
      person_id: "7613",
      councildist: "NYCC12",
      last_name: "Riley",
      first_name: "Kevin",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-12.jpg",
      facebook_url: "https://www.facebook.com/kevin.riley.7528610",
      twitter_url: "https://twitter.com/KevinCRiley",
      twitter_handle: "KevinCRiley",
      instagram_url: "https://www.instagram.com/kevincriley/",
      instagram_handle: "kevincriley",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-12",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7613,
      PersonGuid: "960D5A27-73A3-4C1D-8BD6-C93A086C48E8",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpIM=",
      PersonFullName: "Kevin Riley",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1:
        "940 East Gunhill Road\r\nBronx, NY 10469\r\nPhone (718) 684-5509\r\n\r\n135 Einstein Loop, Room 44\r\nBronx, NY 10475\r\nPhone (347) 326-8652\r\n\r\n",
      PersonCity1: "Bronx",
      PersonState1: "NY",
      PersonZip1: "10469",
      PersonPhone: "718-684-5509",
      PersonFax: "212-788-8954",
      PersonEmail: "District12@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d12/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1770",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-6873",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Ritchie J. Torres": {
    id: 15,
    district: 15,
    council_member: {
      person_id: "7640",
      councildist: "NYCC15",
      last_name: "Feliz",
      first_name: "Oswald",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-15.jpg",
      facebook_url: "https://www.facebook.com/OswaldFeliz78",
      twitter_url: "https://twitter.com/oswaldfeliz",
      twitter_handle: "oswaldfeliz",
      instagram_url: "https://www.instagram.com/oswaldfeliz/",
      instagram_handle: "oswaldfeliz",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-15",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7640,
      PersonGuid: "7BFFE9BE-5692-478F-A422-5FB63A634749",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpNg=",
      PersonFullName: "Oswald Feliz",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1: "573 E. Fordham Road",
      PersonCity1: "Bronx",
      PersonState1: "NY",
      PersonZip1: "10458",
      PersonPhone: "718-842-8100",
      PersonFax: "347-597-8570",
      PersonEmail: "District15@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d15/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1759",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-6966",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Costa G. Constantinides": {
    id: 22,
    district: 22,
    council_member: {
      person_id: "7627",
      councildist: "NYCC22",
      last_name: "22",
      first_name: "District",
      photo_url:
        "https://raw.githubusercontent.com/mathiasbynens/small/master/png-transparent.png",
      facebook_url: "",
      twitter_url: "",
      twitter_handle: "",
      instagram_url: "",
      instagram_handle: "",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-22",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7627,
      PersonGuid: "3C7043B6-E22F-4EB9-B4CD-805FEAB92B68",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpE8=",
      PersonFullName: "District 22",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1: "31-09 Newtown Ave., Suite 209, Astoria",
      PersonCity1: "Queens",
      PersonState1: "NY",
      PersonZip1: "11102",
      PersonPhone: "718 274-4500",
      PersonFax: "646-661-6799",
      PersonEmail: "district22@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d22/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1778",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-6963",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Rory I. Lancman": {
    id: 24,
    district: 24,
    council_member: {
      person_id: "7633",
      councildist: "NYCC24",
      last_name: "Gennaro",
      first_name: "James",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-24.jpg",
      facebook_url: "https://www.facebook.com/cmgennaro",
      twitter_url: "https://twitter.com/jimgennaro",
      twitter_handle: "jimgennaro",
      instagram_url: "",
      instagram_handle: "",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-24",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7633,
      PersonGuid: "8423EA77-8814-4539-8DCC-9BDC963AC351",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpI8=",
      PersonFullName: "James F. Gennaro",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1: "78-40 164th Street, Suite BB, Hillcrest",
      PersonCity1: "Queens",
      PersonState1: "NY",
      PersonZip1: "11366",
      PersonPhone: "718-217-4969",
      PersonFax: "347-561-6116",
      PersonEmail: "District24@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d24/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1773",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-6956",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Donovan J. Richards": {
    id: 31,
    district: 31,
    council_member: {
      person_id: "7617",
      councildist: "NYCC31",
      last_name: "Brooks-Powers",
      first_name: "Selvena",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-31.jpg",
      facebook_url: "https://www.facebook.com/selvena.brooks",
      twitter_url: "https://twitter.com/Powers4Queens",
      twitter_handle: "Powers4Queens",
      instagram_url: "https://www.instagram.com/cmselvenabrookspowers/",
      instagram_handle: "cmselvenabrookspowers",
      party: "democrat",
      title: "council-member",
      gender: "female",
      city_council_url: "https://council.nyc.gov/district-31",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7617,
      PersonGuid: "32749AA8-E77F-4065-A7B8-FC357CFAEBA9",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpL0=",
      PersonFullName: "Selvena N. Brooks-Powers",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1:
        "234-26A Merrick Blvd., Laurelton \r\nPhone (718) 527-4356\r\nFax (718) 527-4402\r\n\r\n19-31 Mott Avenue, Suite 410, Far Rockaway\r\nPhone (718) 471-7014\r\nFax (718) 327-4794",
      PersonCity1: "Queens",
      PersonState1: "NY",
      PersonZip1: "11422",
      PersonPhone: "718-527-4356",
      PersonFax: "718-527-4402",
      PersonEmail: "District31@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d31/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1731",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-7216",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Rafael L. Espinal, Jr.": {
    id: 37,
    district: 37,
    council_member: {
      person_id: "7630",
      councildist: "NYCC37",
      last_name: "Diaz",
      first_name: "Darma",
      photo_url:
        "https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-37.jpg",
      facebook_url: "https://www.facebook.com/darma37cd",
      twitter_url: "https://twitter.com/DarmaVDiaz2",
      twitter_handle: "DarmaVDiaz2",
      instagram_url: "https://www.instagram.com/darmavdiaz37cd/",
      instagram_handle: "darmavdiaz37cd",
      party: "democrat",
      title: "council-member",
      gender: "female",
      city_council_url: "https://council.nyc.gov/district-37",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7630,
      PersonGuid: "3DC47628-A60D-4259-A898-7FF24CC4D9D8",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpGc=",
      PersonFullName: "Darma V. Diaz",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1: "1945 Broadway, 11207",
      PersonCity1: "Brooklyn",
      PersonState1: "NY",
      PersonZip1: "11207",
      PersonPhone: "718-642-8664",
      PersonFax: "718-889-6017",
      PersonEmail: "District37@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d37/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 17th Floor - Suite 1754",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-7284",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  },
  "Chaim M. Deutsch": {
    id: 48,
    district: 48,
    council_member: {
      person_id: "7629",
      councildist: "NYCC48",
      last_name: "48",
      first_name: "District",
      photo_url:
        "https://raw.githubusercontent.com/mathiasbynens/small/master/png-transparent.png",
      facebook_url: "",
      twitter_url: "",
      twitter_handle: "",
      instagram_url: "",
      instagram_handle: "",
      party: "democrat",
      title: "council-member",
      gender: "male",
      city_council_url: "https://council.nyc.gov/district-48",
      city_council_committees_url:
        "http://legistar.council.nyc.gov/Departments.aspx",
      city_council_legislation_url:
        "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_council_calendar_url:
        "https://legistar.council.nyc.gov/Calendar.aspx",
      PersonId: 7629,
      PersonGuid: "4DA5F7B1-900F-4C5B-93D5-B63877028FCB",
      PersonLastModifiedUtc: "2015-08-25T15:57:04.463",
      PersonRowVersion: "AAAAAOXGpFs=",
      PersonFullName: "District 48",
      PersonActiveFlag: 1,
      PersonUsedSponsorFlag: 0,
      PersonAddress1: "2401 Avenue U, 1st Floor",
      PersonCity1: "Brooklyn",
      PersonState1: "NY",
      PersonZip1: "11229",
      PersonPhone: "718-368-9176",
      PersonFax: "718-368-9160",
      PersonEmail: "district48@council.nyc.gov",
      PersonWWW: "http://council.nyc.gov/d48/html/members/home.shtml",
      PersonAddress2: "250 Broadway - 18th Floor - Suite 1820",
      PersonCity2: "New York",
      PersonState2: "NY",
      PersonZip2: "10007",
      PersonPhone2: "212-788-7360",
      PersonFax2: "",
      PersonEmail2: "",
      PersonWWW2: ""
    }
  }
};

rawData.forEach(district => {
  delete district.council_member.committees;
  if (district.council_member.PersonFullName in updates) {
    data.push(updates[district.council_member.PersonFullName]);
  } else {
    data.push(district);
  }
});
log(data);
fs.writeFileSync("./public/s/districts.json", JSON.stringify(data));
