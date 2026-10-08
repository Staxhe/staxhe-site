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
    status: "Now building DopaGate and Last Extraction",
    primaryLabel: "See projects",
    secondaryLabel: "Links",
  },

  about: {
    paragraphs: [
      "Staxhe is the name I build under. I design and develop apps, learning tools and games on my own, from the first sketch to release.",
      "I'm less interested in turning my own ideas into products than in listening. The complaints people repeat and the things they wish existed are where my projects start.",
      "Right now that means DopaGate and Last Extraction, a Roblox game. Next up is Noting App.",
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
        "Turns the urge to doomscroll into language practice. Before a distracting app opens, you translate one word in the language you're learning. Six languages, built for Android.",
      status: "release-prep",
      tags: ["Android", "Language learning", "React", "Capacitor"],
      image: "", // e.g. "assets/img/dopagate.webp" (empty = neutral placeholder block)
      imageAlt: "",
      buttons: [
        { label: "Get it on Google Play", url: "", icon: "googleplay", primary: true },
        { label: "Learn more", url: "" },
      ],
    },
    {
      name: "Last Extraction",
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
        "Turns real-life tasks and habits into an RPG. Earn XP and gold, level up your class, open chests and push through a 100-floor dungeon. My next project to ship.",
      status: "paused",
      statusLabel: "Up next",
      tags: ["Productivity", "Habits", "React", "Firebase"],
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
      { label: "Roblox", text: "Building Last Extraction, a co-op zombie survival game." },
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
    { label: "Email", url: "mailto:dev@staxhe.com", icon: "email" },
  ],

  options: {
    // false = project buttons without a URL are hidden instead of shown as "Soon"
    showUnavailableButtons: true,
  },
};
