import { Renderer, Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle, renderLinkContent } from './linkSyntax';

type LinkDefinition = {
    href: string;
    title?: string | null;
};

function getReferenceTag(renderer: Renderer, link: Tokens.Link): string | undefined {
    const links = (renderer.parser.options.tokenizer as { lexer?: { tokens?: { links?: Record<string, LinkDefinition> } } })
        ?.lexer?.tokens?.links;

    if (!links) {
        return undefined;
    }

    const linkTitle = link.title ?? null;

    for (const [tag, definition] of Object.entries(links)) {
        const definitionTitle = definition.title ?? null;

        if (definition.href === link.href && definitionTitle === linkTitle) {
            return tag;
        }
    }

    return undefined;
}

function normalizeReferenceLabel(label: string): string {
    return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * renders the link to markdown
 * @returns the renderer
 */
export default function linkRenderer(this: Renderer, link : Tokens.Link) : string {
    const text = renderLinkContent(this, link.tokens, link.text);

    if (link.linkStyle === 'barelink') {
        if (link.href === 'mailto:' + text) {
            return text;
        }

        return link.href;
    }

    if (link.linkStyle === 'autolink') {
        if (link.href === 'mailto:' + text) {
            return `<${text}>`;
        }

        return `<${link.href}>`;
    }

    if (link.linkStyle === 'reflink') {
        const referenceTag = getReferenceTag(this, link);

        if (referenceTag) {
            if (normalizeReferenceLabel(text) === referenceTag) {
                return `[${text}]`;
            }

            return `[${text}][${referenceTag}]`;
        }

        // Fallback to inline syntax when no matching definition is available.
        return `[${text}](${formatLinkDestination(link.href)}${formatLinkTitle(link.title)})`;
    }

    if (link.linkStyle === 'inline') {
        return `[${text}](${formatLinkDestination(link.href)}${formatLinkTitle(link.title)})`;
    }

    if (link.href === 'mailto:' + text) {
        return `<${text}>`;
    }

    if (link.href === text) {
        return link.href;
    }

    return `[${text}](${formatLinkDestination(link.href)}${formatLinkTitle(link.title)})`;
}
