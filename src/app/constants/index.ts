// constants/index.ts

export interface SlideshowClip {
  name: string;
  title: string;
  story: string;
}

export const SLIDESHOW_CLIPS: SlideshowClip[] = [
  {
    name: "DiveOutplay",
    title: "Dive Outplay",
    story:
      "This match was the lower bracket finals to qualify for the North American Champions League(Professional League). On the verge of elimination, I outplayed the enemy by drawing their pressure, and burning their time and resources while even securing a kill. This allowed my team to secure key objectives across the map.",
  },
  {
    name: "GankOutplay",
    title: "Gank Outplay",
    story:
      "In a really tough series vs the tournament favorites in the upper bracket finals, I baited the enemy mid and jungle callapse and outplayed it to secure a kill and an early game lead",
  },
  {
    name: "GankOutplay2",
    title: "Gank Outplay 2",
    story:
      "Survived and outplayed multiple members of the enemy team securing an early game lead for my team.",
  },
  {
    name: "QuadraKill",
    title: "Quadra Kill",
    story:
      "Secured a Quadra Kill in a crucial teamfight vs the tournament favorites in a high-stakes elimination match.",
  },
  {
    name: "Shockwave",
    title: "Shockwave",
    story:
      "'XiaoDanny Shockwave will find them all!' With our backs against the wall, a perfectly timed ultimate secured victory for UCI Esports in a high-stakes elimination match.",
  },
  {
    name: "TeamfightWin",
    title: "Teamfight Win",
    story:
      "This teamfight was memorable for me because we fell really far behind against the tournament favorites. But with clean teamfight execution, we were able to turn the tide and secure a comeback victory.",
  },
  {
    name: "TeamfightWin2",
    title: "Teamfight Win 2",
    story:
      "One of the most memorable teamfights for me. We competed in the North American Challengers League Open Qualifier and went up against NA's #1 mid lane prospect, Evolved. With an amazing engage from our support, Kurulean, we clinch a vital series win to take us to the upper bracket finals.",
  },
];

export const TYPING_PHRASES = [
  "Coder",
  "Gamer",
  "Runner",
  "Lifter",
  "Thinker",
];

export const FUN_FACTS = [
  "I play midlane",
  "My current favorite champion is Taliyah",
  "My favorite pro-player is Zeka",
  "I beat T1 Faker in soloq",
  "I'm a Bjergsen fan",
  "I peaked 1100 LP in NA soloq",
];

export const NAV_LINKS = ["home", "about", "experience", "skills", "extras"] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/danieljcoyle/",
  github: "https://github.com/XiaoDanny",
  email: "danieljcoyle02@gmail.com",
} as const;
