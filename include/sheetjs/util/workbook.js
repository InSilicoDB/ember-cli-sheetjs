//Test to ascertain if commonjs (node) so that we can export it if include from node
//or simply set a global variable for app.import from ember-cli app as a standard non-AMD asset
//TODO find a better way to accomplish this
var isCommonJs = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

if (isCommonJs) {
    XLSX = require('xlsx');
}

function datenum(v, date1904) {
    if(date1904) { v+=1462; }
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function Workbook(data) {
    if (!(this instanceof Workbook)) {
        return new Workbook();
    }
    this.SheetNames = (data && data.SheetNames) || [];
    this.Sheets = (data && data.Sheets) || {};
}

/*
 * Parameters:
 *
 * - name: String
 * - data: A 2-dimensional array, permitted to be jagged
 * - options: Additional options to be set on the sheet,
 *     currently, only the `cols` property is supported.
 */
Workbook.prototype.addSheet = function addSheet(name, data, options) {
    this.SheetNames.push(name);
    var sheet = {};

    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R < data.length; ++R) {
        for(var C = 0; C < data[R].length; ++C) {
            if(range.s.r > R) { range.s.r = R; }
            if(range.s.c > C) { range.s.c = C; }
            if(range.e.r < R) { range.e.r = R; }
            if(range.e.c < C) { range.e.c = C; }

            var cell = { v: data[R][C] };
            if(cell.v == null) { continue; }
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if(typeof cell.v === 'number') { cell.t = 'n'; }
            else if(typeof cell.v === 'boolean') { cell.t = 'b'; }
            else if(cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else { cell.t = 's'; }

            sheet[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) {
        sheet['!ref'] = XLSX.utils.encode_range(range);
    }
    if (options) {
        if (options.cols) {
            sheet['!cols'] = options.cols;
        }
    }
    this.Sheets[name] = sheet;
};

Workbook.prototype.toJson = function toJson() {
    var result = {};
    this.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(this.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    }.bind(this));
    return result;
};

if (isCommonJs) {
    module.exports = Workbook;
}
else {
    XLSXWorkbook = Workbook;
}
