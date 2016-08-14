/**
 * 转换xml文档为markdown文档,按照gitbook格式输出
 * 1.转换categories
 * 2.转换api文档
 *
 */
var fs = require('fs'),
    path = require('path'),
    reader = require('xml-reader').create();
var writeTo = __dirname + '/../doc/';
var writer = {}; // 写入文件的内容
var CDATA = [];
reader.on('done', function (obj) {
    // console.log(obj);
    ReadCategory(obj, writer);
    console.log(JSON.stringify(writer, null, 4));
    WriteToFile(writer, CDATA);
});
var ori = fs.readFileSync('../categories.xml', 'utf8').replace(/\<\!\[CDATA\[([\w\W]*?)\]\]\>/g, function (all, rep) {
    // console.log('replace', rep, all);
    CDATA.push(rep);
    return '$$CDATA:' + (CDATA.length - 1) + '$$';
});

reader.parse(ori);

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
            write[file] = (write[file] ? write[file] : '') + category.value;
        }
        if (category.children && category.children.length > 0) {
            category.children.forEach(function (item) {
                if (item && item.value) {
                    write[file] = (write[file] ? write[file] : '') + item.value;
                }
            });
        }
    }
    if (name) {
        var space = '';
        if (category.parent) {
            console.log(category.parent);
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