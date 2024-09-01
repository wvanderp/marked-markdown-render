import { Tokens } from 'marked';

/**
 * renders the del token to markdown
 * also known as strikethrough
 * @returns the renderer
 */
export default function delRenderer(del : Tokens.Del) : string {
    return `~~${del.text}~~`;
}
