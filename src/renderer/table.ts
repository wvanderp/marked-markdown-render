import { Renderer, Tokens } from 'marked';

/**
 * renders the table to markdown
 * @returns the renderer
 */
export default function tableRenderer(this: Renderer, table : Tokens.Table) : string {
    // Render all cell contents from tokens
    const headerContents = table.header.map(cell => this.parser.parseInline(cell.tokens));
    const rowContents = table.rows.map(row =>
        row.map(cell => this.parser.parseInline(cell.tokens))
    );

    // Calculate column widths (max content length per column, minimum 1)
    const columnWidths = headerContents.map((content, i) => {
        const widths = [content.length, ...rowContents.map(row => row[i].length)];
        return Math.max(...widths, 1);
    });

    // Render header row
    const header = headerContents.map((content, i) =>
        `| ${content.padEnd(columnWidths[i])} `
    ).join('') + '|';

    // Render separator row
    const separator = table.header.map((cell, i) => {
        const width = columnWidths[i] + 2;
        switch (cell.align) {
            case 'center':
                return '|:' + '-'.repeat(width - 2) + ':';
            case 'right':
                return '|' + '-'.repeat(width - 1) + ':';
            case 'left':
                return '|:' + '-'.repeat(width - 1);
            default:
                return '|' + '-'.repeat(width);
        }
    }).join('') + '|';

    // Render body rows with alignment-aware padding
    const rows = rowContents.map(row =>
        row.map((content, i) => {
            const align = table.header[i].align;
            const width = columnWidths[i];
            switch (align) {
                case 'right':
                    return `| ${content.padStart(width)} `;
                case 'center': {
                    const totalPad = width - content.length;
                    const leftPad = Math.floor(totalPad / 2);
                    const rightPad = totalPad - leftPad;
                    return `| ${' '.repeat(leftPad)}${content}${' '.repeat(rightPad)} `;
                }
                default:
                    return `| ${content.padEnd(width)} `;
            }
        }).join('') + '|'
    ).join('\n');

    if (rows) {
        return `${header}\n${separator}\n${rows}`;
    }
    return `${header}\n${separator}`;
}
