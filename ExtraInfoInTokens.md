# missing info

The AST tokens does not contain all the information fully recreated the original markdown document. some information is missing.

this document contains some examples of missing information.


## space

the space token seem to be a token to add space between elements. and should be rendered as empty lines in markdown.
but the parsed tokens does not indicate how many empty lines should be added. so it should be up to the renderer to decide how many empty lines should be added.



## table

The table token does not preserve:
- Whether the original table had outer pipes (e.g. `| A | B |` vs `A | B`)
- The exact padding/whitespace within cells
- The exact number of dashes in the separator line

The renderer normalizes all tables to use outer pipes, consistent column widths (based on max content length), and alignment-aware padding (left-pad for right-aligned, centered for center-aligned, right-pad otherwise). Tables without outer pipes or with non-standard padding will be reformatted.
