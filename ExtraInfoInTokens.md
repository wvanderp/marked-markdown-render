# missing info

The AST tokens does not contain all the information fully recreated the original markdown document. some information is missing.

this document contains some examples of missing information.

## space

the space token seem to be a token to add space between elements. and should be rendered as empty lines in markdown.
but the parsed tokens does not indicate how many empty lines should be added. so it should be up to the renderer to decide how many empty lines should be added.

## link

when the link is a reference link, the AST tokens does not contain original reference link. 
it only contains the url reference. so the renderer should be able to recreate the original reference link.

## list

### the number used in the ordered list

the AST tokens does not contain the number used in the ordered list. so the renderer should be able to recreate the original number.

### the character used in the unordered list

the ast does not contain whether the original text used `*` or `-` or `+` to create the unordered list. so the renderer should be able to recreate the original character used in the unordered list.

## code block

### ``` or indented code block

the AST tokens does not contain the original code block type. so the renderer should be able to recreate the original code block type.

## hr

### the character used in the hr

we cant know what character was used in the hr. so the renderer should be able to recreate the original character used in the hr.
some markdown parsers use `*` or `-` or `_` to create hr. so the renderer should be able to recreate the original character used in the hr.

## heading

### the type of heading

we cant know what type of heading was used. it can be the hash `#` or the underline `=` or `-`. so the renderer should be able to recreate the original type of heading.
