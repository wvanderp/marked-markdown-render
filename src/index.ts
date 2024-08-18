import marked, { MarkedExtension, RendererObject } from 'marked';
import blockquoteRenderer from './renderer/blockquote';
import codeRenderer from './renderer/code';
import emRenderer from './renderer/em';
import headingRenderer from './renderer/heading';
import imageRenderer from './renderer/image';
import linkRenderer from './renderer/link';
import paragraphRenderer from './renderer/paragraph';
import strongRenderer from './renderer/strong';

/**
 * A extension for marked that renders the markdown back to markdown
 * @returns {MarkedExtension} The extension
 */
export default function markedMarkdownRenderer() : MarkedExtension {
    return {
        renderer: {
            blockquote: blockquoteRenderer,
            code: codeRenderer,
            em: emRenderer,
            heading: headingRenderer,
            image: imageRenderer,
            link: linkRenderer,
            paragraph: paragraphRenderer,
            strong: strongRenderer,
        } as RendererObject
    }
}
