import { Tokens } from 'marked';

/**
 * renders the heading to markdown
 * @returns the renderer
 */
export default function headingRenderer(heading : Tokens.Heading) : string {
    if (heading.raw.startsWith('#')) { 
        return `${'#'.repeat(heading.depth)} ${heading.text}\n\n`;
    }

    if (heading.depth === 1) {
        return `${heading.text}\n${'='.repeat(heading.text.length)}\n\n`;
    }

    if (heading.depth === 2) {
        return `${heading.text}\n${'-'.repeat(heading.text.length)}\n\n`;
    }

    return `${'#'.repeat(heading.depth)} ${heading.text}\n\n`;
}
