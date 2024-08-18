import { Renderer, Tokens } from 'marked';

/**
 * renders the paragraph to markdown
 * @returns the renderer
 */
export default function paragraphRenderer(this: Renderer, paragraph : Tokens.Paragraph) : string {
    return this.parser.parseInline(paragraph.tokens);
}
