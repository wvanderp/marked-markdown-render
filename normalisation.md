# Normalisation

## Thematic breaks (`hr`)

The `Tokens.Hr` token only provides `character` (`*`, `-`, or `_`).
Formatting details from the original markdown are not available in the token:

- Number of characters (for example `***` vs `*****`)
- Spaces between characters (for example `* * * *`)
- Leading or trailing spaces

Because of this, the renderer uses a canonical output form for thematic breaks:

- `*` -> `***\n`
- `-` -> `---\n`
- `_` -> `___\n`

This is an intentional normalization step. The output is equivalent markdown, but not always byte-identical to the source.

examples:

- `****` renders as `***\n`
- `* * * *` renders as `***\n`
- `-----` renders as `---\n`
- `- - - - -` renders as `---\n`
- `______` renders as `___\n`
- `_ _ _ _    _` renders as `___\n`

## Setext headings (`heading`)

For setext headings (`depth` 1 or 2), the underline is normalized to match the
length of the last line of heading text.

Why this happens:

- The renderer receives heading text and depth from the token.
- During rendering, it computes `lastLine = heading.text.split('\n').at(-1)`.
- It then renders:
  - depth `1` with `=` repeated `lastLine.length` times
  - depth `2` with `-` repeated `lastLine.length` times

This means the underline length is canonicalized to the heading text width and
may differ from the original markdown underline length.

examples:

- `setext\n===` renders as `setext\n======\n`
- `setext\n==============` renders as `setext\n======\n`
- `Title\nLine\n-------` renders as `Title\nLine\n----\n`
