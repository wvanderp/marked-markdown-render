import { Tokens } from 'marked';

/**
 * renders the italic (em) text to markdown
 * @returns the renderer
 */
export default function emRenderer(em : Tokens.Em) : string {
    // check which type of em this is
    switch (em.raw[0]) {
        case '_':
            return `_${em.text}_`;
        case '*':
            return `*${em.text}*`;
        default:
            return `_${em.text}_`;
    }
}
