import { Tokens } from 'marked';

/**
 * renders the heading to markdown
 * @returns the renderer
 */
export default function headingRenderer(heading: Tokens.Heading): string {
    if (heading.style === 'atx') {
        return `${'#'.repeat(heading.depth)} ${heading.text}\n`;
    } else {
        // For setext headings, the underline length matches the last line of the heading text.
        // Multi-line heading text (text contains \n) has the last line as the reference.
        const lastLine = heading.text.split('\n').at(-1)!;

        if (heading.depth === 1) {
            return `${heading.text}\n${'='.repeat(lastLine.length)}\n`;
        }

        if (heading.depth === 2) {
            return `${heading.text}\n${'-'.repeat(lastLine.length)}\n`;
        }
    }
    throw new Error(`Unknown heading style: ${heading.style}`);
}
