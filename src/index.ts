import marked, { MarkedExtension, RendererObject } from 'marked';
import blockquoteRenderer from './renderer/blockquote';
import codeRenderer from './renderer/code';
import emRenderer from './renderer/em';
import headingRenderer from './renderer/heading';
import imageRenderer from './renderer/image';
import linkRenderer from './renderer/link';
import paragraphRenderer from './renderer/paragraph';
import strongRenderer from './renderer/strong';
import codespanRenderer from './renderer/codespan';
import brRenderer from './renderer/br';
import checkboxRenderer from './renderer/checkbox';
import hrRenderer from './renderer/hr';
import spaceRenderer from './renderer/space';
import listRenderer from './renderer/list';
import listItemRenderer from './renderer/listItem';
import textRenderer from './renderer/text';
import delRenderer from './renderer/del';
import tableRenderer from './renderer/table';

/**
 * A extension for marked that renders the markdown back to markdown
 * @returns {MarkedExtension} The extension
 */
export default function markedMarkdownRenderer() : MarkedExtension {
    return {
        renderer: {
            blockquote: blockquoteRenderer,
            br: brRenderer,
            checkbox: checkboxRenderer,
            code: codeRenderer,
            codespan: codespanRenderer,
            del: delRenderer,
            em: emRenderer,
            heading: headingRenderer,
            hr: hrRenderer,
            image: imageRenderer,
            link: linkRenderer,
            list: listRenderer,
            listitem: listItemRenderer,
            paragraph: paragraphRenderer,
            space: spaceRenderer,
            strong: strongRenderer,
            table: tableRenderer,
            text: textRenderer,
        } as RendererObject
    }
}
