import { pushNotification } from "../lib/index.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".notif-maker").addEventListener("click", function () {
    pushNotification({
      title: "Hi, man!",
      text: "How are you?",
    });
  });
  document
    .querySelector(".notif-maker2")
    .addEventListener("click", function () {
      pushNotification({
        title: "I long",
        text: "How are you?",
        lifetime: 600000,
        className: "long-notif",
      });
    });
  document
    .querySelector(".notif-maker3")
    .addEventListener("click", function () {
      pushNotification([
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
