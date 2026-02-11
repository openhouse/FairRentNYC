const TIMELINE_ERAS = [
  {
    id: "present-2025",
    anchorId: "era-present-2025",
    isPresentEra: true,
    years: "2025–Present",
    headline: "Commercial Rent Stabilization in Albany + City Hall",
    summary:
      "The current campaign runs parallel bill tracks in Albany and NYC Council so both chambers can move in public view.",
    billTracks: [
      {
        id: "nys-track",
        jurisdiction: "New York State",
        chamber: "Assembly + Senate",
        billNumber: "A5568A / S8319",
        shortTitle: "Statewide Commercial Rent Stabilization",
        officialUrl: "https://www.nysenate.gov/legislation/bills/2025/A5568/amendment/A",
        statusText: "Active in Albany",
        ctas: [
          {
            label: "Read Assembly Bill",
            url: "https://www.nysenate.gov/legislation/bills/2025/A5568/amendment/A",
          },
          {
            label: "Read Senate Bill",
            url: "https://www.nysenate.gov/legislation/bills/2025/S8319",
          },
        ],
      },
      {
        id: "nyc-track",
        jurisdiction: "NYC Council",
        chamber: "City Council",
        billNumber: "Updated NYC Intro (expected)",
        shortTitle: "Parallel NYC Council Track",
        officialUrl: "https://council.nyc.gov",
        statusText: "Preparation + coalition organizing",
        ctas: [
          {
            label: "Track Council Updates",
            url: "https://council.nyc.gov/legislation/",
          },
          {
            label: "Join Campaign Email List",
            url: "#join",
          },
        ],
      },
    ],
    pressLinks: [
      {
        outlet: "Campaign update",
        title: "Albany + Council synchronized strategy update",
        url: "https://fairrentnyc.com",
      },
    ],
    coalitionLinks: [
      {
        name: "NYC Artist Coalition",
        url: "https://instagram.com/nycartcofficial",
      },
    ],
  },
  {
    id: "2022-2024-intro-93",
    anchorId: "era-2022-2024-intro-93",
    isPresentEra: false,
    years: "2022–2024",
    headline: "Intro 93",
    archiveLabel: "Archive section — support listings shown as-of this era only.",
    summary:
      "Second modern NYC Council CRS cycle centered on Intro 93, including renewed coalition outreach and press education.",
    billTracks: [
      {
        id: "intro-93",
        jurisdiction: "NYC Council",
        chamber: "City Council",
        billNumber: "Intro 93",
        shortTitle: "Commercial Rent Stabilization (2022 cycle)",
        officialUrl: "https://legistar.council.nyc.gov/LegislationDetail.aspx?ID=6018106&GUID=7D2B6C57-6184-4C8E-B9FC-2FE0D860A7F7",
        statusText: "Archived advocacy cycle",
        ctas: [
          {
            label: "View Intro 93 record",
            url: "https://legistar.council.nyc.gov/LegislationDetail.aspx?ID=6018106&GUID=7D2B6C57-6184-4C8E-B9FC-2FE0D860A7F7",
          },
        ],
      },
    ],
    pressLinks: [
      {
        outlet: "Crain's New York",
        title: "Coverage archive (2022–2024 period)",
        url: "https://www.crainsnewyork.com/",
      },
      {
        outlet: "AMNY",
        title: "Community business displacement reporting",
        url: "https://www.amny.com/",
      },
    ],
    coalitionLinks: [
      {
        name: "Coalition roster archived for 2022–2024",
        url: "#",
      },
    ],
    artifacts: [
      {
        title: "CRS report + policy framing",
        date: "2023",
        type: "PDF",
        url: "https://drive.google.com/file/d/1sx7BJ6DKLxD6SI9usWs-ZDcdgFAgrF_8/view?usp=sharing",
      },
    ],
  },
  {
    id: "2019-2021-intro-1796",
    anchorId: "era-2019-2021-intro-1796",
    isPresentEra: false,
    years: "2019–2021",
    headline: "Intro 1796",
    archiveLabel: "Archive section — sponsors, coalition partners, and press reflect 2019–2021 only.",
    summary: "First modern NYC Council CRS cycle and the current public archive baseline.",
    renderMode: "legacy-2019",
  },
];

export default TIMELINE_ERAS;
