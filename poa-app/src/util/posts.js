import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import 'katex/dist/katex.min.css'; // Make sure to import this in your component or global CSS
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'posts');

const processMarkdown = async (markdown) => {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
};

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => ({
        params: {
            id: fileName.replace(/\.md$/, '')
        }
    }));
}

export async function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostDataPromises = fileNames.map(async fileName => {
        const id = fileName.replace(/\.md$/, '');
        return await getPostData(id); // Reuse the getPostData function to avoid duplicating logic
    });

    const posts = await Promise.all(allPostDataPromises);
    return posts.sort((a, b) => b.id.localeCompare(a.id));
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const markdown = fs.readFileSync(fullPath, 'utf8');
    const contentHtml = await processMarkdown(markdown);
    return {
        id,
        contentHtml,
    };
}
