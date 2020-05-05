import { NanoNotif } from "../lib/NanoNotif.js";

document.addEventListener("DOMContentLoaded", function () {
  const nanoNotif = new NanoNotif();

  document.querySelector(".notif-maker").addEventListener("click", function () {
    nanoNotif.push({
      title: "Hi, man!",
      text: "How are you?",
    });
  });
  document
    .querySelector(".notif-maker2")
    .addEventListener("click", function () {
      nanoNotif.push({
        title: "I long",
        text: "How are you?",
        lifetime: 600000,
        className: "long-notif",
      });
    });
  document
    .querySelector(".notif-maker3")
    .addEventListener("click", function () {
      nanoNotif.push([
        {
          title: "I group!",
          text: "How are you?",
        },
        {
          title: "I group!",
          text: "How are you?",
        },
        {
          title: "I group!",
          text: "How are you?",
        },
      ]);
    });
});
