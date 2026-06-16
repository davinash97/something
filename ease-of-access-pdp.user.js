// ==UserScript==
// @name         ease-of-access-pdp
// @namespace    OrangeMonkey Scripts
// @version      1.0
// @description  Copy product title, description, and suggested nodes with the key 'a'
// @author       avidunna@
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
// @updateURL    https://github.com/davinash97/something/raw/refs/heads/master/ease-of-access-pdp.user.js
// @downloadURL  https://github.com/davinash97/something/raw/refs/heads/master/ease-of-access-pdp.user.js
// @run-at       document-end
// ==/UserScript==

"use strict";

(async () => {
  console.log("ease-of-access: start");
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-expanded="false"]').forEach((e) => {
      if (e)
        e.style.display = 'block'
    });
  })

  async function copyDetails() {
    const getText = (selector) =>
      document.querySelector(selector)?.outerText.trim() || "";

    return {
      title: getText('#productTitle'),
      bullets: getText('#feature-bullets'),
      description: getText("#productDescription"),
      information: getText("#prodDetails"),
      path: getText('.a-unordered-list.a-horizontal.a-size-small')
    };
  }

  async function pasteToCliboard(data) {
    return navigator.clipboard.writeText(data);
  }

  async function pasteAllTheData() {
    const { title, bullets, description, path, information } = await copyDetails();

    let result = "";

    if (title) {
      result += `Product Title: ${title}\n\n`;
    }

    if (bullets) {
      result += "Product Bullet: " + bullets.trim() + "\n\n";
    }

    if (description) {
      result += `${description.trim().replaceAll(/(Show more|About this item|›\s*See more product details|Product specifications|ASIN[\s\S]*?stars)/gi, "").replaceAll(/\s{2,}/g, " ").replaceAll(/(\(\d+\)\s*\d+(\.\d+)?\s*out of 5 stars)/g, "")}\n\n`;
    }

    if (information) {
      document.querySelectorAll('tr').forEach(async (el) => {
        // console.log(e.children[0].outerText); // 0 is key, 1 is value
        if (el.children.length >= 2) {
          let key = el.children[0].innerText || el.children[0].textContent;
          let value = el.children[1].innerText || el.children[1].textContent;

          if (key === 'Best Sellers Rank' || key === 'Customer Reviews' || key === 'Feedback' || key === 'Warranty') return;

          if (key && value) {
            result += `${key.trim()}: ${value.trim()}\n`; // Added newlines for readability
          }
        }
      })
    };

    // if (information) {
    //   // result += `${information}\n\n`;
    //   document.querySelectorAll('#prodDetails > .a-row > .a-column.a-span-last > #productDetails_expanderSectionTables > .a-row > *').forEach((e) => {
    //     if (e.outerText.includes('Best Sellers Rank')) return;
    //     // console.log(e);
    //     result += `${e.outerText.trim()}\n\n`;
    //   });
    // }

    if (path) {
      result += "\nSuggested Path: " + path.replaceAll(/(copy)/g, "").replaceAll(/(\n)?(\d)?/g, "").replaceAll(/›/g, " $& ");
    }

    await pasteToCliboard(result);

    console.log("Copied product details!");
  }

  document.addEventListener('keydown', async (event) => {
    if (event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const active = document.activeElement;

    // Allow typing in Amazon editors/inputs
    if (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable ||
      active.closest('[role="textbox"]') ||
      active.closest('[contenteditable="true"]')
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    switch (key) {
      case "a": {
        event.preventDefault();
        pasteAllTheData();
      }
        break;
      case "l": {
        const not_need = window.location.search;
        await pasteToCliboard(window.location.href.replaceAll(not_need, ""));
        console.log("Copied product link!");
      }
        break;
      default:
        break;
    }
  })
  console.log("ease-of-access: end")
}
)()
