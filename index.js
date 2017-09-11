"use strict"

var a = require("markdown-it-toc");

/*! ztree_toc - v0.2.2 - 2014-02-08
* https://github.com/i5ting/jQuery.zTree_Toc.js
* Copyright (c) 2014 alfred.sang; Licensed MIT */
function encode_id_with_array(opts, arr) {
    var result = 0;
    for (var z = 0; z < arr.length; z++) {
        result += factor(opts, arr.length - z, arr[z]);
    }

    return result;
}


/**
 * 1.1.1 = 1*100*100 + 1*100 + 1
 * 1.2.2 = 1*100*100 + 2*100 + 3
 *
 * 1 = 0*100 +1

	1,1 = 100

 */
function get_parent_id_with_array(opts, arr) {
    var result_arr = [];

    for (var z = 0; z < arr.length; z++) {
        result_arr.push(arr[z]);
    }

    result_arr.pop();

    var result = 0;
    for (var z = 0; z < result_arr.length; z++) {
        result += factor(opts, result_arr.length - z, result_arr[z]);
    }

    return result;
}

function factor(opts, count, current) {
    if (1 == count) {
        return current;
    }

    var str = '';
    for (var i = count - 1; i > 0; i--) {
        str += current * opts.step + '*';
    }

    return eval(str + '1');
}



var opts = {
    _headers:[]
}
/*
 * 将已有header编号，并重命名
 */
function _rename_header_content(opts, header_obj, level) {
    if (opts._headers.length == level) {
        opts._headers[level - 1]++;
    } else if (opts._headers.length > level) {
        opts._headers = opts._headers.slice(0, level);
        opts._headers[level - 1]++;
    } else if (opts._headers.length < level) {
        for (var i = 0; i < (level - opts._headers.length); i++) {
            // console.log('push 1');
            opts._headers.push(1);
        }
    }

    if (opts.is_auto_number == true) {
        //另存为的文件里会有编号，所以有编号的就不再重新替换
        // if ($(header_obj).text().indexOf(opts._headers.join('.')) != -1) {

        // } else {
        //     $(header_obj).text(opts._headers.join('.') + '. ' + $(header_obj).text());
        // }
    }
}



function permalink(md) {
    var originalHeadingOpen = md.renderer.rules.heading_open

    md.renderer.rules.heading_open = md.renderer.rules.heading_open = function (...args) {
        const [tokens, idx, , ,] = args

        const attrs = tokens[idx].attrs = tokens[idx].attrs || []
        const anchor = tokens[idx + 1]._tocAnchor
        attrs.push(["id", anchor])

        var rule = tokens[idx];

        if (rule.type == 'heading_open') {
            var level = parseInt(rule.tag.replace('h', ''))
            var markup = rule.markup

            console.log(level)

            var title = tokens[idx + 1]


            
            console.log(title.content)
            // console.log(title.level)

            var header_obj = [rule.tag + markup +  title.content]
            _rename_header_content(opts, header_obj, level);

            var id  = encode_id_with_array(opts,opts._headers);
            var pid = get_parent_id_with_array(opts,opts._headers);
    
            console.log(level + ' = level')
            console.log(id+ ' = id')
            console.log(pid+ ' = pid')

            var obj = {

            }
        }

        

        // opts._header_nodes.push({
        //     id:id, 
        //     pId:pid , 
        //     name:$(header_obj).text()||'null', 
        //     open:true,
        //     url:'#'+ id,
        //     target:'_self'
        // });

        // if (options.anchorLink) {
        //   renderAnchorLink(anchor, options, ...args)
        // }

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