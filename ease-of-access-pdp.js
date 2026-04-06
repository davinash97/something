// ==UserScript==
// @name         ease-of-access-pdp
// @namespace    OrangeMonkey Scripts
// @description  Get Node-ids for each nodes from parent to child and copy it to clipboard
// @author       avidunna
// @match        https://www.amazon.*/*
// @updateURL    
// @downloadURL
// @run-at       document-end
// ==/UserScript==

(() => {
  console.log("ease-of-access: start");
  function copyDetails() {
    const getText = (selector) =>
        document.querySelector(selector)?.innerText.trim() || "";

      return {
        title: getText('#productTitle'),
        bullets: getText('.a-normal.a-spacing-micro'),
        description: getText('#feature-bullets'),
        path: getText('.a-unordered-list')
      };
    }

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key.toLowerCase();

    if (key === "a") {
      event.preventDefault();

      const { title, bullets, description, path } = copyDetails();

      const text = `Product Title: ${title}\n\nProduct Bullets: ${bullets}\n\nProduct Description: ${description.replaceAll(/(Show more)?(About this item)?(›\s?\s?See more product details)?/g, "").trim()}\n\nSuggested Path: ${path.replaceAll(/\s/g, "").replaceAll(/›/g, " $& ").replaceAll(/\d/g, "")}`;

      navigator.clipboard.writeText(text);
      console.log("Copied product details!");
    }
  })}
 console.log("ease-of-access: end");
)()
