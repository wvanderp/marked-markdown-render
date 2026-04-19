import { Tokens } from 'marked';

/**
 * renders the HTML token to markdown
 * Block-level HTML gets a trailing newline so that following space tokens
 * can form the correct blank-line separation.  Inline HTML (Tokens.Tag
 * inside paragraph tokens) is returned verbatim.
 * @returns the renderer
 */
export default function HTMLRenderer(html : Tokens.HTML | Tokens.Tag) : string {
    if (html.block) {
        // Some HTML blocks (type 1: script/pre/style) already include a trailing
        // newline in `text`; others don't.  We need exactly one trailing newline so
        // that the following space token can produce the correct blank-line gap.
        return html.text.endsWith('\n') ? html.text : html.text + '\n';
    }
    return html.text;
}
