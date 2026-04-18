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

the `link` token now contains `autolink?: boolean`, which allows the renderer to distinguish autolinks from normal markdown links.

however, this is still not enough to fully reconstruct the original autolink syntax:

- `<http://example.com>` and `http://example.com` both produce `type: 'link'` with `autolink: true` and the same `href`/`text` values.
- `<user@example.com>` and `user@example.com` both produce `type: 'link'` with `autolink: true` and the same visible text after removing `mailto:` from `href`.

without using `Tokens.raw`, the renderer cannot know whether angle brackets were present in the original markdown, so it must choose a canonical output form. this renderer chooses angle-bracket autolinks.

## list



## code block

### ``` or indented code block

the AST tokens does not contain the original code block type. so the renderer should be able to recreate the original code block type.

