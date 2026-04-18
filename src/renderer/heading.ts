import { Tokens } from 'marked';

/**
 * renders the heading to markdown
 * @returns the renderer
 */
export default function headingRenderer(heading: Tokens.Heading): string {
    if (heading.style === 'atx') {
        return `${'#'.repeat(heading.depth)} ${heading.text}\n`;
    } else {

        if (heading.depth === 1) {
            return `${heading.text}\n${'='.repeat(heading.text.length)}\n`;
        }

        if (heading.depth === 2) {
            return `${heading.text}\n${'-'.repeat(heading.text.length)}\n`;
        }
    }
    throw new Error(`Unknown heading style: ${heading.style}`);
}
