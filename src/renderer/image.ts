import { Renderer, Tokens } from 'marked';

/**
 * renders a image token to markdown
 * @returns the renderer
 */
export default function imageRenderer(this: Renderer, image : Tokens.Image) : string {
    console.log(image);
    return `![${image.text}](${image.href}${image.title ? ` "${image.title}"` : ''})`;
}
