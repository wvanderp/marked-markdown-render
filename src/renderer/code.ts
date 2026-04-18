import { Tokens } from 'marked';

/**
 * renders the code block to a code block
 * @returns the renderer
 */
export default function codeRenderer(code : Tokens.Code) : string {
    if (code.codeBlockStyle === 'indented') {
        return code.text.replace(/\n$/, '').split('\n').map(line => `    ${line}`).join('\n') + '\n';
    }

    return `\`\`\`${code.lang ? code.lang : ''}\n${code.text}\n\`\`\`\n`;
}
