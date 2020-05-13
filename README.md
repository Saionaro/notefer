# notefer [![npm version](https://badge.fury.io/js/notefer.svg)](https://badge.fury.io/js/notefer) ![CI](https://github.com/Saionaro/notefer/workflows/CI/badge.svg?branch=master)

The lightweight beautiful notifications system

## Getting started

### Installation

First of all install the package via `NPM`:

`npm install notefer`

or `Yarn`:

`yarn add notefer`

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

```
interface Notification {
  title: string; // notification title
  text: string; // notification body

  lifetime?: number; // how long notification box should exist on the screen
  className?: string; // additional class name, applied to notif body
}
```
