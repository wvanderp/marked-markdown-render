import { Tokens } from 'marked';

/**
 * renders the heading to markdown
 * @returns the renderer
 */
export default function headingRenderer(heading : Tokens.Heading) : string {
    return `${'#'.repeat(heading.depth)} ${heading.text}\n`;
}
