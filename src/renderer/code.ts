import { Tokens } from 'marked';

/**
 * renders the code block to a code block
 * @returns the renderer
 */
export default function codeRenderer(code : Tokens.Code) : string {
    // todo depends on the raw value
    if (code.raw.startsWith('```')) {
        return `\`\`\`${code.lang ? code.lang : ''}\n${code.text}\n\`\`\``;
    }

    return code.text.split('\n').map(line => `    ${line}`).join('\n') + '\n';
}
