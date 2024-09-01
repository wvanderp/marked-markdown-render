import { Renderer, Tokens } from 'marked';

/**
 * renders the listItems to markdown
 * @returns the renderer
 */
export default function listItemRenderer(this: Renderer, listItem : Tokens.ListItem) : string {
    return `${this.parser.parseInline(listItem.tokens)}`;
}
