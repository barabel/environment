#!/usr/bin/env node
const Twig = require("twig");
const hashGenerator = require("hasha");
const mapcache = require("./mapcache");
const pathFs = require('path');
Twig.cache(false);

Twig.extend((Twig) => {
    const compiler = Twig.compiler;
    compiler.module['webpack'] = require("./compiler");
    compiler.module['webpackInline'] = require("./compiler-inline");
});

const fs = require('fs');
const {writeSync} = require("fs");
const options = {};
const pathTwig = pathFs.resolve(process.cwd(), process.argv[2]);
const path = require.resolve(pathTwig);
const id = hashGenerator(path);
let tpl;

mapcache.set(id, path)
const source = fs.readFileSync(path);

tpl = Twig.twig({
    id: id,
    path: path,
    data: source.toString(),
    allowInlineIncludes: true
});

template = tpl.compile({
    module: 'webpack',
    twig: 'twig'
});

const regex = /require\(\"(.*)\"\);/gm;

let m;

const  projectPath = pathFs.resolve(__dirname,'./../../');

const nameSpaces= {
    'view-root': pathFs.join(projectPath, 'src/views/partials'),
    'root': pathFs.join(projectPath, 'src/views'),
}

let output = template;
let count = 0;
do {
    count = 0;
    while ((m = regex.exec(template)) !== null) {
        count++;

        // The result can be accessed through the `m`-variable.
        let fPath = m[1];
        Object.keys(nameSpaces).forEach(($key) => {
            if (fPath.indexOf($key) == 1) {
                fPath = fPath.replace($key, nameSpaces[$key]).substr(1);
            }
        });


        const id = hashGenerator(pathFs.resolve(pathFs.dirname(pathTwig), m[1]));
        let tpl;

        mapcache.set(id, path)
        const source = fs.readFileSync(fPath);
        tpl = Twig.twig({
            id: id,
            path: fPath,
            data: source.toString(),
            allowInlineIncludes: true
        });

        templateSub = tpl.compile({
            module: 'webpackInline',
            twig: 'twig'
        });

        output = output.replace(m[0], '');
        output += templateSub;
    }
    template = output;
    regex.lastIndex = 0;
} while (count > 0)



fs.writeFile(`${pathTwig}.js`, template.replace(/\n/gm, ''), (err) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
    }
});
