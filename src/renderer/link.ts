import { Renderer, Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle, renderInlineTokens } from './linkSyntax';
/**
 * renders the link to markdown
 * @returns the renderer
 */
export default function linkRenderer(this: Renderer, link : Tokens.Link) : string {
    const text = renderInlineTokens(this, link.tokens) || link.text;

    if (link.autolink) {
        // choose angle-bracket form as canonical output for autolink tokens
        if (link.href === 'mailto:' + text) {
            return `<${text}>`;
        }

        return `<${link.href}>`;
    }

    return `[${text}](${formatLinkDestination(link.href)}${formatLinkTitle(link.title)})`;
}
