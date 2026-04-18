import { decode } from 'html-entities';
import { Tokens } from 'marked';

function getFence(value: string): string {
    const runLengths = new Set((value.match(/`+/g) || []).map((run) => run.length));
    let fenceLength = 1;

    while (runLengths.has(fenceLength)) {
        fenceLength += 1;
    }

    return '`'.repeat(fenceLength);
}

/**
 * renders the codespan to markdown
 * @returns the renderer
 */
export default function codespanRenderer(code : Tokens.Codespan) : string {
    const decoded = decode(code.text);
    const fence = getFence(decoded);

    // Re-add one boundary space on each side when both sides were spaces and
    // content is not all spaces. Marked strips this pair in codespan text.
    const hasBothEdgeSpaces = decoded.startsWith(' ') && decoded.endsWith(' ');
    const isAllSpaces = decoded.trim().length === 0;
    const hasEdgeBacktick = decoded.startsWith('`') || decoded.endsWith('`');

    if ((!isAllSpaces && hasBothEdgeSpaces) || hasEdgeBacktick) {
        return `${fence} ${decoded} ${fence}`;
    }

    return `${fence}${decoded}${fence}`;
}
