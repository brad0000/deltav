'use strict';
var GulpConfig = (function () {
    function gulpConfig() {

        this.source = './source';
        
        this.dist = this.source + '/dist'
        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.source + '/**/*.ts';

        this.typings = './source/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;