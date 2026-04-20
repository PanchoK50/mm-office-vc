export const SPACES_FILLED = 0;
export const SPACES_TOTAL = 4;
export const PRICE_PER_SPACE = 7500;

// TODO: replace with real bank details before launch.
export const BANK_DETAILS = {
  recipient: "Manage & More e.V.",
  iban: "DE00 0000 0000 0000 0000 00",
  bic: "XXXXDEXXXXX",
  bank: "— placeholder —",
  reference: "MM-INCUBATOR-<YOUR-LASTNAME>",
};

type JoinerProfile = { kind: "profile"; url: string };
type JoinerPost = { kind: "post"; postId: string };

export const JOINERS: Array<{
  name: string;
  tag: string;
  line: string;
  linkedin: JoinerProfile | JoinerPost;
}> = [
  {
    name: "Matthias Wolf",
    tag: "Pairio · YC P26",
    line: "Just got into YC with Pairio (P26).",
    linkedin: {
      kind: "profile",
      url: "https://www.linkedin.com/in/matthias-wolf/",
    },
  },
  {
    name: "Henry Weigt",
    tag: "EWOR",
    line: "EWOR Fellow",
    linkedin: {
      kind: "profile",
      url: "https://www.linkedin.com/in/henryweigt/",
    },
  },
  {
    name: "Almo Sutedjo",
    tag: "Y Combinator",
    line: "Recently into YC.",
    linkedin: {
      kind: "profile",
      url: "https://www.linkedin.com/in/almo-sutedjo/",
    },
  },

  {
    name: "Jochen Madler",
    tag: "YC · Sitefire",
    line: "Building Sitefire through Y Combinator, a candidate to move into the incubator.",
    linkedin: { kind: "post", postId: "7435006185210249216" },
  },
];

export const RECENT_WINS: Array<{
  name: string;
  tag: string;
  postId: string;
}> = [
  {
    name: "Vladi — Lio",
    tag: "a16z",
    postId: "7435665916002099200",
  },
  {
    name: "Uplane — Marvin Abdel-Massih",
    tag: "Raise announcement",
    postId: "7450867313920270336",
  },
  {
    name: "Sitegeist — Nicola Kolb",
    tag: "Raise announcement",
    postId: "7431740895386914816",
  },
  {
    name: "Certhub",
    tag: "Raise announcement",
    postId: "7425578806754762753",
  },
];

export const HACK_NATION_POST_ID = "7449742571863638016";

export const DEMO_DAY = [
  {
    stage: "1st semester",
    label: "Business Design Deep Dive",
  },
  {
    stage: "2nd & 3rd semester",
    label: "Startup Projects",
  },
  {
    stage: "Alumni",
    label: "Founder pitches",
  },
];
