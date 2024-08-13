import { Tokens } from 'marked';

/**
 * renders the link to markdown
 * @returns the renderer
 */
export default function linkRenderer(link : Tokens.Link) : string {
    return `[${link.text}](${link.href})`;
}
