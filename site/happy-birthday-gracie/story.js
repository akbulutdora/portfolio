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
  bind: "",         // the button at the ending that opens the booklet
  coverTitle: "",   // printed on the booklet cover
};

const START = "scene1";

const STORY = {
  scene1: {
    art: "art/scene1.gif",
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
    art: "art/scene2.gif",
    text: (s) =>
      "gracie has taken the cake out of the oven. cake is in between them.\n\n" +
      'gracie says: "raging success"!\n\n' +
      'dory says: "it looks amazing! i\'m gonna get so fat!!!"' +
      (s.kissed ? "\n\ndory gives gracie a kiss" : ""),
    choices: [
      {
        label: "hehehe you'll still be so handsome",
        note: "this might make you sad, so choose the other option!!!",
        stay: true,
        set: { kissed: true },
        if: (s) => !s.kissed,
      },
      { label: "let's smoke a joint!!", to: "scene3" },
    ],
  },

  scene3: {
    art: "art/scene3.gif",
    text:
      "their eyes are red from having smoked a joint and dory is fat.\n\n" +
      'gracie: "that was so much fun!"\n\n' +
      'dory: "i am so fat now, bitch!!"',
    end: true,
    choices: [],
  },
};
