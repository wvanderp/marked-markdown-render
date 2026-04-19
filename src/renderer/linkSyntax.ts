import { Renderer, Token } from 'marked';

function escapeBracketedDestination(href: string): string {
    return href.replace(/[\\<>]/g, '\\$&');
}

const ASCII_PUNCTUATION = /^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/;

function hasBalancedParens(s: string): boolean {
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '\\' && i + 1 < s.length && ASCII_PUNCTUATION.test(s[i + 1])) {
            i++; // skip escaped character
            continue;
        }
        if (s[i] === '(') depth++;
        if (s[i] === ')') depth--;
        if (depth < 0) return false;
    }
    return depth === 0;
}

function escapePlainDestination(href: string): string {
    // Escape backslashes only when followed by ASCII punctuation
    // (to prevent them being interpreted as escape sequences).
    // Leave other backslashes as-is since they're literal.
    let result = '';
    for (let i = 0; i < href.length; i++) {
        if (href[i] === '\\' && i + 1 < href.length && ASCII_PUNCTUATION.test(href[i + 1])) {
            result += '\\\\';
        } else {
            result += href[i];
        }
    }

    // If parentheses are balanced after backslash escaping, no need to escape them
    if (hasBalancedParens(result)) {
        return result;
    }

    // Otherwise escape unbalanced parentheses
    return result.replace(/[()]/g, '\\$&');
}

function escapeTitle(title: string, delimiter: '"' | '\''): string {
    const escapedBackslashes = title.replace(/\\/g, '\\\\');

    return escapedBackslashes.replace(new RegExp(`\\${delimiter}`, 'g'), `\\${delimiter}`);
}

function escapeTextBracketsInTokens(tokens: Token[]): Token[] {
    return tokens.map(token => {
        if (token.type === 'text') {
            return { ...token, text: (token as { text: string }).text.replace(/[\[\]]/g, '\\$&') };
        }
        if ('tokens' in token && Array.isArray((token as { tokens?: Token[] }).tokens)) {
            return { ...token, tokens: escapeTextBracketsInTokens((token as { tokens: Token[] }).tokens) };
        }
        return token;
    });
}

export function renderLinkContent(renderer: Renderer, tokens?: Token[], fallbackText?: string): string {
    if (!tokens || tokens.length === 0) {
        return fallbackText ? fallbackText.replace(/[\[\]]/g, '\\$&') : '';
    }

    const escaped = escapeTextBracketsInTokens(tokens);
    return renderer.parser.parseInline(escaped);
}

export function formatLinkDestination(href: string): string {
    if (href.length === 0) {
        return '';
    }

    if (/[\x00-\x20]/.test(href)) {
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
