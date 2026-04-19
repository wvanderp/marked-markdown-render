import { Tokens } from 'marked';

/**
 * renders the hr token to markdown
 *
 * Marked only provides hr.character (`*`, `-`, `_`) on Tokens.Hr.
 * The original count/spacing cannot be reconstructed, so we intentionally
 * emit a canonical thematic break with exactly three characters.
 * @returns the renderer
 */
export default function hrRenderer(hr : Tokens.Hr) : string {
    switch (hr.character) {
        case '*':
        case '-':
        case '_':
            return `${hr.character.repeat(3)}\n`;
        default:
            throw new Error(`Unknown hr type: ${hr.character}`);
    }
}
