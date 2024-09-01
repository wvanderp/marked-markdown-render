import { Renderer, Tokens } from 'marked';
import listItemRenderer from './listItem';

/**
 * renders the list token to markdown
 * @returns the renderer
 */
export default function listRenderer(this: Renderer, list : Tokens.List) : string {
    return renderMarkdownList([list]);	
}


function renderMarkdownList(ast, indent = 0) {
    let markdown = '';

    ast.forEach(item => {
        if (item.type === 'list') {
            let currentIndent = indent;
            item.items.forEach((listItem, index) => {
                let prefix;
                
                if (item.ordered) {
                    prefix = `${(item.start || index + 1)}. `;
                } else {
                    prefix = '* ';
                }

                let checkbox = '';
                if (listItem.task) {
                    checkbox = listItem.checked ? '[x] ' : '[ ] ';
                }

                markdown += ' '.repeat(currentIndent) + prefix + checkbox + renderMarkdownText(listItem.tokens) + '\n';
                
                // Handle nested lists within list items
                listItem.tokens.forEach(token => {
                    if (token.type === 'list') {
                        markdown += renderMarkdownList([token], currentIndent + 2);
                    }
                });
            });
        }
    });

    return markdown;
}

function renderMarkdownText(tokens) {
    let text = '';
    tokens.forEach(token => {
        if (token.type === 'text') {
            text += token.text;
        } else if (token.type === 'space') {
            text += '\n\n'; // Handle explicit spaces for items like "Some text that should be aligned with the above item."
        }
    });
    return text;
}
