var nomnom = require("../nomnom");
    
var opts = {
   pos1: {
      position: 0
   },
   pos2: {
      position: 1
   },
   flag1: {
      flag: true
   },
   flag2: {
      flag: true,
      abbr: 'X',
      default: true
   },
   flag3: {
      abbr: 'Y',
      flag: true
   },
   flag4: {
      flag: true,
      abbr: 'Z',
      default: true
   },
   flag5: {
      flag: true,
      abbr: 'A',
      default: false
   },
   debug: {
      abbr: 'd'
   },
   numLines: {
      abbr: 'n',
      full: 'num-lines'
   },
   version: {
      string: '-v, --version'
   },
   config: {
      string: '-c FILE, --config=FILE'
   },
   skey : {
      string: '-k val'
   },
   skey2: {
      string: '-k2 val2, --key2 val2'
   },
   skey3: {
      string: '--key3=val'
   },
   skey4: {
      string: '--key4=val, -y val'
   }
}

var parser = nomnom().options(opts);

exports.testPositional = function(test) {
   var options = parser.parse(["--flag1", "val1", "--config", "file", "val2", "--flag2", "-Y-"]);
   
   test.equal(options.pos1, "val1");
   test.equal(options.pos2, "val2");
   test.deepEqual(options._, ["val1", "val2"])
   test.strictEqual(options.flag1, true);
   test.strictEqual(options.flag2, true);
   test.strictEqual(options.flag3, false);
   test.done();
}

exports.testAbbr = function(test) {
   var options = parser.parse(["-d", "yes", "--num-lines", "3"]);
   
   test.equal(options.debug, "yes");
   test.equal(options.numLines, 3);
   test.done();
}

exports.testString = function(test) {
   var options = parser.parse(["-k", "val", "--config=test.js",
      "--key2", "val2", "--key3", "val3", "--key4=val4", "-v", "v0.3"]);

   test.equal(options.version, "v0.3");
   test.equal(options.config, "test.js");
   test.equal(options.skey, "val");
   test.equal(options.skey2, "val2");
   test.equal(options.skey3, "val3");
   test.equal(options.skey4, "val4");
   test.done();
}

exports.testFlags = function(test) {
   var options = parser.parse(["--flag1", "--no-flag1", "val1", "--config", "file", "val2", "-X", "-Y+", "-Z-", "-A"]);
   
   test.strictEqual(options.flag1, false);
   test.strictEqual(options.flag2, true);
   test.strictEqual(options.flag3, true);
   test.strictEqual(options.flag4, false);
   test.strictEqual(options.flag5, true);
   test.deepEqual(options._, ["val1", "val2"]);
   test.equal(options.config, "file");
   test.done();
}

exports.testLongNamedFlags = function(test) {
   var options = parser.parse(["--flag1", "--no-flag1", "val1", "--config", "file", "val2", "--no-flag2", "--flag3+", "--flag4-", "--no-flag5"]);
   
   test.strictEqual(options.flag1, false);
   test.strictEqual(options.flag2, false);
   test.strictEqual(options.flag3, true);
   test.strictEqual(options.flag4, false);
   test.strictEqual(options.flag5, false);
   test.deepEqual(options._, ["val1", "val2"]);
   test.equal(options.config, "file");
   test.done();
}

exports.testCombinedFlags = function(test) {
   var options = parser.parse(["--no-flag1", "val1", "--config", "file", "val2", "-XYZA"]);
   
   test.strictEqual(options.flag1, false);
   test.strictEqual(options.flag2, true);
   test.strictEqual(options.flag3, true);
   test.strictEqual(options.flag4, true);
   test.strictEqual(options.flag5, true);
   test.deepEqual(options._, ["val1", "val2"]);
   test.equal(options.config, "file");
   test.done();
}

exports.testDefaultFlags = function(test) {
   var options = parser.parse(["xyz"]);
   
   test.strictEqual(options.flag1, undefined);
   test.strictEqual(options.flag2, true);
   test.strictEqual(options.flag3, undefined);
   test.strictEqual(options.flag4, true);
   test.strictEqual(options.flag5, false);
   test.deepEqual(options._, ["xyz"]);
   test.done();
}

// test flags as if these were a different type: boolean instead of value flag, and vice versa:
exports.testFlagsAbuse = function(test) {
   var options = parser.parse(["--no-debug", "--no-config", "--flag1=file", "--flag2", "file2"]);
   
   test.strictEqual(options.flag1, "file");
   test.strictEqual(options.flag2, true);
   test.strictEqual(options.flag3, undefined);        // default value for flag
   test.strictEqual(options.flag4, true);             // default value for flag
   test.strictEqual(options.flag5, false);            // default value for flag
   test.deepEqual(options._, ["file2"]);
   test.strictEqual(options.config, false);           // treated as flag option by the 'no-' prefix
   test.strictEqual(options.debug, false);            // treated as flag option by the 'no-' prefix
   test.done();
}

exports.testNegativeFlagsFailInSpec = function(test) {
   var o = {
      noLineNumbers: {
         abbr: 'n',
         full: 'no-line-numbers'
      }
   };

   var p = nomnom();
   test.throws(function () {
      p.options(o);
   }, Error, /nomnom options MUST NOT start their 'full option name' with 'no-'/);

   test.done();
};

exports.testNegativeFlags = function(test) {
   var o = {
      lineNumbers: {
         abbr: 'n',
         full: 'line-numbers'
      }
   };

   var p = nomnom();
   p.options(o);

   var options = p.parse(["--no-line-numbers"]);
   test.strictEqual(options.lineNumbers, false);

   test.done();
}



