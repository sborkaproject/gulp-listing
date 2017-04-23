'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var fs = require('fs');
var PluginError = gutil.PluginError;
var File = gutil.File;
var moment = require('moment');
var readJson = require('read-package-json');

module.exports = function (file, opt) {
    if (!file) {
        throw new PluginError('gulp-listing', 'Missing file option for gulp-listing');
    }

    opt = opt || {};

    if (typeof opt.newLine !== 'string') {
        opt.newLine = gutil.linefeed;
    }

    var fileName;
    var latestFile;
    var latestMod = '';
    var fileSize = '';
    var tableHead ='';
    var contents = '';
    var linkName = '';
    var head;
    var footer;

    readJson(process.cwd() + '/package.json', console.error, false, function (er, data) {
        if (er) {
            console.error("There was an error reading the package.json file");
            return;
        }
        tableHead = '<h1 class="title">' + data.nameVerbose + ' demo</h1>'
            + '<table class="table">'
            + '<tr class="table__row">'
            + '<th class="table__head">name</th>'
            + '<th class="table__head">last modified</th>'
            + '<th class="table__head">size</th>'
            + '</tr>';
    });

    if (typeof file === 'string') {
        fileName = file;
    } else if (typeof  file.path === 'string') {
        fileName = path.basename(file.path);
    } else {
        throw new PluginError('gulp-listing', 'Missing path in file options for gulp-listing');
    }

    function bufferContents(file, enc, cb) {

        if (file.isNull()) {
            cb();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-listing', 'Streaming not supported'));
            cb();
            return;
        }

        if (file.stat) {
            latestFile = file;
            fileSize = file.stat.size;
            // console.log(file.path, file.stat.mtime);
            latestMod = moment(file.stat.mtime).format('MMM Do YYYY, HH:mm');
        }

        linkName = file.path.replace(/^.*[\\\/]/, '');

        contents += '<tr class="table__row">'
            + '<td class="table__data"><a href="' + file.relative + '" class="table__link">' + linkName + '</a></td>'
            + '<td class="table__data">' + latestMod + '</td>'
            + '<td class="table__data">' + fileSize + '</td>'
            + '</tr>';

        cb();
    }

    function endStream(cb) {

        if (!latestFile) {
            cb();
            return;
        }

        var joinedFile;

        if (typeof file === 'string') {
            joinedFile = latestFile.clone({contents: false});
            joinedFile.path = path.join(latestFile.base, file);
        } else {
            joinedFile = new File(file);
        }
        head = fs.readFileSync(path.resolve(__dirname, 'head.html'));
        footer = fs.readFileSync(path.resolve(__dirname, 'footer.html'));

        contents = head.toString() + tableHead + contents + footer.toString();

        joinedFile.contents = new Buffer(contents);

        this.push(joinedFile);

        cb();
    }

    return through.obj(bufferContents, endStream);
};
