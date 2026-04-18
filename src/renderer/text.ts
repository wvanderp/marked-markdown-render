import { Tokens } from 'marked';
import { decode } from 'html-entities';

/**
 * renders the text token to markdown
 * @returns the renderer
 */
export default function textRenderer(text : Tokens.Text | Tokens.Escape) : string {
    if (text.type === 'escape') {
        return '\\' + text.text;
    }
    return decode(text.text);
}
