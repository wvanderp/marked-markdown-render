import { Renderer, Tokens } from 'marked';

/**
 * renders the list token to markdown
 * @returns the renderer
 */
export default function listRenderer(this: Renderer, list : Tokens.List) : string {
    return renderList.call(this, list);
}

function renderList(this: Renderer, list: Tokens.List): string {
    const start = typeof list.start === 'number' ? list.start : 1;
    let nextOrderedValue = start;

    const renderedItems = list.items.map((listItem) => {
        let markerPrefix;

        if (list.ordered) {
            const itemValue = typeof listItem.value === 'number' ? listItem.value : nextOrderedValue;

            /* v8 ignore next -- marked always sets orderChar */
            markerPrefix = `${itemValue}${list.orderChar || '.'}`;
            nextOrderedValue = itemValue + 1;
        } else {
            /* v8 ignore next -- marked always sets bulletChar */
            markerPrefix = `${list.bulletChar || '*'}`;
        }

        let checkbox = '';
        if (listItem.task) {
            checkbox = listItem.checked ? '[x] ' : '[ ] ';
        }

        const inferredContinuationIndent = getContinuationIndentFromItemText(listItem.text);
        const markerSpacing = inferredContinuationIndent
            ? Math.max(1, inferredContinuationIndent - markerPrefix.length - checkbox.length)
            : 1;
        const marker = `${markerPrefix}${' '.repeat(markerSpacing)}`;

        const itemContentTokens = listItem.task && listItem.tokens[0]?.type === 'checkbox'
            ? listItem.tokens.slice(1)
            : listItem.tokens;

        const content = renderListItemContent.call(this, itemContentTokens);

        if (!content) {
            return `${marker}${checkbox}`.trimEnd();
        }

        // When the item text starts with '\n', the source had the marker on its own
        // line (e.g. `-\n  foo`).  Render all content lines indented on the next line.
        if (listItem.text.startsWith('\n')) {
            const indent = ' '.repeat(marker.length + checkbox.length);
            const allIndented = content
                .split('\n')
                .map((line) => (line.length === 0 ? line : `${indent}${line}`))
                .join('\n');
            return `${marker.trimEnd()}\n${allIndented}`;
        }

        const continuationIndent = inferredContinuationIndent ?? (marker.length + checkbox.length);
        const indentedContent = indentContinuationLines(content, continuationIndent);

        return `${marker}${checkbox}${indentedContent}`;
    });

    if (renderedItems.length <= 1) {
        return renderedItems.join('') + '\n';
    }

    let markdown = '';

    renderedItems.forEach((renderedItem, index) => {
        markdown += renderedItem;

        if (index >= renderedItems.length - 1) {
            return;
        }

        markdown += getListItemSeparator(list.items[index]);
    });

    return markdown + '\n';
}

function getListItemSeparator(previousItem: Tokens.ListItem): string {
    const trailingNewlines = previousItem.text.match(/\n+$/)?.[0].length ?? 0;

    if (trailingNewlines > 0) {
        // Each trailing '\n' in text corresponds to one blank line in the source.
        return '\n'.repeat(trailingNewlines + 1);
    }

    if (previousItem.loose && previousItem.tokens.length === 0) {
        return '\n\n';
    }

    return '\n';
}

function renderListItemContent(this: Renderer, tokens: Tokens.ListItem['tokens']): string {
    let content = '';
    let pendingLines = 0;

    tokens.forEach((token) => {
        if (token.type === 'space') {
            /* v8 ignore next -- token.lines is always set by marked on space tokens */
            pendingLines = token.lines ?? 2;
            return;
        }

        const rendered = renderListItemToken.call(this, token).replace(/\n+$/, '');

        /* v8 ignore next 3 -- defensive guard: no current token type renders empty */
        if (!rendered) {
            return;
        }

        if (content.length > 0) {
            content += '\n'.repeat(pendingLines > 0 ? pendingLines : 1);
        }

        content += rendered;
        pendingLines = 0;
    });

    return content;
}

function renderListItemToken(this: Renderer, token: Tokens.Generic): string {
    if (token.type === 'paragraph') {
        return this.parser.parseInline(token.tokens!);
    }

    if (token.type === 'text') {
        /* v8 ignore next -- marked always populates tokens for text nodes in list items */
        return this.parser.parseInline(token.tokens ?? []) || token.text;
    }

    if (token.type === 'list') {
        return renderList.call(this, token as Tokens.List);
    }

    return this.parser.parse([token]).trimEnd();
}

function indentContinuationLines(content: string, continuationIndent: number): string {
    const indent = ' '.repeat(continuationIndent);

    return content
        .split('\n')
        .map((line, index) => {
            if (index === 0 || line.length === 0) {
                return line;
            }

            return `${indent}${line}`;
        })
        .join('\n');
}

function getContinuationIndentFromItemText(listItemText: string): number | undefined {
    const continuationLineIndents = listItemText
        .split('\n')
        .slice(1)
        .filter((line) => line.length > 0)
        .map((line) => line.match(/^\s*/)![0].length)
        // Lines with >= 4 leading spaces are indented-code-block deltas (already
        // have the content-margin stripped by Marked).  Using them as a proxy for
        // the content-margin gives the wrong marker spacing, so ignore them.
        .filter((indent) => indent > 0 && indent < 4);

    if (continuationLineIndents.length === 0) {
        return undefined;
    }

    return Math.min(...continuationLineIndents);
}
