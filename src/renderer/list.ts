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

            markerPrefix = `${itemValue}${list.orderChar || '.'}`;
            nextOrderedValue = itemValue + 1;
        } else {
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

        const continuationIndent = inferredContinuationIndent ?? (marker.length + checkbox.length);
        const indentedContent = indentContinuationLines(content, continuationIndent);

        return `${marker}${checkbox}${indentedContent}`;
    });

    if (renderedItems.length <= 1) {
        return renderedItems.join('');
    }

    let markdown = '';

    renderedItems.forEach((renderedItem, index) => {
        markdown += renderedItem;

        if (index >= renderedItems.length - 1) {
            return;
        }

        markdown += getListItemSeparator(list.items[index]);
    });

    return markdown;
}

function getListItemSeparator(previousItem: Tokens.ListItem): string {
    if (previousItem.text.endsWith('\n')) {
        return '\n\n';
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
            pendingLines = token.lines ?? 2;
            return;
        }

        const rendered = renderListItemToken.call(this, token).trimEnd();

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
        return this.parser.parseInline(token.tokens ?? []);
    }

    if (token.type === 'text') {
        if (token.tokens) {
            return this.parser.parseInline(token.tokens);
        }

        return token.text;
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
        .map((line) => line.match(/^\s*/)?.[0].length ?? 0)
        .filter((indent) => indent > 0);

    if (continuationLineIndents.length === 0) {
        return undefined;
    }

    return Math.min(...continuationLineIndents);
}
