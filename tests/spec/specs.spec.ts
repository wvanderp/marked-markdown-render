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



// Tests that are inherent limitations: the AST doesn't preserve enough info to round-trip
const skipTests = new Set([
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
    47, // hr leading spaces not preserved in token (only `character` property exists)
    50, // hr repetition count not preserved (37 underscores → 3)
    51, // hr spacing between characters not preserved (` - - -` → `---`)
    52, // hr spacing pattern not preserved (` **  * ** * ** * **` → `***`)
    53, // hr spacing between characters not preserved (`-     -      -      -` → `---`)
    54, // hr trailing spaces not preserved (`- - - -    ` → `---`)
    60, // hr spacing `* * *` not preserved, renders as `***` (ambiguous with list)
    61, // hr `* * *` inside list item not preserved (renders as `***`)
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
    105, // `* * *` thematic break rendered as `***` (hr spacing not preserved)

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
]);

describe('Commonmark', () => {

    Object.entries(sections).forEach(([section, tests]) => {
        describe(section, () => {
            tests.forEach((test) => {
                const testFn = skipTests.has(test.example) ? it.skip : it;
                testFn(`${test.section} ${test.example}`, () => {
                    const markdownMarked = marked.use(markedMarkdownRenderer())

                    // @ts-expect-error
                    expect(markdownMarked.parse(test.markdown).trim()).toBe(test.markdown.trim());
                });
            });
        });
    });
});
