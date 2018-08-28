//
// Advanced example code, which has a few different purposes:
//
// - show the `clone()` API at work: you can have multiple parsers derived off one another.
// - show the `linewrap` library at work when you ask for help via the `-h` or `--help`
//   command line argument: this set of args has help that's large enough to showcase
//   line wrapping, etc. in the console.
// - show the effect of the `produceExplicitOptionsOnly(true)` API: compare A vs. B output
// - show the effect of the `errorUsageMode()` API: enter unknown options, e.g. `-A` and
//   observe the difference in the A and B error reports.
// - show the (internal) `opt()` API which allows one to modify option specs in place.
//

var version = require('../package.json').version;
var nomnom = require('../nomnom');



// Return TRUE if `src` starts with `searchString`.
function startsWith(src, searchString) {
    return src.substr(0, searchString.length) === searchString;
}



// tagged template string helper which removes the indentation common to all
// non-empty lines: that indentation was added as part of the source code
// formatting of this lexer spec file and must be removed to produce what
// we were aiming for.
//
// Each template string starts with an optional empty line, which should be
// removed entirely, followed by a first line of error reporting content text,
// which should not be indented at all, i.e. the indentation of the first
// non-empty line should be treated as the 'common' indentation and thus
// should also be removed from all subsequent lines in the same template string.
//
// See also: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals
function rmCommonWS(strings, ...values) {
    // As `strings[]` is an array of strings, each potentially consisting
    // of multiple lines, followed by one(1) value, we have to split each
    // individual string into lines to keep that bit of information intact.
    //
    // We assume clean code style, hence no random mix of tabs and spaces, so every
    // line MUST have the same indent style as all others, so `length` of indent
    // should suffice, but the way we coded this is stricter checking as we look
    // for the *exact* indenting=leading whitespace in each line.
    var indent_str = null;
    var src = strings.map(function splitIntoLines(s) {
        var a = s.split('\n');

        indent_str = a.reduce(function analyzeLine(indent_str, line) {
            var m = /^(\s*)\S/gm.exec(line);
            // only non-empty ~ content-carrying lines matter re common indent calculus:
            if (m) {
                if (!indent_str) {
                    indent_str = m[1];
                } else if (m[1].length < indent_str.length) {
                    indent_str = m[1];
                }
            }
            return indent_str;
        }, indent_str);

        return a;
    });

    // Also note: due to the way we format the template strings in our sourcecode,
    // the last line in the entire template must be empty when it has ANY trailing
    // whitespace:
    var a = src[src.length - 1];
    a[a.length - 1] = a[a.length - 1].replace(/\s+$/, '');

    // Done removing common indentation.
    //
    // Process template string partials now:
    for (var i = 0, len = src.length; i < len; i++) {
        var a = src[i];
        for (var j = 0, linecnt = a.length; j < linecnt; j++) {
            if (startsWith(a[j], indent_str)) {
                a[j] = a[j].substr(indent_str.length);
            }
        }
    }

    // now merge everything to construct the template result:
    var rv = [];
    for (var i = 0, len = values.length; i < len; i++) {
        rv.push(src[i].join('\n'));
        rv.push(values[i]);
    }
    // the last value is always followed by a last template string partial:
    rv.push(src[i].join('\n'));

    var sv = rv.join('');
    return sv;
}



