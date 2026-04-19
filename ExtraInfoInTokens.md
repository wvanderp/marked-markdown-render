# missing info

The AST tokens does not contain all the information fully recreated the original markdown document. some information is missing.

this document contains some examples of missing information.


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

Because of this, the renderer canonicalizes destinations to the simplest valid form: balanced parentheses are emitted without escaping, and backslashes are only escaped when followed by ASCII punctuation. The exact original byte form cannot always be reconstructed from tokens alone. This affects CommonMark example 495.


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

Because of this, the renderer must choose a canonical form for these cases and cannot always reproduce byte-exact image syntax from tokens alone.


## lists

The list and list_item tokens do not preserve indentation-style metadata for continuation blocks.

Missing details include:
- Whether continuation indentation after a list marker used tabs or spaces
- The exact indentation width/style used for loose-paragraph continuation lines inside a list item
- Whether leading indentation before the list marker was stylistic and should be preserved in a byte-exact round trip

Because of this, two inputs that parse to equivalent list tokens can differ in source bytes (for example CommonMark Tabs example 4: `- foo` followed by a tab-indented continuation paragraph). The renderer can emit a valid equivalent list structure, but cannot always reconstruct the exact original tab/space continuation form from tokens alone.


## fenced code blocks

The `Tokens.Code` token for a fenced code block only stores `codeBlockStyle: "fenced"`, the info string in `lang`, and the code body in `text`. All fence-formatting details are lost.

Missing details:
- The fence character: whether the original used backtick (`` ` ``) or tilde (`~`) fences — both produce identical tokens
- The fence length: whether the opening fence was ` ``` ` (3), ```` ```` ```` (4), or `~~~~` (4), etc.
- Leading indentation on the fence lines (up to 3 spaces), which is stripped before token creation
- Whether the fenced block was closed by a matching closing fence or ran to end-of-input/end-of-blockquote

Because of this, the renderer always emits backtick fences of length 3 (`` ``` ``) with no leading indentation and an explicit closing fence. Tilde-fenced blocks, over-length fences, indented fences, and unclosed fences cannot be reproduced from tokens alone. This affects CommonMark examples 120–146 (except 119, 122, 129–130, 134, 140, 142).

The body of an empty fenced code block is rendered without an intervening blank line (i.e. `` ```\n``` `` rather than `` ```\n\n``` ``), matching the canonical closed-empty form.


## setext headings

The `Tokens.Heading` token preserves `style: "setext"`, `depth` (1 for `=`, 2 for `-`), and the trimmed heading text. Several source-form details are lost.

Missing details:
- The length of the underline sequence — any number of `=` or `-` characters is valid and the count is not stored
- Leading spaces before the heading text line (up to 3 spaces), which are stripped
- Trailing whitespace on the heading text line (e.g. a trailing tab or double-space), which is stripped
- For multi-line setext headings (heading text containing a newline), the underline was conventionally aligned to the *last* line, which the renderer reproduces

Because of this, the renderer emits a setext underline whose length matches the last line of the heading text (the most common convention). Headings with an underline of different length, or with leading/trailing whitespace, cannot be reproduced exactly from tokens alone. This affects CommonMark setext heading examples 82, 83, 84, 86, 88, 89, 91, 93, 99, 101, and 105.
