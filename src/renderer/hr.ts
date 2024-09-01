import { Tokens } from 'marked';

/**
 * renders the hr token to markdown
 * @returns the renderer
 */
export default function hrRenderer(hr : Tokens.Hr) : string {
    // TODO: cant implement without looking at the raw value
    const firstChar = hr.raw[0];
    switch (firstChar) {
        case '*':
        case '-':
        case '_':
            return `${firstChar.repeat(3)}`;
        default:
            throw new Error(`Unknown hr type: ${firstChar}`);
    }
}
