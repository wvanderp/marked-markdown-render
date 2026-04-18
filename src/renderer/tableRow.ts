import { Tokens } from 'marked';

/**
 * renders the table row to markdown
 * Noop because the table is rendered as a whole in the table renderer, so the row renderer does not need to do anything.
 * @returns the renderer
 */
export default function tableRowRenderer(tableRow : Tokens.TableRow) : string {
    return ``;
}
