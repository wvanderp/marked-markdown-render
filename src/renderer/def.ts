import { Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle } from './linkSyntax';

function hasFollowingDefinitionToken(def: Tokens.Def, parser: { options?: { tokenizer?: { lexer?: { tokens?: Tokens.Generic[] } } } }): boolean {
    const tokens = parser.options?.tokenizer?.lexer?.tokens;

    if (!tokens) {
        return false;
    }

    const index = tokens.indexOf(def as unknown as Tokens.Generic);

    if (index < 0) {
        return false;
    }

    return tokens[index + 1]?.type === 'def';
}

/**
 * renders the def token to markdown
 * @returns the renderer
 */
export default function defRenderer(this: { options?: { tokenizer?: { lexer?: { tokens?: Tokens.Generic[] } } } }, def : Tokens.Def) : string {
    const separator = hasFollowingDefinitionToken(def, this) ? '\n' : '';

    return `[${def.tag}]: ${formatLinkDestination(def.href)}${formatLinkTitle(def.title)}${separator}`;
}
