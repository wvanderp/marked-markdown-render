import marked, { MarkedExtension, RendererObject } from 'marked';
import codeRenderer from './renderer/code';
import linkRenderer from './renderer/Link';
import paragraphRenderer from './renderer/paragraph';
import headingRenderer from './renderer/heading';
import strongRenderer from './renderer/strong';
import emRenderer from './renderer/em';

/**
 * A extension for marked that renders the markdown back to markdown
 * @returns {MarkedExtension} The extension
 */
export default function markedMarkdownRenderer() : MarkedExtension {
    return {
        renderer: {
            code: codeRenderer,
            link: linkRenderer,
            paragraph: paragraphRenderer,
            heading: headingRenderer,
            strong: strongRenderer,
            em: emRenderer
        } as RendererObject
    }
}
