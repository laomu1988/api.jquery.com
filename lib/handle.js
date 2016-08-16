/**
 * 转换xml文档为markdown文档,按照gitbook格式输出
 * 1.转换categories
 * 2.转换api文档
 *
 */
'use strict';

var fs = require('fs'),
    xml = require('xml-reader'),
    path = require('path'),
    reader = xml.create(),
    folder = require('filter-files');
var writeTo = __dirname + '/../doc/';
var writer = {}; // 写入文件的内容
var CDATA = [];
var files = folder.sync(__dirname + '/../entries');

ReadXML(__dirname + '/../categories.xml').then(function (obj) {
    ReadCategory(obj, writer);
    function Entry() {
        var file = files.shift();
        if (file) {
            ReadXML(file)
                .then(function (obj) {
                    ReadEntry(obj, file);
                })
                //.then(Entry)
                .catch(function (e) {
                    console.log(e);
                });
        } else {
            WriteToFile(writer);
        }
    }

    Entry();

}).catch(function (e) {
    console.log(e);
});


function ReadEntry(entry, file) {
    console.log(file);
    entry = ParserJSON(entry);
    var children = entry.children;
    if (!children || children.length == 0) {
        return;
    }
    var text = Transfer(entry, entry);
    writer['/entries/' + entry.attributes.name] = text;
    WriteToFile(writer);
}
function Transfer(entry, root) {
    var result = '';
    if (!entry) {
        return '';
    }
    try {
        if (!root && entry.parent) {
            root = entry.parent;
            while (root.parent) {
                root = root.parent;
            }
        }
        if (!entry.name) {
            if (entry.length > 0) {
                for (var i = 0; i < entry.length; i++) {
                    result += Transfer(entry[i]);
                }
                return result;
            }
            return entry.value || '';
        }
        switch (entry.name) {
            case 'entry':
                var obj = {title: '', signature: '\n', desc: '', longdesc: '', other: ''};
                if (entry.children && entry.children.length > 0) {
                    entry.children.forEach(function (child) {
                        if (child && typeof obj[child.name] != 'undefined') {
                            obj[child.name] += Transfer(child, root);
                        } else {
                            obj.other += Transfer(child, root);
                        }
                    });
                }
                return obj.title + obj.desc + obj.signature + obj.longdesc + obj.other;
            case 'title':
                return result += '## ' + Value(entry) + '\n\n';
            case 'signature':
                var args = '';
                if (entry.children && entry.children.length > 0) {
                    entry.children.forEach(function (child) {
                        result += Transfer(child, root);
                        if (child && child.name == 'argument') {
                            var attr = child.attributes || {};
                            args = args + (attr.optional ? '[' : '') + (args ? ', ' : '') + attr.name + (attr.optional ? ']' : '');
                        }
                    });
                    args = args ? '* ' + root.attributes.name + '( ' + args + ' )\n' : '';
                }
                return args + result + '\n';
            case 'argument':
                var types = [];
                if (entry.attributes.type) types.push(entry.attributes.type);

                if (entry.children && entry.children.length > 0) {
                    entry.children.forEach(function (child) {
                        result += Transfer(child, root);
                        if (child && child.name == 'type' && child.attributes.name) {
                            types.push(child.attributes.name);
                        }
                    });
                }
                types = types.map(function (val) {
                    return '[' + val + '](types.md?#' + val + ')';
                });
                return '    - **' + entry.attributes.name + '** {' + types.join('|') + '} ' + result + '\n';
            case 'code':
                return HTML(entry);
            case 'desc':
                return '' + HTML(entry, true) + '\n';
            case 'longdesc':
                return '\n\n' + Transfer(entry.children, root) + '\n';
            default:
                result = Transfer(entry.children);
                if (result) {
                    result = '<' + entry.name + '>' + result + '</' + entry.name + '>\n';
                }
        }
    } catch (e) {
        console.log(e);
        console.log(e.stack);
    }

    return result;
}
function Value(json) {
    if (!json) {
        return '';
    }
    var value = json.value || '';
    if (json.children && json.children.length > 0) {
        json.children.forEach(function (child) {
            value += Value(child);
        })
    }
    return value;
}
function HTML(json, ignoreSelf) {
    if (!json) {
        return '';
    }
    var value = (!ignoreSelf && json.name ? '<' + json.name + '>' : '') + json.value || '';
    if (json.children && json.children.length > 0) {
        json.children.forEach(function (child) {
            value += Value(child);
        })
    }
    return value + (!ignoreSelf && json.name ? '</' + json.name + '>' : '');
}

