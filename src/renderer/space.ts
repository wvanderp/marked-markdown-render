import { Tokens } from 'marked';

/**
 * Renders the space to markdown
 * @returns the renderer
 */
export default function spaceRenderer(space : Tokens.Space) : string {
    // todo relies on raw value
    // count the number of newlines in the raw value
    // and return that many newlines
    const newlines = space.raw.split('\n').length - 1;
    
    return `\n`.repeat(newlines);
}
