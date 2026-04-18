# missing info

The AST tokens does not contain all the information fully recreated the original markdown document. some information is missing.

this document contains some examples of missing information.

## space

the space token seem to be a token to add space between elements. and should be rendered as empty lines in markdown.
but the parsed tokens does not indicate how many empty lines should be added. so it should be up to the renderer to decide how many empty lines should be added.

## link

when the link is a reference link, the AST tokens does not contain original reference link. 
it only contains the url reference. so the renderer should be able to recreate the original reference link.

### autolink angle brackets

the AST tokens does not distinguish between `<http://example.com>` (angle bracket autolink) and `http://example.com` (bare autolink). both produce identical tokens. the renderer defaults to bare autolink form without angle brackets.

## list



## code block

### ``` or indented code block

the AST tokens does not contain the original code block type. so the renderer should be able to recreate the original code block type.

