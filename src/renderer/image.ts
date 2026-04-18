import { Renderer, Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle, renderInlineTokens } from './linkSyntax';

/**
 * renders a image token to markdown
 * @returns the renderer
 */
export default function imageRenderer(this: Renderer, image : Tokens.Image) : string {
    const alt = renderInlineTokens(this, image.tokens) || image.text;

    return `![${alt}](${formatLinkDestination(image.href)}${formatLinkTitle(image.title)})`;
}
