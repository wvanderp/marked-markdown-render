import { Tokens } from 'marked';

/**
 * renders the hr token to markdown
 * @returns the renderer
 */
export default function hrRenderer(hr : Tokens.Hr) : string {
    return `---`;
}
