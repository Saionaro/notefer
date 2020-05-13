# notefer [![npm version](https://badgen.net/npm/v/notefer)](https://www.npmjs.com/package/notefer) ![CI](https://github.com/Saionaro/notefer/workflows/CI/badge.svg?branch=master) [![minzip](https://badgen.net/bundlephobia/minzip/notefer)](https://bundlephobia.com/result?p=notefer) [![license](https://badgen.net/github/license/micromatch/micromatch)]()

The lightweight notifications system UI

[DEMO](https://saionaro.github.io/notefer/)

## Getting started

### Installation

First of all install the package:

`NPM`: `npm install notefer`

`Yarn`: `yarn add notefer`

### Import and usage

Then you can import required things and send notifications

```js
import { pushNotification } from "notefer";
import "notefer/lib/index.css";

pushNotification({
  title: "Direct Message",
  text: "Alex: How are you?",
});
```

## Options

### `pushNotification(notification: Notification | Notification[]): void`

```ts
interface Notification {
  title: string; // notification title
  text: string; // notification body

  lifetime?: number; // how long notification box should exist on the screen
  className?: string; // additional class name, applied to notif body
}
```
