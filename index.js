"use strict"

var a = require("markdown-it-toc");

function permalink (md) {
  var originalHeadingOpen = md.renderer.rules.heading_open

  md.renderer.rules.heading_open =   md.renderer.rules.heading_open = function(...args) {
    const [ tokens, idx, , , ] = args

    const attrs = tokens[idx].attrs = tokens[idx].attrs || []
    const anchor = tokens[idx + 1]._tocAnchor
    attrs.push([ "id", anchor ])

    if (options.anchorLink) {
    //   renderAnchorLink(anchor, options, ...args)
    }

    return originalHeadingOpen.apply(this, args)
  }


}

module.exports.activate = () => {
    return {
        extendMarkdownIt(md) {
            const highlight = md.options.highlight;
            md.use(permalink);


            md.options.highlight = (code, lang) => {
                if (lang && lang.toLowerCase() === 'mermaid') {
                    return `<div class="mermaid">${code}</div>`;
                }
                return highlight(code, lang);
            };
            return md;
        }
    }
}