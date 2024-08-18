import { Tokens } from 'marked';

/**
 * renders the HTML token to markdown
 * @returns the renderer
 */
export default function HTMLRenderer(html : Tokens.HTML) : string {
    return html.text;
}
