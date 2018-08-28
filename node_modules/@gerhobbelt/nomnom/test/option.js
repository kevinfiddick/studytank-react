var nomnom = require("../nomnom");

var parser = nomnom()
   .autoShowUsage(false)
   .option('debug', {
      abbr: 'x',
      flag: true,
      help: 'Print debugging info'
   })
   .option('config', {
      abbr: 'c',
      default: 'config.json',
      help: 'JSON file with tests to run'
   })
   .option('version', {
      flag: true,
      help: 'print version and exit',
      callback: function() {
         return "version 1.2.4";
      }
   });


exports.testOption = function(test) {
   var opts = parser.parse(["-x", "--no-verbose", "--bugger=abc", "--toots", "--no-buggaloo", "--bongo"]);

   test.strictEqual(opts.debug, true);
   test.strictEqual(opts.version, undefined);

   // unspecified options are silently accepted and parsed as 'flag' options by default.
   test.strictEqual(opts.verbose, false);
   test.strictEqual(opts.bugger, "abc");
   test.strictEqual(opts.toots, true);
   test.strictEqual(opts.buggaloo, false);
   test.strictEqual(opts.bongo, true);

   test.equal(opts.config, "config.json");
   test.done();
};


exports.testCommandOption = function(test) {
   var parser = nomnom().autoShowUsage(false);
   parser.command('test')
     .option('fruit', {
        abbr: 'f',
        flag: true
     });

   var opts = parser.parse(["test", "-f"]);

   test.strictEqual(opts.fruit, true);
   test.done();
};


exports.testOptionValue = function(test) {
  var parser = nomnom()
    .autoShowUsage(false)
    .options({
      'debug': {
        abbr: 'x',
        flag: true,
        help: 'Print debugging info'
      },
      'config': {
        abbr: 'c',
        default: 'config.json',
        help: 'JSON file with tests to run'
      },
      'req': {
        abbr: 'r',
        default: 'required.json',
        required: true,
        help: 'this option requires a value'
      },
      'opt': {
        abbr: 'o',
        optional: 'opt-val',          // when NOT `undefined`, this value is used when no value is specified in argv CLI
        default: 'optional.json',
        help: 'this option accepts an OPTIONAL value'
      },
      'fruit': {
        abbr: 'f',
        flag: true,
        help: 'fruit flag'
      }
    });

   var opts = parser.parse("-x --config cfg --req xxx --opt --fruit".split(" "));

   test.strictEqual(opts.debug, true);
   test.strictEqual(opts.config, 'cfg');
   test.strictEqual(opts.req, 'xxx');
   test.strictEqual(opts.opt, 'opt-val');     // `optional` is picked up when option IS present in argv (compare with below, where `--opt` IS NOT present in argv!)
   test.strictEqual(opts.fruit, true);


   var opts = parser.parse("--opt kwaak --fruit".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, 'kwaak');
   test.strictEqual(opts.fruit, true);


   var opts = parser.parse("--opt -f-".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, 'opt-val');
   test.strictEqual(opts.fruit, false);


   var opts = parser.parse("--opt=boo -f-".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, 'boo');
   test.strictEqual(opts.fruit, false);


   var opts = parser.parse("--opt+ -f-".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, true);
   test.strictEqual(opts.fruit, false);


   var opts = parser.parse("--opt- -f+".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, false);
   test.strictEqual(opts.fruit, true);


   var opts = parser.parse("-f+".split(" "));

   test.strictEqual(opts.debug, undefined);
   test.strictEqual(opts.config, 'config.json');
   test.strictEqual(opts.req, 'required.json');
   test.strictEqual(opts.opt, 'optional.json');     // `default` is picked up when option IS NOT present in argv
   test.strictEqual(opts.fruit, true);
   test.done();
};


exports.testUnspecifiedOption = function(test) {
  var parser = nomnom()
    .autoShowUsage(false);

   var opts = parser.parse("-x --config cfg --req xxx --opt --fruit".split(" "));

   test.strictEqual(opts.x, true);
   test.strictEqual(opts.config, 'cfg');
   test.strictEqual(opts.req, 'xxx');
   test.strictEqual(opts.opt, true);
   test.strictEqual(opts.fruit, true);


   var opts = parser.parse("--opt kwaak --fruit".split(" "));

   test.strictEqual(opts.opt, 'kwaak');
   test.strictEqual(opts.fruit, true);


   var opts = parser.parse("--opt -f-".split(" "));

   test.strictEqual(opts.opt, true);
   test.strictEqual(opts.f, false);


   var opts = parser.parse("--opt=boo -f-".split(" "));

   test.strictEqual(opts.opt, 'boo');
   test.strictEqual(opts.f, false);


   var opts = parser.parse("--opt+ -f-".split(" "));

   test.strictEqual(opts.opt, true);
   test.strictEqual(opts.f, false);


   var opts = parser.parse("--opt- -f+".split(" "));

   test.strictEqual(opts.opt, false);
   test.strictEqual(opts.f, true);


   var opts = parser.parse("-o abcd -f+".split(" "));

   test.strictEqual(opts.o, 'abcd');
   test.strictEqual(opts.f, true);


   var opts = parser.parse("-o=def -f 5".split(" "));

   test.strictEqual(opts.o, 'def');
   test.strictEqual(opts.f, 5);
   test.done();
};


