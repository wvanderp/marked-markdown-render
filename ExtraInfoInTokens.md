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

The link token does not preserve the original empty-destination delimiter style.

Missing detail:
- Whether an empty destination was written as `[]()` or `[](<>)` (both parse to `href = ""`)

Because of this, the renderer canonicalizes empty link destinations to `()`. The exact `(<>)` source form cannot be reconstructed from tokens without using forbidden source text fields.
