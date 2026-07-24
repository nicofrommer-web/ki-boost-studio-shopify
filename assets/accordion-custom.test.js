import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";

// jsdom does not implement window.matchMedia, and accordion-custom.js reads
// window.matchMedia('(min-width: 990px)') once at module-load time, so the
// mock has to be installed before the module is imported (dynamic import,
// after the mock is in place).
class FakeMediaQueryList extends EventTarget {
  constructor(matches) {
    super();
    this.matches = matches;
    this.media = "(min-width: 990px)";
  }
  addListener() {}
  removeListener() {}
}

let mql;

beforeAll(async () => {
  mql = new FakeMediaQueryList(false); // start "mobile" (< 990px)
  window.matchMedia = vi.fn(() => mql);
  await import("./accordion-custom.js");
});

function setViewport(isDesktop) {
  mql.matches = isDesktop;
}

function triggerBreakpointChange(isDesktop) {
  setViewport(isDesktop);
  mql.dispatchEvent(new Event("change"));
}

function createAccordion({ attrs = {}, contentHTML = "<p>Antwort-Inhalt</p>" } = {}) {
  const el = document.createElement("accordion-custom");
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = `
    <details>
      <summary>Frage</summary>
      <div>${contentHTML}</div>
    </details>
  `;
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  setViewport(false); // reset to mobile before each test
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("default open state", () => {
  it("opens by default on mobile when open-by-default-on-mobile is set", () => {
    setViewport(false);
    const el = createAccordion({ attrs: { "open-by-default-on-mobile": "" } });

    expect(el.querySelector("details").open).toBe(true);
  });

  it("stays closed on desktop when only open-by-default-on-mobile is set", () => {
    setViewport(true);
    const el = createAccordion({ attrs: { "open-by-default-on-mobile": "" } });

    expect(el.querySelector("details").open).toBe(false);
  });

  it("opens by default on desktop when open-by-default-on-desktop is set", () => {
    setViewport(true);
    const el = createAccordion({ attrs: { "open-by-default-on-desktop": "" } });

    expect(el.querySelector("details").open).toBe(true);
  });

  it("stays closed when no open-by-default attribute matches the current viewport", () => {
    setViewport(false);
    const el = createAccordion({ attrs: { "open-by-default-on-desktop": "" } });

    expect(el.querySelector("details").open).toBe(false);
  });

  it("re-evaluates the open state when the viewport crosses the breakpoint", () => {
    setViewport(false);
    const el = createAccordion({ attrs: { "open-by-default-on-mobile": "" } });
    const details = el.querySelector("details");

    expect(details.open).toBe(true);

    triggerBreakpointChange(true); // switch to desktop

    expect(details.open).toBe(false); // no open-by-default-on-desktop attribute
  });
});

describe("Escape key handling", () => {
  it("closes the accordion and refocuses the summary when close-with-escape is enabled", () => {
    const el = createAccordion({ attrs: { "data-close-with-escape": "true" } });
    const details = el.querySelector("details");
    const summary = el.querySelector("summary");
    details.open = true;

    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it("ignores Escape when close-with-escape is not enabled", () => {
    const el = createAccordion();
    const details = el.querySelector("details");
    details.open = true;

    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

    expect(details.open).toBe(true);
  });
});

describe("content click delegation", () => {
  it("closes the accordion when a click lands on an element marked data-accordion-close", () => {
    const el = createAccordion({
      contentHTML: '<button type="button" data-accordion-close>Schließen</button>',
    });
    const details = el.querySelector("details");
    const summary = el.querySelector("summary");
    details.open = true;

    el.querySelector("[data-accordion-close]").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it("does not close when the click target has no data-accordion-close ancestor", () => {
    const el = createAccordion({ contentHTML: "<p>Antwort-Inhalt</p>" });
    const details = el.querySelector("details");
    details.open = true;

    el.querySelector("p").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(details.open).toBe(true);
  });

  it("ignores data-accordion-close clicks while the accordion is already closed", () => {
    const el = createAccordion({
      contentHTML: '<button type="button" data-accordion-close>Schließen</button>',
    });
    const details = el.querySelector("details");
    details.open = false;

    el.querySelector("[data-accordion-close]").dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(details.open).toBe(false);
  });
});

describe("disable-on-mobile / disable-on-desktop click guard", () => {
  it("prevents the default summary toggle on mobile when disabled on mobile", () => {
    setViewport(false);
    const el = createAccordion({ attrs: { "data-disable-on-mobile": "true" } });

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    el.querySelector("summary").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("does not prevent the default summary toggle on desktop when only disabled on mobile", () => {
    setViewport(true);
    const el = createAccordion({ attrs: { "data-disable-on-mobile": "true" } });

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    el.querySelector("summary").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("prevents the default summary toggle on desktop when disabled on desktop", () => {
    setViewport(true);
    const el = createAccordion({ attrs: { "data-disable-on-desktop": "true" } });

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    el.querySelector("summary").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});

describe("disconnectedCallback cleanup", () => {
  it("stops reacting to breakpoint changes once removed from the DOM", () => {
    setViewport(false);
    const el = createAccordion({ attrs: { "open-by-default-on-mobile": "" } });
    const details = el.querySelector("details");
    expect(details.open).toBe(true);

    el.remove();
    triggerBreakpointChange(true); // would close it if the listener were still active

    expect(details.open).toBe(true);
  });
});
