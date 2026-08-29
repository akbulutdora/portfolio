/* Story 1: gracie makes a coconut cake.
   Every word below is Dora's, copied from content/story.md.

   A node:
     art      string, or (state) => string           optional
     alt      string, alt text for the art           optional
     text     string, or (state) => string           "\n\n" splits paragraphs.
                                                      A paragraph starting with
                                                      "gracie" prints in her
                                                      orange, one starting with
                                                      "dory" in his blue.
     end      true on the last node                  optional
     heading  true renders the text as a title       optional
     audio    { src, lines } puts a player under the text        optional
                lines: one entry per handwritten line of the poem,
                  { at: seconds, html: "<span class=\"hw__w\" ...></span> ..." }
                The line whose turn it is lights up while the audio plays.
                Empty lines: the player appears with nothing above it.
     choices  array, in the order they appear

   A choice:
     label    string, or (state) => string
     note     second line inside the button          optional
     to       node id, or (state) => node id         omit when stay is true
     set      { flag: value } written before the next render
     if       (state) => boolean, hides the choice when false
     stay     true keeps you on the same node and rewrites its text
*/

/* ---- words that appear on screen but are not part of a scene ----------
   Both are empty on purpose. Nothing renders while they are empty: no bind
   button, no title on the booklet cover. Write them and they appear. */
const UI = {
  // the button on the last node of the last story; it opens the booklet
  bind: "END. print this as a booklet!",
  // the button on the last node of any other story; use it as the label of a
  // choice that points at the next story's first node:
  //   choices: [{ label: UI.next, to: "story2scene1" }]
  next: "END. go to next story.",
  // printed on the booklet cover; blank prints nothing
  coverTitle: "gracie's birthday adventures with dory!",
  // the picture on the booklet cover. Not a story node, and not bound by the
  // 156x128 story canvas: it is sized by width with the height left to follow.
  coverArt: "art/scene-8-foreheads.png?v=dc02b75cec",
};

const START = "welcome";

const STORY = {
  /* The opening message. No art, so the text gets the whole card, and the card
     body already scrolls on its own however long the message runs. The button
     stays pinned at the bottom while she reads.
     Both strings are empty on purpose: nothing renders until Dora writes them. */
  welcome: {
    // The letter, in Dora's hand. Built by tools/build-letter.py from the two
    // cleaned pages; the words are alpha masks, so CSS colours them.
    text: LETTER.html,
    tail: LETTER.tail,
    // Where the letter breaks across booklet pages. A number starts a new page
    // at that paragraph; [paragraph, word] cuts inside one. Paragraph 5 is
    // taller than a whole page on its own, so it has to be cut somewhere.
    bookletBreaks: [3, 4, [5, 78], 6, 7],
    // The poem, read aloud, under the letter. lines stays empty until the
    // handwriting from page 2 is extracted and mapped to the word timings in
    // content/audio/poem-timings.json.
    audio: {
      src: "audio/poem.m4a?v=1e8ebec043",
      lines: POEM.lines,
    },
    // the letter runs long, so the button sits after it rather than pinned
    flow: true,
    choices: [
      { label: "let's go!", to: "title" },
    ],
  },

  /* The title page. It carries the same drawing and the same words as the
     booklet cover, so both come from UI and can never drift apart. */
  title: {
    art: UI.coverArt,
    text: UI.coverTitle,
    heading: true,
    // the booklet cover already carries this, so it is not printed twice
    noPrint: true,
    choices: [
      { label: "begin", to: "scene1" },
    ],
  },

  scene1: {
    art: "art/scene-1-kitchen.gif?v=28f94d5896",
    text:
      "they are in the kitchen. gracie is baking the cake. dory is sitting on the kitchen counter, hanging out. they are chatting with joy.\n\n" +
      "gracie: did you know that dogs bark??\n\n" +
      "dory: no they don't??!!",
    choices: [
      { label: "rolls eyes", to: "scene2", set: { rolledEyes: true } },
      { label: "yes they do!", to: "scene2" },
    ],
  },

  scene2: {
    art: "art/scene-2-cake.gif?v=7e27695351",
    text: (s) =>
      "gracie has taken the cake out of the oven. cake is in between them.\n\n" +
      "gracie: raging success!\n\n" +
      "dory: it looks amazing! i'm gonna get so fat!!!" +
      (s.kissed
        ? "\n\ngracie: hehehe you'll still be so handsome" +
          "\n\ndory gives gracie a kiss"
        : ""),
    choices: [
      {
        label: "hehehe you'll still be so handsome",
        stay: true,
        set: { kissed: true },
        if: (s) => !s.kissed,
      },
      { label: "let's smoke a joint!!", to: "scene3" },
    ],
  },

  scene3: {
    art: "art/scene-3-after.png?v=1be8af0d95",
    text:
      "their eyes are red from having smoked a joint and dory is fat.\n\n" +
      "gracie: that was so much fun!\n\n" +
      "dory: i am so fat now, bitch!!",
    choices: [
      { label: UI.next, to: "date" },
    ],
  },

  /* ---- story 2 ----------------------------------------------------- */

  date: {
    art: "art/scene-4-date.gif?v=76ed7de0ea",
    text:
      "gracie and dory are on a date, having wine together. gracie has beautiful colorful make up on.\n\n" +
      "gracie: do you like my dress? i got it from ireland!\n\n" +
      "dory: you have the longest hair ever so i can't see it! but i can't wait to take it off of you later tonight",
    choices: [
      { label: "gracie blushes", to: "beer" },
    ],
  },

  beer: {
    art: "art/scene-5-beer.gif?v=3a063d071b",
    text:
      "they are having beer now\n\n" +
      "gracie: i am getting drunk!\n\n" +
      "dory: i don't feel anything yet! i have to drink more!",
    choices: [
      { label: "let's walk home afterwards!", to: "street" },
      { label: "let's go dancing afterwards!", to: "club", set: { danced: true } },
    ],
  },

  club: {
    art: "art/scene-7-club.gif?v=be5133e6ae",
    text: "they're dancing at shacklewell arms. it's so much fun",
    choices: [
      { label: "they're getting tired. it's time to go home now.", to: "street" },
    ],
  },

  street: {
    art: "art/scene-6-street.gif?v=a0a9b2b86a",
    text:
      "they are on the street, it's a starry night.\n\n" +
      "dory: happy birthday gracie. i love you.\n\n" +
      "gracie: i love you too dory. thank you for tonight!\n\n" +
      "dory: you're welcome bitch!\n\n" +
      "they went home, and hung out for another BILLION HOURS!",
    end: true,
    choices: [],
  },
};
