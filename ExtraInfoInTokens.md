# missing info

The AST tokens does not contain all the information fully recreated the original markdown document. some information is missing.

this document contains some examples of missing information.

## space (blank lines)

The `Tokens.Space` token only records the number of blank lines (`lines`) and does not preserve any whitespace content within those lines.

Missing details:

- Whitespace-only lines (e.g. a blank line containing `   ` three spaces) — the raw form stores the spaces, but the `lines` count does not; the spaces are irretrievably lost
- Trailing whitespace on the final line before the blank-line block — for example the `  ` in `text  \n\nmore text` is captured in the space token's `raw` (`"  \n\n"`) but not in `lines`, so it cannot be recovered

Because of this, the renderer always emits truly empty blank lines (no whitespace content). Source files that use whitespace-only blank lines (e.g. for indented continuation blocks) will have those spaces removed in the rendered output.

## table

The table token does not preserve:

- Whether the original table had outer pipes (e.g. `| A | B |` vs `A | B`)
- The exact padding/whitespace within cells
- The exact number of dashes in the separator line

The renderer normalizes all tables to use outer pipes, consistent column widths (based on max content length), and alignment-aware padding (left-pad for right-aligned, centered for center-aligned, right-pad otherwise). Tables without outer pipes or with non-standard padding will be reformatted.

## codespan

The codespan token does not preserve enough information to always reconstruct the exact original markdown form.

Missing details include:

- Whether the source used boundary padding spaces vs no padding when both produce the same code text (for example: `` ` b ` `` and `` `b` `` can both parse to `codespan.text = "b"`)
- Whether the source was written as a multiline codespan vs a single-line form when newlines are normalized/collapsed by the lexer
- The exact original delimiter style in ambiguous cases where multiple valid delimiter choices produce the same parsed text
- Whether padding spaces around a codespan were stylistic vs required by delimiter choice (for example CommonMark examples 329 and 340)
- Whether neighboring inline tokens ended/started with backticks, which can force a different codespan delimiter length at render time (for example CommonMark example 349)

Because of this, the renderer can only emit a valid equivalent codespan, not always the exact original bytes, for some CommonMark examples (for example 329, 333, 335, 336, 337, 340, and 349 in the CommonMark suite used by this repository).

## links

The link token does not preserve enough information to always reconstruct the exact original destination syntax.

Missing details:

- Whether an empty destination was written as `[]()` or `[](<>)` (both parse to `href = ""`)
- Whether balanced parentheses in a plain destination were written escaped or unescaped, for example `[link](\(foo\))` vs `[link]((foo))` (both parse to `href = "(foo)"`)
- Whether a backslash in a plain destination was a literal backslash or part of a backslash-escape sequence, for example `[link](foo\bar)` is unambiguous (`href = "foo\bar"`) but if the href contains a backslash followed by ASCII punctuation the renderer cannot determine whether the source used `\\` or a backslash-escape
- Whether an angle-bracketed destination `<b)c>` or `<foo(and(bar)>` was used vs an escaped plain destination — the token only stores the resolved href, so both forms produce the same token
- Whether backslash escapes in the href were originally present, for example `foo\)\:` resolves to `foo):` and the original escaping is lost
- The title delimiter style: `"title"`, `'title'`, or `(title)` — only the resolved title string is stored
- Whether an escaped quote appeared in the title and which delimiter was used, for example `"title \"&quot;"` — the token stores the resolved title with literal quotes
- Whitespace and newlines inside the destination/title area, for example `(   /uri\n  "title"  )` is normalized to `href="/uri", title="title"`
- Whether the link used collapsed reflink syntax `[foo][]` or shortcut reflink syntax `[foo]` — both parse to a `reflink` token with identical fields
- Reference label case: `[BaR]` is normalized to `bar` in the definition tag, so the original casing of the reference label in `[text][BaR]` is lost
- Unicode case folding in reference labels: `[SS]` is normalized to `ss`, so `[ẞ]` matching `[SS]` cannot reproduce the original label
- Multiline definition labels: `[Foo\n  bar]` is normalized to `foo bar`, so the original line breaks and indentation are lost
- Duplicate definitions: when multiple definitions exist for the same label (e.g. `[foo]: /url1` and `[foo]: /url2`), only the first is used and the second is lost from the token stream