function ParserJSON(entry) {
    if (!entry) {
        return false;
    }
    if (entry.name) {
        if (entry.value == '' && entry.children.length == 1 && entry.children[0].type.toLowerCase() == 'text') {
            entry.value = entry.children[0].value;
            entry.children = [];
        }
        switch (entry.name.toLowerCase()) {
            case 'text':
                return entry.value;
            default:
                if (entry.children && entry.children.length > 0) {
                    for (var i = 0; i < entry.children.length; i++) {
                        // console.log(entry.children[i]);
                        entry.children[i] = ParserJSON(entry.children[i]);
                    }
                }
        }
    }
    return entry;
}

function ReadXML(filename) {
    var reader = xml.create();
    return new Promise(function (resolve, reject) {
        try {
            reader.on('done', function (obj) {
                resolve(obj);
            });
            var Text = fs.readFileSync(filename, 'utf8').replace(/\<\!\[CDATA\[([\w\W]*?)\]\]\>/g, function (all, rep) {
                // console.log('replace', rep, all);
                CDATA.push(rep);
                return '$$CDATA:' + (CDATA.length - 1) + '$$';
            });
            reader.parse(Text);
        } catch (e) {
            reject(e);
        }

    });
}

function ReadCategory(category, write) {
    if (!category || !write) {
        return;
    }
    var name = category.attributes.name, file = category.attributes.slug || category.attributes.name;
    if (category.name == 'desc') {
        var attr = category.parent.attributes;
        var file = attr.slug || attr.name;
        if (category.parent && category.parent.parent) {
            if (category.parent.parent.attributes.slug) {
                file = category.parent.parent.attributes.slug + '/' + file;
            }
        }
        if (category.value) {
            ADDCategory(file, category.value, attr.name);
        }
        if (category.children && category.children.length > 0) {
            category.children.forEach(function (item) {
                if (item && item.value) {
                    ADDCategory(file, item.value, attr.name);
                }
            });
        }
    }
    if (name) {
        var space = '';
        if (category.parent) {
            // console.log(category.parent);
            if (category.parent.name == 'category') {
                space = '    ';
            }
            if (category.parent.attributes.slug) {
                file = category.parent.attributes.slug + '/' + file;
                category.parent.attributes.file = file;
            }
        }
        write['SUMMARY'] = (write['SUMMARY'] ? write['SUMMARY'] : '') + space + '* [' + name + '](' + (file) + '.md)\n';
    }
    if (category.children && category.children.length > 0) {
        category.children.forEach(function (child) {
            ReadCategory(child, write);
        });
    }
}

function ADDCategory(filename, content, title) {
    if (writer[filename]) {
        writer[filename] += content;
    } else {
        // console.log('add-title', filename, title);
        writer[filename] = '';
        if (title) writer[filename] = '# ' + title + '\n';
        if (content) writer[filename] += content;
    }
}

/**
 * 写入内容到文件中
 *
 * */
function WriteToFile(write) {
    for (var file in write) {
        var val = write[file];
        file = writeTo + file + '.md';
        val = val.replace(/\$\$CDATA\:(\d+)\$\$/g, function (all, index) {
            return CDATA[parseInt(index)];
        });
        var dir = path.dirname(file);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(file, val);
    }
}