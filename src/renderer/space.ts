import { Tokens } from 'marked';

/**
 * Renders the space to markdown
 * The space token represents a sequence of newlines between block-level elements.
 * The lexer absorbs a single newline into the previous token, so space tokens
 * only appear when there are 2+ newlines. The `lines` property indicates exactly
 * how many newlines to insert.
 * 
 * @returns the renderer
 */
export default function spaceRenderer(space : Tokens.Space) : string {
    return '\n'.repeat(space.lines - 1);
}