Because of this, the renderer canonicalizes destinations to the simplest valid form: balanced parentheses are emitted without escaping, backslashes are only escaped when followed by ASCII punctuation, titles use `"` by default (falling back to `'` if the title contains `"`), and reflinks use shortcut syntax when the text matches the tag. The exact original byte form cannot always be reconstructed from tokens alone. This affects CommonMark examples 486, 492, 495, 499, 500, 505, 506, 510, 539, 540, 541, 544, 553, 554, 555, and 566.

## link reference definitions

The definition token does not preserve the original source casing of the reference label.

Missing detail:

- Whether the original definition label used different case, for example `[BAR]: /url` (the token stores `tag = "bar"`)

Because of this, the renderer can only emit a normalized reference label when reconstructing from tokens. The exact original label casing cannot be reconstructed without using forbidden source text fields.

## thematic breaks (hr)

The hr token only preserves the `character` property (`*`, `-`, or `_`), which identifies which character was used for the thematic break. All other formatting details are lost.

Missing details:

- The number of characters used (e.g. `***` vs `_____________________________________`)
- Leading spaces before the characters (e.g. ` ***` or `   ***`)
- Spaces between the characters (e.g. `* * *` or `-     -      -      -`)
- Trailing spaces after the characters (e.g. `- - - -    `)

Because of this, the renderer always emits the minimal valid thematic break form: three consecutive characters with no spaces (e.g. `***`, `---`, `___`). The exact original formatting cannot be reconstructed from the token. This affects CommonMark examples 47, 50, 51, 52, 53, 54, 60, and 61.

## images

The image token does not preserve all source-form choices for destinations and reference-style syntax.

Missing details:

- Whether an inline destination without whitespace was written in bracketed form, for example `![foo](<url>)` vs `![foo](url)` (both parse to `href = "url"`)
- Whether a matching reference-style image used shortcut syntax `![foo]` or collapsed syntax `![foo][]` (both parse to reflink image tokens with equivalent fields)
- Reference label case in image definitions: `[FOOBAR]` is normalized to `foobar`, so `![foo *bar*][FOOBAR]` cannot reproduce the original label casing; similarly `[BAR]` → `bar`
- Extra whitespace before the title in inline images, for example `![foo](/path/to/train.jpg  "title")` (double space) — the token only stores the resolved href and title, so the extra space is lost

Because of this, the renderer must choose a canonical form for these cases and cannot always reproduce byte-exact image syntax from tokens alone. This affects CommonMark examples 576, 577, 579, 580, 583, 584, 585, and 586.

## lists

The list and list_item tokens do not preserve indentation-style metadata for continuation blocks.

Missing details include:

- Whether continuation indentation after a list marker used tabs or spaces
- The exact number of spaces between the list marker and the first content character when more than one space was used (e.g. `- ` vs `-   ` for an unordered item, or `1. ` vs `1.  ` for an ordered item) — only `list.bulletChar` / `list.orderChar` and the stripped `listItem.text` are available
- Whether a leading indent (0–3 spaces) appeared before the list marker — these are stripped by Marked and not recorded in any token field
- Zero-padded ordered list numbers (e.g. `003.`) — the token stores only the numeric value (`start: 3`)
- Trailing spaces after a list marker on an empty-content line (e.g. `-   ` with 3 trailing spaces)
- Whether the first line of a list item had no inline content and the content appeared on the next line (e.g. `-\n  foo` with trailing spaces like `-   \n  foo`) — trailing spaces are not preserved
- Leading-space indentation on same-level list items (e.g. `- foo\n - bar\n  - baz`) — Marked flattens these to equivalent tokens
- Hard-line-break trailing spaces absorbed into a space token: when a list item ends with `  ` (two trailing spaces, a hard line break marker) immediately followed by a blank line and continuation content that is not indented enough to belong to the same list item, Marked captures the `  ` in the subsequent `space` token's `raw` field rather than in the list item's token. The `space` token only stores a `lines` count, so the trailing `  ` is irretrievably lost.

