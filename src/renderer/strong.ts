import { Tokens } from 'marked';

/**
 * renders the text strong to markdown
 * @returns the renderer
 */
export default function strongRenderer(strong : Tokens.Strong) : string {
    switch (strong.raw[0]) {
        case '_':
            return `__${strong.text}__`;
        case '*':
            return `**${strong.text}**`;
        default:
            return `**${strong.text}**`;
    }
}
