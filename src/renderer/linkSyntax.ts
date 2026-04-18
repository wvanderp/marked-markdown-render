import { Renderer, Token } from 'marked';

function escapeBracketedDestination(href: string): string {
    return href.replace(/[\\<>]/g, '\\$&');
}

function escapePlainDestination(href: string): string {
    return href.replace(/[\\()]/g, '\\$&');
}

function escapeTitle(title: string, delimiter: '"' | '\''): string {
    const escapedBackslashes = title.replace(/\\/g, '\\\\');

    return escapedBackslashes.replace(new RegExp(`\\${delimiter}`, 'g'), `\\${delimiter}`);
}

export function renderInlineTokens(renderer: Renderer, tokens?: Token[]): string {
    if (!tokens || tokens.length === 0) {
        return '';
    }

    return renderer.parser.parseInline(tokens);
}

export function formatLinkDestination(href: string): string {
    if (href.length === 0 || /\s/.test(href)) {
        return `<${escapeBracketedDestination(href)}>`;
    }

    return escapePlainDestination(href);
}

export function formatLinkTitle(title: string | null | undefined): string {
    if (!title) {
        return '';
    }

    if (!title.includes('"')) {
        return ` "${escapeTitle(title, '"')}"`;
    }

    if (!title.includes('\'')) {
        return ` '${escapeTitle(title, '\'')}'`;
    }

    return ` "${escapeTitle(title, '"')}"`;
}