import { describe, expect, it } from 'vitest';
import commonmark from './commonmark.json';
import markedMarkdownRenderer from '../../src';
import { marked } from 'marked';

// preprocess the commonmark tests to group them by section
const sections = commonmark.reduce<Record<string, any[]>>((acc, test) => {
    if (!acc[test.section]) {
        acc[test.section] = [];
    }

    acc[test.section].push(test);

    return acc;
}, {});

const skippedBecauseOfTokenizationLimitations = new Set([
    4, // list continuation indent style (tab vs spaces) is not preserved in list tokens
    329, // code span delimiter/padding choice is ambiguous from codespan text
    333, // code span boundary spaces are normalized away (` b ` vs `b`)
    337, // single-line vs newline inside code span is not preserved in tokens
    340, // code span delimiter/padding form is ambiguous from codespan text
    349, // adjacent backticks across inline token boundaries are not encoded
    335, // multiline code span newlines collapse into spaces in tokens
    336, // multiline code span with trailing space loses newline form
    634, // backslash hard break (AST doesn't distinguish from space break)
    635, // exact trailing space count in hard break
    637, // backslash hard break with indentation
    640, // line break inside code span (collapsed to space by lexer)
    641, // backslash line break inside code span
    486, // empty destination style `()` vs `(<>)` is not preserved in link tokens

    495, // escaped vs unescaped balanced parens in link destination not distinguished (`\(foo\)` vs `(foo)`)

    // Setext headings: underline length and heading text whitespace not preserved in token
    82, // leading spaces on heading text and trailing tab stripped by lexer
    83, // setext underline length (25 dashes / 1 `=`) not preserved; token has only `depth`
    84, // leading spaces on heading text stripped by lexer
    86, // leading spaces in setext underline not preserved in token
    88, // `--- -` valid thematic break rendered as canonical `---` (hr spacing not preserved)
    89, // trailing double-space (hard break indicator) in heading text stripped by lexer
    91, // setext underline length (3) doesn't match text length (14); not preserved in token
    93, // blockquote lazy-continuation line breaks setext reconstruction (lazy cont. not in token)
    99, // setext-like `-----` is a thematic break; hr repetition count not preserved
    101, // setext-like `-----` after blockquote is a thematic break; hr repetition not preserved

    // Indented code blocks: certain source-form details not preserved in token
    108, // list item's 2-space leading indent before `- ` not in token; continuation indented 2 not 4
    109, // ordered list double-space marker spacing (`1.  `) not preserved in token
    111, // partial-indented blank lines (`  `, ` `) normalized to empty in token; cannot restore
    115, // setext underline length (6) doesn't match heading text length (7); not in token

    // Fenced code blocks: fence character (tilde vs backtick) and fence length not in token
    120, // tilde fence (`~~~`) not preserved; Code token has no fence-character field
    121, // 2-backtick delimiter invalid fence parses as paragraph; codespan delimiter count lost
    123, // tilde fence not preserved in token
    124, // 4-backtick fence length not preserved in token
    125, // tilde fence + longer-than-content underline not preserved
    126, // unclosed fence (block extends to EOF) is indistinguishable from empty fenced block
    127, // unclosed 5-backtick fence; fence length and unclosed state not in token
    128, // fenced code inside blockquote is unclosed; closing fence cannot be omitted from output
    131, // fence with 1 leading space not preserved; indentation not in Code token
    132, // fence with 2 leading spaces not preserved
    133, // fence with 3 leading spaces not preserved
    135, // closing fence with 2 leading spaces not preserved in token
    136, // closing fence with leading spaces not preserved in token
    137, // 4-space-indented closing fence treated as content; unclosed state not in token
    138, // backtick in info string makes fence invalid; parses as paragraph with codespan
    139, // tilde fence not preserved; longer closing fence not preserved
    141, // tilde fence not preserved (appears after setext heading context)
    143, // tilde fence with long info string; fence character not in token
    144, // 4-backtick fence length not preserved in token
    145, // backtick in info string makes fence invalid; parses as paragraph with codespan
    146, // tilde fence with backtick info string not preserved in token

    // List items: marker spacing / leading indent / special forms not preserved in tokens
    254, // `1.  ` double-space marker spacing not in token; passes coincidentally but is ambiguous
    257, // leading-space list item (` -    one`) — 4-space marker spacing and leading indent not in token
    258, // leading-space list item with 6-space continuation — indentation stripped by Marked
    259, // nested blockquote `>>` style and `1.  ` marker spacing both lost in tokens
    260, // nested blockquote `>>` style lost; `-` empty-marker trailing spaces not in token
    263, // `1.  ` double-space marker spacing not preserved; fenced code continuation ambiguous
    268, // zero-padded ordered list number (`003.`) normalised to `3` in token
    271, // leading-indent + `10.  ` double-space marker spacing not in token
    276, // `-    foo` (4-space marker) — marker spacing not in token; continuation is top-level
    277, // `-  foo` (2-space marker) — marker spacing not in token; continuation is top-level
    279, // `-   ` (marker with trailing spaces then newline) — trailing spaces not in token
    282, // empty list item with trailing spaces (`-   `) — trailing spaces not in token
    286, // ` 1.  ` (1-space leading indent + double-space marker) — both not in token
    287, // `  1.  ` (2-space leading indent + double-space marker) — both not in token
    288, // `   1.  ` (3-space leading indent + double-space marker) — both not in token
    290, // `1.  ` marker with lazy-continuation paragraph — lazy-cont. indent not in token
    291, // `  1.  ` leading-indent (stripped by trim()) passes coincidentally; ambiguous token
    292, // blockquote lazy continuation inside list item — lazy-cont. not in token
    293, // blockquote lazy continuation inside list item — lazy-cont. not in token
    295, // list items with varying leading spaces (0–3) — leading indent stripped by Marked
    297, // mixed list types (`10)` + `- `) on adjacent lines — leading indent stripped

    // ATX headings: closing hashes, leading indent, spacing not preserved in token
    67, // multiple spaces between `#` and text not preserved (`#                  foo` → `# foo`)
    68, // leading spaces before `#` not preserved (`  ## foo` → `## foo`)
    71, // closing `##` / `###` and leading indent/multi-spacing not preserved
    72, // closing `#` sequences not preserved (`# foo ####...` → `# foo`)
    73, // closing `###` not preserved (`### foo ###` → `### foo`)
    77, // hr repetition count not preserved (`****` → `***`)
    79, // closing `###` and empty heading trailing space ambiguity (`#` vs `# `)

    // Links: escaping/quoting style, title delimiter, ref label case not preserved in token
    492, // angle-bracket dest `<b)c>` not distinguishable from escaped parens in token
    499, // angle-bracket dest `<foo(and(bar)>` not distinguishable from escaped parens
    500, // backslash escapes in href resolved (`\)\:` → `):`) — original escaping not in token
    505, // title delimiter style (`"` vs `'` vs `()`) not preserved in token
    506, // escaped quote in title + delimiter choice not preserved
    510, // multiline link with internal whitespace not preserved (`(   /uri\n  "title"  )` → `(/uri "title")`)
    539, // ref label case not preserved (`[BaR]` → `[bar]`)
    540, // Unicode case folding in ref label (`[SS]` → `[ss]`)
    541, // multiline def label and ref label case not preserved
    544, // duplicate defs — second def lost from token stream
    553, // collapsed reflink `[foo][]` indistinguishable from shortcut `[foo]`
    554, // collapsed reflink `[*foo* bar][]` indistinguishable from shortcut
    555, // collapsed reflink `[Foo][]` indistinguishable from shortcut
    566, // collapsed reflink `[foo][]` indistinguishable from shortcut

    // Images: same limitations as links, plus angle-bracket dest style
    576, // collapsed image reflink `![foo *bar*][]` indistinguishable from shortcut
    577, // image ref label case not preserved (`[FOOBAR]` → `[foobar]`)
    579, // double space before title not preserved (`/train.jpg  "title"` → single space)
    580, // angle-bracket dest `<url>` not distinguishable from plain dest in token
    583, // image ref label case not preserved (`[BAR]` → `[bar]`)
    584, // collapsed image reflink `![foo][]` indistinguishable from shortcut
    585, // collapsed image reflink `![*foo* bar][]` indistinguishable from shortcut
    586, // collapsed image reflink `![Foo][]` indistinguishable from shortcut

    // Tabs: tab characters are expanded to spaces in all tokens; original tabs not recoverable
    5, // tab inside list item continuation — tab expanded to spaces in token
    6, // tab as code-block indent — tab expanded to spaces
    7, // tab inside blockquote — tab expanded to spaces
    8, // tab in list item — tab expanded to spaces
    9, // tab in code block inside list — tab expanded
    10, // tab in continuation indent — tab expanded
    11, // tab in nested list/blockquote — tab expanded

    // Backslash escapes: escape sequences are resolved in token text/href/lang fields
    16, // backslash hard-break (`foo\`) is indistinguishable from two-space break in br token
    19, // tilde fence not preserved in Code token (see also 120)
    22, // backslash escapes in link href/title decoded (`\*` → `*`) — not recoverable
    23, // backslash escapes in def href/title decoded — not recoverable
    24, // backslash escape in fenced-code info string decoded + space stripped — not recoverable

    // Entity references: HTML entities are decoded to Unicode characters in text tokens
    25, // named HTML entities decoded (`&copy;` → `©`) — original entity form not in token
    26, // decimal numeric entities decoded (`&#35;` → `#`)
    27, // hex numeric entities decoded (`&#X22;` → `"`)
    28, // invalid entities kept as-is but valid ones decoded — mixed; original not in token
    29, // partial entity `&copy` kept as-is — original form not in token
    34, // entity in fenced-code info string decoded (`f&ouml;&ouml;` → `föö`)
    35, // entity in codespan decoded (`f&ouml;&ouml;`) — codespan text normalised
    37, // entity used as inline delimiter (`&#42;foo&#42;`) — decoded to `*`, re-parsed as em
    38, // entity used as list marker (`&#42; foo`) — decoded to `*`, re-parsed as list
    39, // `&#10;` (LF entity) decoded; becomes real newline inside paragraph
    40, // `&#9;` (tab entity) decoded to tab; tab expanded inside paragraph
    41, // entity in link title attribute — decoded in token

    // Link reference definitions: formatting not preserved in def tokens
    193, // multi-line def with leading spaces and single-quote title — canonical form only
    194, // def label case (`[Foo*bar\]]`) normalised to lowercase `tag` in token
    195, // angle-bracket URL and single-quote title on separate lines — not in token
    196, // multi-line single-quote title — delimiter style not preserved in token
    198, // URL on continuation line (`[foo]:\n/url`) — multi-line form not in token
    200, // empty URL with angle-brackets (`<>`) — href is `""` for both `<>` and missing URL
    202, // backslash escapes in def href/title decoded — original escaping not in token
    204, // duplicate def labels — second definition dropped from token stream
    205, // def label case (`[FOO]`) normalised to `[foo]` in `tag` field
    206, // Unicode def label case-folded (`[ΑΓΩ]` → `[αγω]`) in `tag` field
    208, // multi-line label (`[\nfoo\n]`) normalised to `[ foo ]` in `tag` field
    217, // indented title continuation line (`\n  "bar"`) — indentation not in token

    // Paragraphs / blank lines: whitespace details not preserved
    226, // extra trailing spaces (5) before hard break — br token doesn't preserve exact count
    227, // blank line with trailing spaces (`  `) — spaces stripped; only blank line in token

    // Block quotes: lazy-continuation lines and prefix style not preserved in tokens
    229, // `>` without space (`>#`) not preserved; canonical `> ` always used
    230, // leading spaces before `>` not preserved in blockquote token
    232, // lazy continuation line without `>` (`baz`) not preserved — rendered with `>`
    233, // lazy continuation line inside blockquote paragraph not preserved
    237, // unclosed fenced code inside blockquote via lazy continuation — not recoverable
    238, // lazy continuation via indentation (`    - bar`) not preserved — rendered with `>`
    240, // trailing spaces on blank blockquote line (`>  `) not preserved in token
    247, // lazy continuation paragraph line not preserved in blockquote token
    250, // lazy continuation inside triple-nested blockquote — not preserved
    251, // mixed `>` prefix forms (`>>>`, `> `, `>>`) not preserved — canonical `> ` used

    // Lists: marker style/spacing and leading indent not preserved in tokens
    305, // `1.  ` double-space marker spacing not in token
    309, // `-   foo` (3-space marker) and continuation indent not in token
    310, // leading spaces before list markers (0–3) stripped by Marked
    311, // leading spaces before ordered-list numbers stripped by Marked
    312, // leading spaces before bullet markers stripped
    313, // leading spaces before ordered-list markers stripped

    47,
    50,
    51,
    52,
    53,
    54,
    60,
    61,
    105
]);

describe('Commonmark', () => {

    Object.entries(sections).forEach(([section, tests]) => {
        describe(section, () => {
            tests.forEach((test) => {

                const testFn = skippedBecauseOfTokenizationLimitations.has(test.example) ? it.fails : it;

                testFn(`${test.section} ${test.example}`, async () => {
                    const markdownMarked = marked.use(markedMarkdownRenderer())
                    const result = (await markdownMarked.parse(test.markdown)).trim();

                    const expected = test.markdown + '\n';
                    expect(result).toEqual(expected.trim());
                });
            });
        });
    });
});
