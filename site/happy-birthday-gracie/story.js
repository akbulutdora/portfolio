/* The story. Dora writes every word here.
   Placeholder text SHOUTS on purpose so none of it can survive by accident.

   A node:
     art      string, or (state) => string           optional
     alt      string, alt text for the art           optional
     text     string, or (state) => string           "\n\n" splits paragraphs,
                                                      inline HTML is allowed
     end      true on the last node                  optional
     choices  array, in the order they appear

   A choice:
     label    string, or (state) => string
     to       node id, or (state) => node id         omit when stay is true
     set      { flag: value } written before the next render
     if       (state) => boolean, hides the choice when false
     stay     true keeps you on the same node and rewrites its text
*/

const START = "gate";

const STORY = {
  gate: {
    art: "art/gate.gif",
    alt: "ALT TEXT HERE",
    text: "NODE TEXT HERE.\n\nA SECOND PARAGRAPH HERE.",
    choices: [
      // a probe: sets a flag, rewrites this node, then hides itself
      { label: "PROBE CHOICE HERE", stay: true, set: { lookedUp: true },
        if: (s) => !s.lookedUp },
      { label: "CHOICE ONE HERE", to: "hall", set: { lantern: true } },
      { label: "CHOICE TWO HERE", to: "hall" },
    ],
  },

  hall: {
    art:  (s) => s.lantern ? "art/hall-lit.gif" : "art/hall-dark.gif",
    text: (s) =>
      "NODE TEXT HERE." +
      (s.lantern ? "\n\nEXTRA LINE WHEN THE FLAG IS SET." : "") +
      (s.lookedUp ? "\n\nEXTRA LINE FOR THE PROBE." : ""),
    choices: [
      { label: "GATED CHOICE HERE", to: "ending", if: (s) => s.lantern },
      { label: "CHOICE HERE", to: "ending" },
    ],
  },

  ending: {
    art: "art/ending.gif",
    text: "ENDING TEXT HERE. EVERY PATH ARRIVES AT THIS NODE.",
    end: true,
    choices: [],
  },
};
