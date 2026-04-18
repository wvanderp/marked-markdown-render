import { Renderer, Tokens } from 'marked';

/**
 * renders the blockquote to markdown
 * @returns the renderer
 */
export default function blockquoteRenderer(this: Renderer, blockquote : Tokens.Blockquote) : string {
    const renderedLines = blockquote.tokens
        .map((token) => {
            if (token.type === 'space') {
                return '';
            }

            return this.parser.parse([token]);
        })
        .flatMap((token) => token.split('\n'));

    // blockquote.text preserves trailing newline-based empty quote lines.
    const expectedLineCount = blockquote.text.split('\n').length;

    while (renderedLines.length < expectedLineCount) {
        renderedLines.push('');
    }

    return renderedLines
        .map((line) => line.length === 0 ? '>' : `> ${line}`)
        .join('\n');
}
