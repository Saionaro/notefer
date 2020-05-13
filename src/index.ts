import { CLASSNAMES } from "./classNames.js";
import { DIMENSIONS } from "./tracker.js";

const GAP = 4;
const CHECK_INTERVAL = 500;
const DEFAULT_LIFETIME = 5000;

export interface Notification {
  title: string;
  text: string;

  lifetime?: number;
  className?: string;
}

interface ExtendedNotification extends Notification {
  id: string;
  node: HTMLElement;
  shift: number;
  timestamp: number;
}

export class Notifer {
  private notifications: ExtendedNotification[] = [];
  private containerNode: HTMLElement = null;
  private checkInterval: number = null;

  constructor() {
    this.clickHandler = this.clickHandler.bind(this);
  }

  push(notif: Notification | Notification[]): void {
    const toPush = Array.isArray(notif) ? notif : [notif];
    const container = this.getContainer().querySelector(`.${CLASSNAMES.LIST}`);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < toPush.length; i++) {
      fragment.appendChild(this.cookNotification(toPush[i], i));
    }

    container.appendChild(fragment);

    if (!this.checkInterval) {
      this.checkInterval = window.setInterval(
        this.clearTick.bind(this),
        CHECK_INTERVAL
      );
    }
  }

  private cookNotification(notif: Notification, index: number): HTMLElement {
    const node = this.createNotification(notif);
    const timestamp = Date.now();
    const cloned: ExtendedNotification = {
      ...notif,
      id: `${timestamp}_${index}`,
      node,
      timestamp,
      shift: 0,
    };

    node.dataset.id = cloned.id;

    if (this.notifications.length) {
      const last = this.notifications[this.notifications.length - 1];
      cloned.shift = last.shift + last.node.offsetHeight + GAP;
    }

    cloned.node.style.transform += ` translateY(${cloned.shift}px)`;
    this.notifications.push(cloned);

    return node;
  }

  private clearTick(): void {
    const currentTime = Date.now();
    const toRemove: Record<number, true> = {};
    let shift = 0;

    for (let i = 0; i < this.notifications.length; i++) {
      const timeDelta = this.notifications[i].lifetime || DEFAULT_LIFETIME;

      if (currentTime - this.notifications[i].timestamp > timeDelta) {
        this.removeNotification(this.notifications[i].node);
        toRemove[i] = true;
      } else {
        this.notifications[i].shift = shift;
        this.notifications[i].node.style.transform = `translateY(${shift}px)`;
        shift += this.notifications[i].node.offsetHeight + GAP;
      }
    }

    this.notifications = this.notifications.filter(
      (_, index) => !toRemove[index]
    );

    if (!this.notifications.length) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private getContainer(): HTMLElement {
    let node = this.containerNode;

    if (!node) {
      node = this.createContainer();
      this.containerNode = node;
    }

    return node;
  }

  private removeNotification(elem: HTMLElement): void {
    elem.style.transform += ` translateX(${DIMENSIONS.shift})`;
    setTimeout(elem.remove.bind(elem), 1000);
  }

  private createContainer(): HTMLElement {
    const node = document.createElement("aside");
    const ul = document.createElement("ul");

    node.classList.add(CLASSNAMES.CONTAINER);
    ul.classList.add(CLASSNAMES.LIST);
    node.appendChild(ul);
    node.addEventListener("click", this.clickHandler);
    document.body.appendChild(node);

    return node;
  }

  private createNotification(notif: Notification): HTMLElement {
    const node = document.createElement("li");

    node.classList.add(CLASSNAMES.UNIT);

    if (notif.className) {
      node.classList.add(notif.className);
    }

    const titleNode = document.createElement("h2");
    const textNode = document.createElement("p");

    titleNode.classList.add(CLASSNAMES.TITLE);
    textNode.classList.add(CLASSNAMES.TEXT);

    titleNode.textContent = notif.title;
    textNode.textContent = notif.text;

    node.style.transform = `translateX(${DIMENSIONS.shift})`;

    node.appendChild(titleNode);
    node.appendChild(textNode);

    return node;
  }

  private clickHandler(event: MouseEvent): void {
    if (event.target instanceof Element) {
      const elem = event.target.closest(`.${CLASSNAMES.UNIT}`);

      if (elem instanceof HTMLElement) {
        this.hideNotif(elem.dataset.id);
      }
    }
  }

  private hideNotif(id: string): void {
    for (const notif of this.notifications) {
      if (notif.id === id) {
        notif.lifetime = 1;
        break;
      }
    }
  }
}

let instance: Notifer | null = null;

export const pushNotification = (
  notification: Notification | Notification[]
): void => {
  if (!instance) {
    instance = new Notifer();
  }

  instance.push(notification);
};
