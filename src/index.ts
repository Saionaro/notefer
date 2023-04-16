import { DIMENSIONS } from "./tracker";
import "./index.css";

const GAP = 6;
const CHECK_INTERVAL = 500;
const DEFAULT_LIFETIME = 5000;
const INTERVAL_DEFAULT_ID = -1;
const CLASSNAMES = {
  CONTAINER: "notefer",
  UNIT: "notefer__unit",
  UNIT_HOVERED: "notefer__unit--hovered",
  TITLE: "notefer__title",
  TEXT: "notefer__text",
  LIST: "notefer__list",
};

const addScale = (node: HTMLElement):void=>{
  if (!node.style.transform.includes('scale'))
    node.style.transform += 'scale(1.1)';
};

export interface Notification {
  /**
   * Notification title, short bold text
   */
  title: string;
  /**
   * Notification body, main content
   */
  text: string;
  /**
   * Notification lifetime, ms
   * @default 5000
   */
  lifetime?: number;
  /**
   * Additional classname to append to a single notification li
   */
  className?: string;
}

interface Meta extends Notification {
  id: string;
  node: HTMLElement;
  shift: number;
  timestamp: number;
}

export class Notefer {
  private notifications: Meta[] = [];
  private hoveredId: string|null = null;
  private toClearHover: Record<string, true> = {};
  private containerNode: HTMLElement|null = null;
  private listNode: HTMLUListElement|null = null;
  private checkInterval: number = INTERVAL_DEFAULT_ID;

  constructor() {
    this.clickHandler = this.clickHandler.bind(this);
    this.hoverHandler = this.hoverHandler.bind(this);
    this.leaveHandler = this.leaveHandler.bind(this);
  }

  push(notif: Notification | Notification[]): void {
    const toPush = Array.isArray(notif) ? notif : [notif];
    const listElement = this.getList();

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < toPush.length; i++) {
      fragment.appendChild(this.cookNotification(toPush[i], i));
    }

    listElement.appendChild(fragment);

    if (this.checkInterval===INTERVAL_DEFAULT_ID) {
      this.checkInterval = window.setInterval(
        this.clearTick.bind(this),
        CHECK_INTERVAL
      );
    }
  }

  private cookNotification(notif: Notification, index: number): HTMLElement {
    const node = this.createNotification(notif);
    const timestamp = Date.now();
    const meta: Meta = {
      ...notif,
      id: `${timestamp}_${index}`,
      node,
      timestamp,
      shift: 0,
    };

    node.dataset.id = meta.id;

    if (this.notifications.length) {
      const last = this.notifications[this.notifications.length - 1];
      meta.shift = last.shift + last.node.offsetHeight + GAP;
    }

    meta.node.style.transform += ` translateY(${meta.shift}px)`;
    this.notifications.push(meta);

    return node;
  }

  private clearTick(): void {
    const currentTime = Date.now();
    const toRemove: Record<number, true> = {};
    let shift = 0;

    for (let i = 0; i < this.notifications.length; i++) {
      const meta = this.notifications[i];
      const lifetime = meta.lifetime || DEFAULT_LIFETIME;
      const isStale = currentTime - meta.timestamp > lifetime;

      if (this.toClearHover[meta.id])
      {
        meta.node.classList.toggle(CLASSNAMES.UNIT_HOVERED, false);
        delete this.toClearHover[meta.id];
      }

      if (meta.id==this.hoveredId) {
        meta.node.classList.toggle(CLASSNAMES.UNIT_HOVERED, true)
        addScale(meta.node);
        if (!isStale) shift += meta.node.offsetHeight + GAP;
      } else if (isStale) {
        this.removeNotification(meta.node);
        toRemove[i] = true;
      } else {
        meta.shift = shift;
        meta.node.style.transform = `translateY(${shift}px)`;
        shift += meta.node.offsetHeight + GAP;
        if (meta.node.classList.contains(CLASSNAMES.UNIT_HOVERED))
        {
          this.toClearHover[meta.id] = true;
        }
      }
    }

    this.notifications = this.notifications.filter(
      (_, index) => !toRemove[index]
    );

    if (!this.notifications.length) {
      clearInterval(this.checkInterval);
      this.checkInterval = INTERVAL_DEFAULT_ID;
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

  private getList(): HTMLUListElement {
    let node = this.listNode;

    if (!node) {
      const container = this.getContainer();
      node = container.querySelector(`.${CLASSNAMES.LIST}`) as HTMLUListElement;
      this.listNode = node;
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
    node.addEventListener("mouseover", this.hoverHandler);
    node.addEventListener("mouseout", this.leaveHandler);
    document.body.appendChild(node);

    return node;
  }

  private createNotification(notif: Notification): HTMLElement {
    const node = document.createElement("li");

    node.classList.add(CLASSNAMES.UNIT);

    if (notif.className) {
      node.classList.add(notif.className);
    }

    const titleNode = document.createElement("h4");
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
    if (!(event.target instanceof Element)) return;
    const elem = event.target.closest(`.${CLASSNAMES.UNIT}`);

    if (elem instanceof HTMLElement) {
      this.hideNotif(elem.dataset.id as string);
    }
  }

  private hoverHandler(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;
    const elem = event.target.closest(`.${CLASSNAMES.UNIT}`);

    if (elem instanceof HTMLElement) {
      this.hoveredId = elem.dataset.id as string;
      // console.log('hoverHandler', elem.dataset.id)
    }
  }

  private leaveHandler(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;
    const elem = event.target.closest(`.${CLASSNAMES.UNIT}`);

    if (elem instanceof HTMLElement) {
      this.hoveredId = null;
      // console.log('leaveHandler', elem.dataset.id)
    }
  }

  private getNotif(id: string): Meta | void {
    for (const notif of this.notifications) {
      if (notif.id === id) {
          return notif;
      }
    }
  }

  private hideNotif(id: string): void {
    const notif = this.getNotif(id);
    if (notif)
    {
      notif.lifetime = 1;
    }
  }
}

let instance: Notefer | null = null;

export const pushNotification = (
  notification: Notification | Notification[]
): void => {
  if (!instance) {
    instance = new Notefer();
  }

  instance.push(notification);
};
