import { Tokens } from 'marked';

/**
 * renders the italic (em) text to markdown
 * @returns the renderer
 */
export default function emRenderer(em : Tokens.Em) : string {
    return `_${em.text}_`;
}
