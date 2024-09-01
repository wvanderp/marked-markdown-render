import { Renderer, Tokens } from 'marked';

/**
 * renders the table to markdown
 * @returns the renderer
 */
export default function tableRenderer(this: Renderer, table : Tokens.Table) : string {
    const header = table.header.map((cell) => `| ${cell.text} `).join('') + '|';
    const separator = table.header.map((cell) => {
        switch (cell.align) {
            case 'center':
                return '|:--:';
            case 'right':
                return '|--:';
            case 'left':
                return '|:--';
            default:
                return '|--';
        }
    } ).join('') + '|';

    const rows = table.rows.map((row) => {
        return row.map((cell) => `| ${this.parser.parseInline(cell.tokens)} `).join('') + '|';
    }).join('\n');

    return `${header}\n${separator}\n${rows}\n`;
}
