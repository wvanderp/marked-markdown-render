import { describe, it, expect } from 'vitest';

import { formatLinkDestination, formatLinkTitle } from '../../src/renderer/linkSyntax';

describe('linkSyntax', () => {
    describe('formatLinkDestination', () => {
        it('escapes backslashes before ASCII punctuation in plain destinations', () => {
            // Input has literal \! which should be doubled to \\!
            expect(formatLinkDestination('test\\!url')).toBe('test\\\\!url');
        });

        it('returns empty string for empty href', () => {
            expect(formatLinkDestination('')).toBe('');
        });

        it('wraps destinations with control characters in angle brackets', () => {
            expect(formatLinkDestination('foo bar')).toBe('<foo bar>');
        });
    });

    describe('formatLinkTitle', () => {
        it('returns empty string for null title', () => {
            expect(formatLinkTitle(null)).toBe('');
        });

        it('returns empty string for undefined title', () => {
            expect(formatLinkTitle(undefined)).toBe('');
        });

        it('uses double quotes for simple title', () => {
            expect(formatLinkTitle('hello')).toBe(' "hello"');
        });

        it('uses single quotes when title contains double quotes', () => {
            expect(formatLinkTitle('has "quotes"')).toBe(` 'has "quotes"'`);
        });

        it('uses double quotes with escaping when title contains both quote types', () => {
            expect(formatLinkTitle(`it's "cool"`)).toBe(` "it's \\"cool\\""`);
        });
    });
});
