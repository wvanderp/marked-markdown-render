import { Tokens } from 'marked';
import { decode } from 'html-entities';
/**
 * renders the link to markdown
 * @returns the renderer
 */
export default function linkRenderer(link : Tokens.Link) : string {
    // detect auto links
    if (link.raw[0] === '<') {
        return `<${link.href}>`;
    }
    // detect hidden auto links
    if (link.raw[0] !== '[') {
        return link.href;
    }
    return `[${link.text}](${link.href}${link.title ? ` "${decode(link.title)}"` : ''})`;
}
