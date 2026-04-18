import { Tokens } from 'marked';

/**
 * renders the table cell to markdown
 * Noop because the table is rendered as a whole in the table renderer, so the cell renderer does not need to do anything.
 * @returns the renderer
 */
export default function tableCellRenderer(tableCell : Tokens.TableCell) : string {
    return ``;
}
