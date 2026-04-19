import { Tokens } from 'marked';

/**
 * renders the text token to markdown
 * @returns the renderer
 */
export default function textRenderer(text : Tokens.Text | Tokens.Escape) : string {
    if (text.type === 'escape') {
        return '\\' + text.text;
    }
    return text.text;
}
