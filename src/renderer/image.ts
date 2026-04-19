import { Renderer, Tokens } from 'marked';
import { formatLinkDestination, formatLinkTitle, renderInlineTokens, renderLinkContent } from './linkSyntax';

type LinkDefinition = {
    href: string;
    title?: string | null;
};

function getReferenceTag(renderer: Renderer, image: Tokens.Image): string | undefined {
    const links = (renderer.parser.options.tokenizer as { lexer?: { tokens?: { links?: Record<string, LinkDefinition> } } })
        ?.lexer?.tokens?.links;

    if (!links) {
        return undefined;
    }

    const imageTitle = image.title ?? null;

    for (const [tag, definition] of Object.entries(links)) {
        const definitionTitle = definition.title ?? null;

        if (definition.href === image.href && definitionTitle === imageTitle) {
            return tag;
        }
    }

    return undefined;
}

function normalizeReferenceLabel(label: string): string {
    return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * renders a image token to markdown
 * @returns the renderer
 */
export default function imageRenderer(this: Renderer, image : Tokens.Image) : string {
    const alt = renderLinkContent(this, image.tokens, image.text);

    if (image.linkStyle === 'reflink') {
        const referenceTag = getReferenceTag(this, image);

        if (referenceTag) {
            if (normalizeReferenceLabel(alt) === referenceTag) {
                return `![${alt}]`;
            }

            return `![${alt}][${referenceTag}]`;
        }

        // Fallback to inline syntax when no matching definition is available.
        return `![${alt}](${formatLinkDestination(image.href)}${formatLinkTitle(image.title)})`;
    }

    return `![${alt}](${formatLinkDestination(image.href)}${formatLinkTitle(image.title)})`;
}
