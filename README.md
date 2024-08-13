# marked-markdown-render

in this repo you will find the best markdown to markdown renderer in the world. 

The idea of this package is for you to take marked and parse markdown into a AST. that AST can be manipulated and then converted back into markdown.

## Installation
```bash
npm install marked-markdown-render
```

## Usage
```javascript
import marked from 'marked';
import { markedMarkdownRenderer } from 'marked-markdown-render';

const markdownMarked = marked.use(markedMarkdownRenderer());

const markdown = markdownMarked.parse('# Hello World'); // # Hello World
```

but the more interesting part is when you manipulate the AST and then convert it back to markdown.

```javascript
import marked from 'marked';
import { markedMarkdownRenderer } from 'marked-markdown-render';

const markdownMarked = marked.use(markedMarkdownRenderer());

const ast = markdownMarked.lex('# Hello World');
ast[1].raw = 'Hello Universe';

const markdown = markdownMarked.render(ast); // # Hello Universe
```

## a note about accuracy

In the process of lexing markdown some information gets lost. This package will return opinionated markdown. This means that the markdown that is returned might not be 100% the same as the markdown that was parsed. but it should result in the same HTML when parsed by marked again.
