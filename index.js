var path = require('path');
var fs = require('fs');
var brocMergeTrees = require('broccoli-merge-trees');

function EmberCliSheetjs(project) {
    this.project = project;
    this.name = 'ember-cli-sheetjs';
}

function treeSansWatch(dir) {
    return {
        read: function() {
            return dir;
        },
        cleanup: function() {
            return; //do nothing
        },
    };
}

EmberCliSheetjs.prototype.treeFor = function treeFor(name) {
    if (name === 'vendor') {
        //so that app.import and ES6 imports will look for
        //'vendor/xlsx' in './node_modules/xlsx' or
        //'vendor/sheetjs' ./include/sheetjs'
        return brocMergeTrees([
            treeSansWatch(path.normalize('node_modules/ember-cli-sheetjs/node_modules')),
            treeSansWatch(path.normalize('node_modules/ember-cli-sheetjs/include'))
        ]);
    }
    else {
        return; //look ma, no assets!
    }
};

EmberCliSheetjs.prototype.included = function included(app) {
    console.log('EmberCliSheetjs.prototype.included');
    this.app = app;
    this.options = (app.options && app.options.sheetjs) || {};

    if (this.options.xlsx) {
        console.log('importing Xlsx');
        if (this.options.jszip || this.options.cpexcel) {
            this.app.import('vendor/xlsx/dist/xlsx.full.min.js');
        }
        else {
            this.app.import('vendor/xlsx/dist/xlsx.js');
        }

        if (this.options.workbook) {
            console.log('Importing workbook');
            this.app.import('vendor/sheetjs/util/workbook.js');
        }
    }
};

module.exports = EmberCliSheetjs;
