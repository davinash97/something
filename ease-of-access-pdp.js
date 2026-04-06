// ==UserScript==
// @name         ease-of-access-pdp
// @namespace    OrangeMonkey Scripts
// @description  Get Node-ids for each nodes from parent to child and copy it to clipboard
// @author       avidunna
// @match        https://www.amazon.*/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.tr/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.cn/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.sa/*
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.eg/*
// @match        https://www.amazon.com.be/*
// @match        https://www.amazon.com.ng/*
// @match        https://www.amazon.co.za/*
// @match        http://www.amazon.ru/*
// @match        https://www.amazon.sg/*
// @updateURL    https://raw.githubusercontent.com/davinash97/something/refs/heads/master/ease-of-access-pdp.js
// @downloadURL  https://raw.githubusercontent.com/davinash97/something/refs/heads/master/ease-of-access-pdp.js
// @run-at       document-end
// ==/UserScript==

"use strict";

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
  })
  console.log("ease-of-access: end")
}
)()
