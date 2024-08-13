import { Tokens } from 'marked';

/**
 * renders the code block to a code block
 * @returns the renderer
 */
export default function markedCodeRenderer(code : Tokens.Code) : string {
    return `\`\`\`${code.lang}\n${code.text}\n\`\`\``;
}
