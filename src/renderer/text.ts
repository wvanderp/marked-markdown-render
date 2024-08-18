import { Tokens } from 'marked';

/**
 * renders the text token to markdown
 * @returns the renderer
 */
export default function textRenderer(text : Tokens.Text) : string {
    console.log(text);
    return text.text;
}