The renderer uses a canonical one-space marker (`- item`, `1. item`) and infers continuation indentation from the minimum non-code-block leading-space count of continuation lines visible in `listItem.text`. When `listItem.text` starts with `\n` the content is placed on the next line (canonical no-trailing-space form). This affects CommonMark examples 254, 257, 258, 259, 260, 263, 268, 271, 276, 277, 279, 282, 286, 287, 288, 290, 291, 292, 293, 295, and 297.

## fenced code blocks

The `Tokens.Code` token for a fenced code block only stores `codeBlockStyle: "fenced"`, the info string in `lang`, and the code body in `text`. All fence-formatting details are lost.

Missing details:

- The fence character: whether the original used backtick (`` ` ``) or tilde (`~`) fences — both produce identical tokens
- The fence length: whether the opening fence was ` ``` ` (3), ` ` ````(4), or`~~~~` (4), etc.
- Leading indentation on the fence lines (up to 3 spaces), which is stripped before token creation
- Whether the fenced block was closed by a matching closing fence or ran to end-of-input/end-of-blockquote

- Leading whitespace in the info string — for example ` ``` bash ` stores `lang = "bash"` (the leading space is stripped); the original spacing before the language identifier cannot be recovered

Because of this, the renderer always emits backtick fences of length 3 (` ``` `) with no leading indentation and an explicit closing fence. Tilde-fenced blocks, over-length fences, indented fences, and unclosed fences cannot be reproduced from tokens alone. This affects CommonMark examples 120–146 (except 119, 122, 129–130, 134, 140, 142).

The body of an empty fenced code block is rendered without an intervening blank line (i.e. ` ```\n``` ` rather than ` ```\n\n``` `), matching the canonical closed-empty form.

## setext headings

The `Tokens.Heading` token preserves `style: "setext"`, `depth` (1 for `=`, 2 for `-`), and the trimmed heading text. Several source-form details are lost.

Missing details:

- The length of the underline sequence — any number of `=` or `-` characters is valid and the count is not stored
- Leading spaces before the heading text line (up to 3 spaces), which are stripped
- Trailing whitespace on the heading text line (e.g. a trailing tab or double-space), which is stripped
- For multi-line setext headings (heading text containing a newline), the underline was conventionally aligned to the _last_ line, which the renderer reproduces

Because of this, the renderer emits a setext underline whose length matches the last line of the heading text (the most common convention). Headings with an underline of different length, or with leading/trailing whitespace, cannot be reproduced exactly from tokens alone. This affects CommonMark setext heading examples 82, 83, 84, 86, 88, 89, 91, 93, 99, 101, and 105.

## ATX headings

The `Tokens.Heading` token for ATX headings preserves `style: "atx"`, `depth` (1–6), and the trimmed heading text. Several source-form details are lost.

Missing details:

- Optional closing `#` sequences — for example `### foo ###` is stored as `text = "foo"` with no record of the closing hashes or their count
- Multiple spaces between the `#` prefix and the text — for example `#                  foo` is stored as `depth = 1, text = "foo"` with no record of the extra spaces
- Leading spaces before the `#` prefix (up to 3 spaces) — for example `  ## foo` is stored with no record of the leading indent
- Whether an empty heading had trailing whitespace — for example `#` vs `# ` are indistinguishable in the token
- Trailing whitespace after the heading text — for example `### foo  ` is stored as `text = "foo"` with the trailing spaces stripped; any significance (e.g. as a hard line break marker) is lost

Because of this, the renderer always emits the canonical ATX heading form: `#` prefix, single space, text, no closing hashes, no leading indent (e.g. `### foo`). Empty headings are rendered as `# ` (with a trailing space) for depth 1, etc. This affects CommonMark examples 67, 68, 71, 72, 73, and 79.
