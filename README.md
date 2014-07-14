# ember-cli-sheetjs

An ember-cli addon for including [SheetJs](http://github.com/sheetjs)

Currently supports:

- [sheetjs/js-xlsx](http://github.com/sheetjs/js-xlsx)

Includes a utility class to manipulate workbooks that have been
parsed using SheetJs functions.

## Adding to an ember-cli app

To use in an `ember-cli` app:

    $ npm install --save ember-cli-sheetjs

Inside your app, `XLSX`, and `XLSXWorkbook` are exposed as global variables.
Notify `jshint` about them using:

    /*globals XLSX, XLSXWorkbook*/

### Options for ember-cli

Edit your `Brocfile.js` to add some options:

    var app = new EmberApp({
        // ...
        sheetjs: {
            xlsx: true,
            jszip: true,
            cpexcel: true,
            workbook: true,
        },
        // ...
    });

- Disabling `xslx` will effectively disable this plugin.
- You may include `jszip` or `cpexcel` that is bundled together with sheetjs/js-xlsx (recommended)
- You may include `workbook`, which contains utility functions for manipulating spreadsheets

## Adding to a NodeJs project

    var xlsx = require('ember-cli-sheetjs/xlsx');
    var xlsxWorkbook = require('ember-cli-sheetjs/workbook');
