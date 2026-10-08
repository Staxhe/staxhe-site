/* ==========================================================================
   STAXHE — SITE CONTENT
   --------------------------------------------------------------------------
   This is the only file you need to edit to change what the site says.
   Everything on the page (name, tagline, about, projects, "now", links)
   is read from the SITE object below.

   Conventions
   - placeholder: true   Shows a small dashed "placeholder" tag next to
                         that section's heading so unfinished copy is easy
                         to spot. Delete the line once it's real.
   - url: ""             An empty URL means "not available yet". Project
                         buttons without a URL render as a disabled
                         "Soon" button (or are hidden, see options below).
   - icon                One of the names listed in assets/icons.js
                         (youtube, github, x, instagram, discord, email,
                         googleplay, appstore, tiktok, twitch, bluesky,
                         threads, mastodon, reddit, telegram, kofi,
                         patreon, itchdotio, steam, link). You can also
                         paste raw SVG path data from simpleicons.org.

   The <title> and the social-preview <meta> tags live in index.html
   (crawlers do not run JavaScript). Update them there if the name or
   tagline changes.
   ========================================================================== */

window.SITE = {
  name: "Staxhe",
  tagline: "Independent developer turning real frustrations into apps, learning tools and games.",

  hero: {
    // Short line under the buttons. Set to "" to hide it.
    status: "Now building DopaGate and a Roblox game",
    primaryLabel: "See projects",
    secondaryLabel: "Links",
  },

  about: {
    paragraphs: [
      "Staxhe is the name I build under. I design and develop apps, learning tools and games on my own, from the first sketch to release.",
      "I'm less interested in turning my own ideas into products than in listening. The complaints people repeat and the things they wish existed are where my projects start.",
      "Right now that means DopaGate and a Roblox game. Next up is Noting App.",
    ],
  },

  /* Project status values:
       "concept"       idea stage
       "development"   being built
       "release-prep"  getting ready for release
       "beta"          public test
       "live"          released (only use once it really is out)
       "paused"        on hold
     Set statusLabel to override the text shown in the badge. */
  projects: [
    {
      name: "DopaGate",
      description:
        "A language-learning app for Android. In development and being prepared for its first release.",
      status: "release-prep",
      tags: ["Android", "Language learning"], // add your stack, e.g. "Kotlin"
      image: "", // e.g. "assets/img/dopagate.webp" (empty = neutral placeholder block)
      imageAlt: "",
      buttons: [
        { label: "Get it on Google Play", url: "", icon: "googleplay", primary: true },
        { label: "Learn more", url: "" },
      ],
    },
    {
      name: "Roblox game",
      description:
        "A co-op zombie survival shooter on Roblox: hold out against waves and special infected with your team.",
      status: "development",
      tags: ["Roblox", "Luau", "Co-op"],
      image: "",
      imageAlt: "",
      buttons: [],
    },
    {
      name: "Noting App",
      description:
        "Turns tasks and habits into an RPG-style progress loop, so getting things done feels like making progress in a game. My next project to ship.",
      status: "paused",
      statusLabel: "Up next",
      tags: ["Productivity", "Habits", "RPG mechanics"],
      image: "",
      imageAlt: "",
      buttons: [
        { label: "Learn more", url: "" },
      ],
    },
  ],

  now: {
    updated: "October 2026", // the month you last edited this list
    items: [
      { label: "DopaGate", text: "Getting it through Google Play review for its first release." },
      { label: "Roblox", text: "Building a co-op zombie survival game." },
      { label: "Next", text: "Shipping Noting App." },
    ],
  },

  /* Links: add, remove or reorder lines freely.
     The small grey line under each label is generated from the URL
     (e.g. "youtube.com/@name"); set note: "..." to write your own. */
  links: [
    { label: "YouTube", url: "https://www.youtube.com/@StaxheMinecraft", icon: "youtube" },
    { label: "Instagram", url: "https://www.instagram.com/staxhemc", icon: "instagram" },
    { label: "Discord", url: "https://discord.com/", icon: "discord", note: "Username: .staxhe" },
    { label: "Email", url: "mailto:staxhemc@gmail.com", icon: "email" },
  ],

  options: {
    // false = project buttons without a URL are hidden instead of shown as "Soon"
    showUnavailableButtons: true,
  },
};
