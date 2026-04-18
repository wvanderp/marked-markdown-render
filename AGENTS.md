This is a from scratch implementation of a markdown renderer. The idea is to go from AST tokens to markdown text, without losing any information or looking at the original markdown text. 

It is forbidden to look at the original markdown text, because that would defeat the purpose of this project. The goal is to be able to recreate the original markdown text from the AST tokens, without looking at the original markdown text.

the `Tokens.raw` property is not allowed to be used, because it contains the original markdown text for that token.

We can not change the marked library, but we can use the fuctionality provided to the fullest extent possible. If its realy not possible to recreate the original markdown text from the AST tokens, then then document this in the `ExtraInfoInTokens.md` file, and explain what information is missing and how to recreate it.

We should not introduce changes to the parsing process, because that fully upto the marked library, and we should not change it.