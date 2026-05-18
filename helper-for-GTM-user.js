// ==UserScript==
// @name        helper-for-GTM-user
// @namespace   http://tampermonkey.net/
// @description Auto-redirect to Product Types tab
// @match       https://gt-manager.pk.amazon.dev/*
// @version     1.1
// @run-at		document-end
// @author      @avidunna
// ==/UserScript==

(function () {
    "use strict";

    function simulateClick(element) {
        ["mouseover", "mousedown", "mouseup", "click"].forEach((eventName) => {
            element.dispatchEvent(
                new MouseEvent(eventName, {
                    bubbles: true,
                    buttons: 1,
                })
            );
        });
    }

    function clickButton(name) {
        const btn = [...document.querySelectorAll("button")].find(
            (b) => b.innerText.trim() === name
        );

        if (btn) {
            console.log(`Clicking: ${name}`);
            simulateClick(btn);
        }
    }

    const product = "/producttype";
    const tabs = [
        "Overview",
        "Properties",
        "Refinements",
        "Aliases",
        "Lifecycle",
        "Selection",
        "Customizations",
        "Translations",
    ];

    let redirecting = false;
    let count = 0;
    function redirect() {
        if (redirecting) return;
        redirecting = true;

        const path = location.pathname.replace(/\/+$/, "");

        const BLOCKED_LIST = new Set(["/category/global/"]);

        if (BLOCKED_LIST.has(path)) {
            redirecting = false;
            return;
        }

        if (!path.endsWith(product)) {
            if (count <= 10) {
                clickButton("Product Types");
            } else {
                location.href = path + product;
            }
            count++;
            console.log(`Count is at ${count++}`);
        }

        setTimeout(() => {
            redirecting = false;
        }, 400);
    }

    async function pasteToClipboard(text) {

        await navigator.clipboard.writeText(text)
        console.log(`Copied: ${text}`);
    }


    document.addEventListener('DOMContentLoaded', () => {
      console.log('start');
      document.querySelectorAll('.bui-tag--compact').forEach((el) => {
        console.log(el.style.userSelect);
        el.style.userSelect = 'none';
      });
    });

    document.addEventListener("keydown", async (e) => {
        if (!e.isTrusted || e.isComposing) return;
        const key = e.key.toLowerCase();

      if(e.ctrlKey || e.altKey || e.shiftKey) return;

        switch (key) {
            case "l": {
                await pasteToClipboard(window.location.href);
                break;
            }
            case "a": {
              let nodePath = "";
              let nodeId = "";
              let productType = window.location.pathname.includes('producttypes');

              if(productType) {
                nodePath = document.querySelectorAll('.pt-path');
                nodeId = document.querySelectorAll(".pt-mapping-id");
              } else {
                nodePath = document.querySelectorAll('.path-notation');
                nodeId = document.querySelectorAll('[data-qa="column-id"]');
              }

                let result = "The available nodes for this marketplace are -\n";
            
                let n = 0;
                if(nodeId.length === nodePath.length) n = nodeId.length;
                for(let i = 0; i < n; i++) {
                  result += `${i+1}) ${nodeId[i].outerText.trim()} - ${nodePath[i].outerText.trim()}`;
                  if(i < n-1) {
                    result += "\n";
                  }
                }
              await pasteToClipboard(result);
            }
                break;
            // case "z": {
            //     const el = document.querySelector('[data-qa="retail-node-id"]').innerText;
            //     if(el)
            //       await pasteToClipboard(el);
            //     break;
            // }
            default:
                break;
        }
    });
    console.log("[GTM Script Status]: Script Loaded")
})();
