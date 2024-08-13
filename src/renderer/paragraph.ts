import { Tokens } from 'marked';

/**
 * renders the paragraph to markdown
 * @returns the renderer
 */
export default function paragraphRenderer(paragraph : Tokens.Paragraph) : string {
    return paragraph.text + '\n';
}
