import { Tokens } from 'marked';

/**
 * renders the space to markdown
 * @returns the renderer
 */
export default function markedCodeRenderer(code : Tokens.Code) : string {
    return `\`\`\`${code.lang}\n${code.text}\n\`\`\``;
}
