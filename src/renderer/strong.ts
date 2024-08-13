import { Tokens } from 'marked';

/**
 * renders the text strong to markdown
 * @returns the renderer
 */
export default function strongRenderer(strong : Tokens.Strong) : string {
    return `**${strong.text}**`;
}
