import { Token, Renderer, Tokens } from 'marked';

/**
 * renders the list token to markdown
 * @returns the renderer
 */
export default function listRenderer(this: Renderer, list : Tokens.List) : string {
    return renderMarkdownList([list]).replace(/\n$/, '');
}


function renderMarkdownList(ast: Tokens.List[], indent = 0): string {
    let markdown = '';

    ast.forEach((item) => {
        if (item.type === 'list') {
            const currentIndent = indent;
            item.items.forEach((listItem, index) => {
                let prefix;
                
                if (item.ordered) {
                    const start = typeof item.start === 'number' ? item.start : 1;

                    prefix = `${start + index}${item.orderChar || '.'} `;
                } else {
                    prefix = `${item.bulletChar || '*'} `;
                }

                let checkbox = '';
                if (listItem.task) {
                    checkbox = listItem.checked ? '[x] ' : '[ ] ';
                }

                markdown += ' '.repeat(currentIndent) + prefix + checkbox + renderMarkdownText(listItem.tokens) + '\n';
                
                // Handle nested lists within list items
                listItem.tokens.forEach((token) => {
                    if (token.type === 'list') {
                        markdown += renderMarkdownList([token as Tokens.List], currentIndent + 2);
                    }
                });
            });
        }
    });

    return markdown;
}

function renderMarkdownText(tokens: Token[]): string {
    let text = '';
    tokens.forEach((token) => {
        if (token.type === 'text') {
            text += token.text;
        } else if (token.type === 'space') {
            text += '\n\n'; // Handle explicit spaces for items like "Some text that should be aligned with the above item."
        }
    });
    return text;
}
