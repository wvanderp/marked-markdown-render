import { Tokens } from 'marked';

/**
 * renders the code block to a code block
 * @returns the renderer
 */
export default function codeRenderer(code : Tokens.Code) : string {
    if (code.codeBlockStyle === 'indented') {
        // Blank lines must not receive the 4-space prefix — they would change
        // the parsed text if re-lexed (an indented blank line is still blank).
        return code.text.replace(/\n$/, '').split('\n').map(line => line ? `    ${line}` : '').join('\n') + '\n';
    }

    const lang = code.lang ?? '';
    // When the code body is empty, omit the blank line that would otherwise
    // appear between the opening and closing fence.
    const body = code.text ? `${code.text}\n` : '';
    return `\`\`\`${lang}\n${body}\`\`\`\n`;
}
