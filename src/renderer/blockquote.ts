import { Renderer, Tokens } from 'marked';

/**
 * renders the blockquote to markdown
 * @returns the renderer
 */
export default function blockquoteRenderer(this: Renderer, blockquote : Tokens.Blockquote) : string {
    console.log(blockquote.tokens
        .map((token) => this.parser.parse([token])));
    return blockquote.tokens
        .map((token) => {
            if (token.type === 'space') {
                return '';
            }
            return this.parser.parse([token]);
        })
        .flatMap((token) => token.split('\n'))
        .reduce((acc, cur) => acc + `> ` + cur + '\n', '')
        .trim();
}
