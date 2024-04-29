import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

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
    const posts = await Promise.all(fileNames.map(async fileName => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const processedContent = await remark().use(html).process(fileContents);
        const contentHtml = processedContent.toString();

        return {
            id,
            contentHtml,
        };
    }));

    return posts.sort((a, b) => b.id.localeCompare(a.id)); // Assuming you might sort by ID or another attribute
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const processedContent = await remark().use(html).process(fileContents);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
    };
}
