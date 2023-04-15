import faker from "faker";

import { pushNotification } from "../src/index.ts";
import "../src/index.css";

document.addEventListener("DOMContentLoaded", function () {
  let autoPlay = true;
  const maker1 = document.querySelector(".notif-maker--1");
  const maker2 = document.querySelector(".notif-maker--2");
  const maker3 = document.querySelector(".notif-maker--3");
  const start = document.querySelector(".start-autoplay");
  const stop = document.querySelector(".stop-autoplay");

  const spawners = [maker1, maker2, maker3];

  const spawnOne = () =>
    pushNotification({
      title: `New Comment`,
      text: `${faker.name.findName()}: ${faker.lorem.sentence()}`,
    });

  const spawnLong = () =>
    pushNotification({
      title: `Message: ${faker.name.findName()}`,
      text: `${faker.lorem.sentence()}`,
      lifetime: 10000,
      className: "long-notif",
    });

  const spawnThree = () =>
    pushNotification([
      {
        title: "Likes",
        text: `${faker.name.firstName()} ❤️ your post!`,
      },
      {
        title: "Likes",
        text: `${faker.name.firstName()} ❤️ your post!`,
      },
      {
        title: "Likes",
        text: `${faker.name.firstName()} ❤️ your post!`,
      },
    ]);

  const toggle = (switchOn) => {
    autoPlay = switchOn;

    for (const spawner of spawners) {
      spawner.classList.toggle("button--hidden", switchOn);
    }

    stop.classList.toggle("button--hidden", !switchOn);
    start.classList.toggle("button--hidden", switchOn);
  };

  maker1.addEventListener("click", spawnOne);
  maker2.addEventListener("click", spawnLong);
  maker3.addEventListener("click", spawnThree);
  start.addEventListener("click", () => toggle(true));
  stop.addEventListener("click", () => toggle(false));

  const things = [spawnOne, spawnLong, spawnThree];

  const tick = () => {
    if (autoPlay) {
      faker.helpers.randomize(things)();
    }
  };

  tick();
  setInterval(tick, 2000);
});
