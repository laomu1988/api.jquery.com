/**
 * 转换xml文档为markdown文档,按照gitbook格式输出
 * 1.转换categories
 * 2.转换api文档
 *
 */
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
    var text = '';
    children.forEach(function (item) {
        switch (item.name) {
            case 'title':
                text += '## ' + Value(item) + '\n';
                break;
            case 'signature':
            case 'default':
                text += HTML(item);
                break;
        }
    });
    writer['/entries/' + entry.attributes.name] = text;
    WriteToFile(writer);
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
function HTML(json) {
    if (!json) {
        return '';
    }
    var value = (json.name ? '<' + json.name + '>' : '') + json.value || '';
    if (json.children && json.children.length > 0) {
        json.children.forEach(function (child) {
            value += Value(child);
        })
    }
    return value + (json.name ? '</' + json.name + '>\n' : '');
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