import { Renderer, Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle, renderInlineTokens } from './linkSyntax';
/**
 * renders the link to markdown
 * @returns the renderer
 */
export default function linkRenderer(this: Renderer, link : Tokens.Link) : string {
    const text = renderInlineTokens(this, link.tokens) || link.text;

    // standard links have a 'title' property (null or string), autolinks do not
    if ('title' in link) {
        return `[${text}](${formatLinkDestination(link.href)}${formatLinkTitle(link.title)})`;
    }

    // email autolink: href has mailto: prefix that text doesn't
    if (link.href === 'mailto:' + text) {
        return `<${text}>`;
    }

    // URL autolink
    return link.href;
}