exports.testOptionShorthand = function(test) {
  var parser = nomnom()
    .autoShowUsage(false)
    .options({
      debug: {
        abbr: 'x',
        flag: true,
        help: 'Print debugging info'
      },
      errorRecoveryTokenDiscardCount: {
        full: 'error-recovery-token-discard-count',
        abbr: 'Q',
        flag: false,
        default: 3,
        callback: function (count) {
          if (count != parseInt(count)) {
            return "count must be an integer";
          }
          count = parseInt(count);
          if (count < 2) {
            return "count must be >= 2";
          }
        },
        transform: function (val) {
          return parseInt(val);
        },
        help: 'Specify the number of lexed tokens that may be gobbled by an error recovery process before we cry wolf.'
      },
      fruit: {
        abbr: 'f',
        flag: true,
        help: 'fruit flag'
      }
    });

   var opts = parser.parse("-x -cvG-".split(" "));

   test.strictEqual(opts.debug, true);
   test.strictEqual(opts.errorRecoveryTokenDiscardCount, 3);
   test.strictEqual(opts.fruit, undefined);
   test.strictEqual(opts.c, true);
   test.strictEqual(opts.v, true);
   test.strictEqual(opts.G, false);


   var opts = parser.parse("-x -cvG- -Q=10 --fruit".split(" "));

   test.strictEqual(opts.debug, true);
   test.strictEqual(opts.errorRecoveryTokenDiscardCount, 10);
   test.strictEqual(opts.fruit, true);
   test.strictEqual(opts.c, true);
   test.strictEqual(opts.v, true);
   test.strictEqual(opts.G, false);


   var opts = parser.parse("--debug".split(" "));

   test.strictEqual(opts.debug, true);
   test.strictEqual(opts.errorRecoveryTokenDiscardCount, 3);
   test.strictEqual(opts.fruit, undefined);
   test.done();
};


exports.testOptionErrors = function(test) {
  var parser = nomnom()
    .autoShowUsage(false)
    .printer(function (msg, rv) {
      throw new Error(msg);
    })
    .options({
      debug: {
        abbr: 'x',
        flag: true,
        required: true,
        help: 'Print debugging info'
      },
      level: {
        full: 'nonsense',
        abbr: 'Q',
        required: true,
        default: 3,
        help: 'full and abbr don\'t match the option name; still we want the correct hint on error.'
      },
      fruit: {
        abbr: 'f',
        flag: true,
        help: 'fruit flag'
      },
      juice: {
        full: 'orange',
        help: 'juice flag'
      }
    });

  // all three incantations of the same option should produce the same error report... with minimal differences
  test.throws(function () {
    var opts = parser.parse("--nonsense -x".split(" "));
  }, Error, /'--nonsense' expects a value/);

  test.throws(function () {
    var opts = parser.parse("--level -x".split(" "));
  }, Error, /'--nonsense' expects a value/);

  test.throws(function () {
    var opts = parser.parse("-Q -x".split(" "));
  }, Error, /'-Q' expects a value/);

  var opts = parser.parse("-Q=true -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, true);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, undefined);


  var opts = parser.parse("-Q=10 ABC -x DEF".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 10);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, undefined);
  test.deepEqual(opts._, ['ABC', 'DEF']);


  var opts = parser.parse("--nonsense=10 -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 10);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, undefined);


  // the 'name' is also accepted, next to the 'full' option!
  var opts = parser.parse("--level=10 -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 10);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, undefined);


  var opts = parser.parse("-f -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, true);
  test.strictEqual(opts.juice, undefined);


  var opts = parser.parse("-f- -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, false);
  test.strictEqual(opts.juice, undefined);


  var opts = parser.parse("--fruit -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, true);
  test.strictEqual(opts.juice, undefined);


  var opts = parser.parse("--fruit- -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, false);
  test.strictEqual(opts.juice, undefined);


  test.throws(function () {
    var opts = parser.parse("--orange -x".split(" "));
  }, Error, /'--orange' expects a value/);

  // print the full option rather than the name!
  test.throws(function () {
    var opts = parser.parse("--juice -x".split(" "));
  }, Error, /'--orange' expects a value/);


  var opts = parser.parse("--orange=7 -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, 7);


  var opts = parser.parse("--juice=7 -x".split(" "));
  test.strictEqual(opts.debug, true);
  test.strictEqual(opts.level, 3);
  test.strictEqual(opts.fruit, undefined);
  test.strictEqual(opts.juice, 7);

  test.done();
};


