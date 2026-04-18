import { Tokens } from 'marked';

/**
 * renders the hr token to markdown
 * @returns the renderer
 */
export default function hrRenderer(hr : Tokens.Hr) : string {
    switch (hr.character) {
        case '*':
        case '-':
        case '_':
            return `${hr.character.repeat(3)}`;
        default:
            throw new Error(`Unknown hr type: ${hr.character}`);
    }
}
