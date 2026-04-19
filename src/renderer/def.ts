import { Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle } from './linkSyntax';

/**
 * renders the def token to markdown
 * @returns the renderer
 */
export default function defRenderer(this: { options?: { tokenizer?: { lexer?: { tokens?: Tokens.Generic[] } } } }, def : Tokens.Def) : string {
    return `[${def.tag}]: ${formatLinkDestination(def.href)}${formatLinkTitle(def.title)}\n`;
}