var p1 = nomnom
    .script('advanced-example-A')
    .unknownOptionTreatment(false)              // do not accept unknown options!
    .produceExplicitOptionsOnly(true)
    .options({
        file: {
            flag: true,
            position: 0,
            help: 'file containing a grammar.'
        },
        lexfile: {
            flag: true,
            position: 1,
            help: 'file containing a lexical grammar.'
        },
        json: {
            abbr: 'j',
            flag: true,
            default: 'jison',
            help: 'jison will expect a grammar in either JSON/JSON5 or JISON format: the precise format is autodetected.'
        },
        outfile: {
            abbr: 'o',
            metavar: 'FILE',
            help: 'Filepath and base module name of the generated parser. When terminated with a "/" (dir separator) it is treated as the destination directory where the generated output will be stored.'
        },
        debug: {
            abbr: 't',
            flag: true,
            default: false,
            help: 'Debug mode.'
        },
        dumpSourceCodeOnFailure: {
            full: 'dump-sourcecode-on-failure',
            flag: true,
            default: false,
            help: 'Dump the generated source code to a special named file when the internal generator tests fail, i.e. when the generated source code does not compile in the JavaScript engine. Enabling this option helps you to diagnose/debug crashes (thrown exceptions) in the code generator due to various reasons: you can, for example, load the dumped sourcecode in another environment (e.g. NodeJS) to get more info on the precise location and cause of the compile failure.'
        },
        throwErrorOnCompileFailure: {
            full: 'throw-on-compile-failure',
            flag: true,
            default: true,
            help: 'Throw an exception when the generated source code fails to compile in the JavaScript engine. **WARNING**: Turning this feature OFF permits the code generator to produce non-working source code and treat that as SUCCESS. This MAY be desirable code generator behaviour, but only rarely.'
        },
        reportStats: {
            full: 'info',
            abbr: 'I',
            flag: true,
            default: false,
            help: 'Report some statistics about the generated parser.'
        },
        moduleType: {
            full: 'module-type',
            abbr: 'm',
            default: 'commonjs',
            metavar: 'TYPE',
            choices: ['commonjs', 'cjs', 'amd', 'umd', 'js', 'iife', 'es'],
            help: 'The type of module to generate.'
        },
        moduleName: {
            full: 'module-name',
            abbr: 'n',
            metavar: 'NAME',
            default: 'dummy',
            help: 'The name of the generated parser object, namespace supported.'
        },
        parserType: {
            full: 'parser-type',
            abbr: 'p',
            default: 'lalr',
            metavar: 'TYPE',
            help: 'The type of algorithm to use for the parser. (lr0, slr, lalr, lr, ll)'
        },
        compressTables: {
            full: 'compress-tables',
            abbr: 'c',
            flag: false,
            default: 2,             // 0, 1, 2
            choices: [0, 1, 2],
            help: 'Output compressed parser tables in generated modules. (0 = no compression, 1 = default compression, 2 = deep compression)'
        },
        outputDebugTables: {
            full: 'output-debug-tables',
            abbr: 'T',
            flag: true,
            default: false,
            help: 'Output extra parser tables (rules list + look-ahead analysis) in generated modules to assist debugging / diagnostics purposes.'
        },
        hasDefaultResolve: {
            full: 'default-resolve',
            abbr: 'X',
            flag: true,
            default: true,
            help: 'Turn this OFF to make jison act another way when a conflict is found in the grammar.'
        },
        hasPartialLrUpgradeOnConflict: {
            full: 'partial-lr-upgrade-on-conflict',
            abbr: 'Z',
            flag: true,
            default: true,
            help: 'When enabled, the grammar generator attempts to resolve LALR(1) conflicts by, at least for the conflicting rules, moving towards LR(1) behaviour.'
        },
        noDefaultAction: {
            flag: false,
            callback: function () {
                // FAIL when found:
                return this.help;
            },
            help: 'OBSOLETED. Use \'--default-action=[for-value,for-location]\' instead. (See below in \'--help\' output.)'
        },
        defaultActionMode: {
            full: 'default-action',
            flag: false,
            default: ['DfltVal', 'DfltLoc'],
            callback: function (val) {
                // split value at comma, expect zero, one or two values:
                var v = ('' + val).split(',');
                if (v.length > 2) {
                    return 'default-action=yyval,yylloc expects at most 2 modes! You specified ' + v.length;
                }
            },
            transform: function (val) {
                // split value at comma, expect zero, one or two values:
                var option = this;
                var def = option.default;
                var v = ('' + val).split(',').map(function cvt_modes(mode, idx) {
                    mode = mode.trim();
                    switch (mode) {
                    case 'false':
                    case '0':
                        return "none";

                    case 'true':
                    case '1':
                    case '':
                        return def[idx];

                    default:
                        return mode;
                    }
                });
                if (v.length === 1) {
                    v[1] = v[0];
                }
                return v;
            },
            help: rmCommonWS`
                Specify the kind of default action that jison should include for every parser rule.

                You can specify a mode for *value handling* ("$$") and one for *location tracking* ("@$"), separated by a comma, e.g.:
                    --default-action=ast,none

                Supported value modes:
                - classic : generate a parser which includes the default
                                $$ = $1;
                            action for every rule.
                - ast     : generate a parser which produces a simple AST-like tree-of-arrays structure: every rule produces an array of its production terms' values. Otherwise it is dentical to "classic" mode.
                - none    : JISON will produce a slightly faster parser but then you are solely responsible for propagating rule action "$$" results. The default rule value is still deterministic though as it is set to "undefined": "$$ = undefined;"
                - skip    : same as "none" mode, except JISON does NOT INJECT a default value action ANYWHERE, hence rule results are not deterministic when you do not properly manage the "$$" value yourself!

                Supported location modes:
                - merge   : generate a parser which includes the default "@$ = merged(@1..@n);" location tracking action for every rule, i.e. the rule\'s production \'location\' is the range spanning its terms.
                - classic : same as "merge" mode.
                - ast     : ditto.
                - none    : JISON will produce a slightly faster parser but then you are solely responsible for propagating rule action "@$" location results. The default rule location is still deterministic though, as it is set to "undefined": "@$ = undefined;"
                - skip    : same as "none" mode, except JISON does NOT INJECT a default location action ANYWHERE, hence rule location results are not deterministic when you do not properly manage the "@$" value yourself!

                Notes:
                - when you do specify a value default mode, but DO NOT specify a location value mode, the latter is assumed to be the same as the former. Hence:
                      --default-action=ast
                  equals:
                      --default-action=ast,ast
                - when you do not specify an explicit default mode or only a "true"/"1" value, the default is assumed: "ast,merge".
                - when you specify "false"/"0" as an explicit default mode, "none,none" is assumed. This produces the fastest deterministic parser.
            `
        },
        hasTryCatch: {
            full: 'try-catch',
            flag: true,
            default: true,
            help: 'Generate a parser which catches exceptions from the grammar action code or parseError error reporting calls using a try/catch/finally code block. When you turn this OFF, it will produce a slightly faster parser at the cost of reduced code safety.'
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
        exportAllTables: {
            full: 'export-all-tables',
            abbr: 'E',
            flag: true,
            default: false,
            help: 'Next to producing a grammar source file, also export the symbols, terminals, grammar and parse tables to separate JSON files for further use by other tools. The files\' names will be derived from the outputFile name by appending a suffix.'
        },
        exportAST: {
            full: 'export-ast',
            optional: true,
            metavar: 'false|true|FILE',
            default: false,
            help: 'Output grammar AST to file in JSON / JSON5 format (as identified by the file extension, JSON by default).',
            transform: function (val) {
                switch (val) {
                case 'false':
                case '0':
                    return false;

                case 'true':
                case '1':
                    return true;

                default:
                    return val;
                }
            }
        },
        prettyCfg: {
            full: 'pretty',
            flag: true,
            metavar: 'false|true|CFGFILE',
            default: true,
            help: 'Output the generated code pretty-formatted; turning this option OFF will output the generated code as-is a.k.a. \'raw\'.',
        },
        main: {
            full: 'main',
            abbr: 'x',
            flag: true,
            default: false,
            help: 'Include .main() entry point in generated commonjs module.'
        },
        moduleMain: {
            full: 'module-main',
            abbr: 'y',
            metavar: 'NAME',
            help: 'The main module function definition.'
        },
        version: {
            abbr: 'V',
            flag: true,
            help: 'Print version and exit.',
            callback: function () {
                console.log('A version: ', version);
            }
        }
    })
    .printer(function (str, code) {
        console.log('A CODE ' + (code | 0) + ': ' + str);
    });

var p2 = p1
    .clone()
    .script('advanced-example-B')
    .errorUsageMode('none')                         // print the error, no --help hint
    .produceExplicitOptionsOnly(false)
    // .option('version', {
    //     abbr: 'v',
    //     flag: true,
    //     help: '(This text should only show in the `B` variant help!) Print version and exit.',
    //     callback: function () {
    //         console.log(version);
    //     }
    // })
    .printer(function (str, code) {
        console.log('B CODE ' + (code | 0) + ': ' + str);
    });



// (internal/hacking): fetch the 'version' option from the p2 spec list and modify it in place:
var v = p2.opt('version');
v.help = '** This text should only show up in the B version of `--help`! **',
// NOTE: `callback` gets executed *before* `transform` so our `transform` further below
//       CANNOT have any effect on the value passed to `callback` here, hence we simply
//       dump `version` as before, only with a different leader text in `console.log`...
v.callback = function (val) {
    // console.log("version callback:", val);
    console.log('B version: ', version);
};
// and add this option attribute:
v.transform = function (val) {
    // console.log("version transform:", val);
    return version + '-B!';
};


console.log("\n=== A parse ===");
var opts1 = p1.parse();
console.log("\n=== B parse ===");
var opts2 = p2.parse();

console.log('\nopts A ~ [produceExplicitOptionsOnly=true]:\n', JSON.stringify(opts1, undefined, 4));
console.log('\nopts B ~ [produceExplicitOptionsOnly=false]:\n', JSON.stringify(opts2, undefined, 4));
