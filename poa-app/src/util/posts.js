import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import 'katex/dist/katex.min.css'; // Make sure to import this in your component or global CSS
import remarkGfm from 'remark-gfm';
import remarkPrism from 'remark-prism';
import html from 'remark-html';

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

// Create a function to clean heading text for slug creation
const cleanHeadingText = (text) => {
  return text
    .replace(/\*\*/g, '') // Bold
    .replace(/\*/g, '')   // Italic
    .replace(/`/g, '')    // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .trim();
};

// Create slug from text
const createSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => ({
        params: {
            id: fileName.replace(/\.md$/, '')
        }
    }));
}

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Extract the first paragraph as description if no description in frontmatter
        let description = matterResult.data.description;
        if (!description) {
            const contentLines = matterResult.content.split('\n');
            // Find the first non-empty paragraph that's not a heading
            const firstParagraph = contentLines.find(line => 
                line.trim().length > 0 && !line.startsWith('#')
            );
            
            if (firstParagraph) {
                // Limit to a reasonable length for a description
                description = firstParagraph.length > 160 
                    ? `${firstParagraph.substring(0, 160)}...` 
                    : firstParagraph;
            } else {
                // Default description if nothing suitable was found
                description = `Documentation for ${formatIdToTitle(id)}`;
            }
        }

        // Ensure date is properly formatted or use file creation time as fallback
        let date = matterResult.data.date;
        if (!date) {
            const stats = fs.statSync(fullPath);
            date = stats.mtime.toISOString();
        }

        // Use the file name as title if no title in frontmatter
        const title = matterResult.data.title || formatIdToTitle(id);

        // Add category if present or determine from filename
        const category = matterResult.data.category || determineCategory(id);

        return {
            id,
            date,
            title,
            description,
            category,
            ...matterResult.data,
        };
    });

    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}

// Helper to format ID into a readable title
function formatIdToTitle(id) {
    return id
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/([A-Z])([A-Z])([a-z])/g, '$1 $2$3'); // Handle consecutive capitals
}

// Helper to determine category based on file name
function determineCategory(id) {
    const categories = {
        'create': 'Get Started',
        'join': 'Get Started',
        'perpetualOrganization': 'Get Started',
        'hybridVoting': 'Voting',
        'contributionVoting': 'Voting',
        'directDemocracy': 'Voting',
        'AlphaV1': 'Features',
        'TheGraph': 'Features'
    };

    return categories[id] || 'Other';
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Extract headings for table of contents
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(matterResult.content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        
        // Create clean version of the heading text
        const plainText = cleanHeadingText(text);
        const slug = createSlug(plainText);
            
        headings.push({ level, text, plainText, slug });
    }

    // Process markdown content to HTML
    const processedContent = await processMarkdown(matterResult.content);

    // We'll add IDs to headings using a safer approach
    // Create a simple HTML parser
    let contentHtml = processedContent;
    
    // Add IDs to each heading using a safer string manipulation
    for (const heading of headings) {
        // Generate all the heading opening formats we might encounter
        const possibleOpenings = [
            `<h${heading.level}>`,
            `<h${heading.level} >`,
            `<h${heading.level} class="`,
        ];
        
        // Try each possible opening format
        for (const opening of possibleOpenings) {
            const htmlParts = contentHtml.split(opening);
            
            if (htmlParts.length > 1) {
                // Check each part to find the one containing our heading text
                for (let i = 1; i < htmlParts.length; i++) {
                    // Get the content up to the closing tag
                    const closingTagIndex = htmlParts[i].indexOf(`</h${heading.level}>`);
                    if (closingTagIndex !== -1) {
                        const headingContent = htmlParts[i].substring(0, closingTagIndex);
                        // Check if this section contains our plain heading text
                        if (headingContent.includes(heading.plainText)) {
                            // Replace with the ID version
                            htmlParts[i-1] = htmlParts[i-1] + `<h${heading.level} id="${heading.slug}">`;
                            // Skip the opening tag we just handled
                            htmlParts[i] = htmlParts[i].substring(opening.length - 1);
                            // Join it back together
                            contentHtml = htmlParts.join('');
                            // Break out of the inner loop - we've found and replaced this heading
                            break;
                        }
                    }
                }
                // Break out of the outer loop - we've found and replaced this heading
                break;
            }
        }
    }
    
    // Ensure date is properly formatted or use file creation time as fallback
    let date = matterResult.data.date;
    if (!date) {
        const stats = fs.statSync(fullPath);
        date = stats.mtime.toISOString();
    }

    // Use the file name as title if no title in frontmatter
    const title = matterResult.data.title || formatIdToTitle(id);

    // Add category if present or determine from filename
    const category = matterResult.data.category || determineCategory(id);

    // Extract the first paragraph as description if no description in frontmatter
    let description = matterResult.data.description;
    if (!description) {
        const contentLines = matterResult.content.split('\n');
        // Find the first non-empty paragraph that's not a heading
        const firstParagraph = contentLines.find(line => 
            line.trim().length > 0 && !line.startsWith('#')
        );
        
        if (firstParagraph) {
            // Limit to a reasonable length for a description
            description = firstParagraph.length > 160 
                ? `${firstParagraph.substring(0, 160)}...` 
                : firstParagraph;
        } else {
            // Default description if nothing suitable was found
            description = `Documentation for ${formatIdToTitle(id)}`;
        }
    }

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        headings,
        date,
        title,
        description,
        category,
        ...matterResult.data,
    };
}

// Get posts by category
export function getPostsByCategory(category) {
    const allPosts = getSortedPostsData();
    return allPosts.filter(post => post.category === category);
}

// Get related posts
export function getRelatedPosts(currentPostId, maxCount = 3) {
    const allPosts = getSortedPostsData();
    const currentPost = allPosts.find(post => post.id === currentPostId);
    
    if (!currentPost) return [];
    
    // First get posts in the same category
    const sameCategoryPosts = allPosts.filter(post => 
        post.id !== currentPostId && post.category === currentPost.category
    );
    
    // If we have enough, return those
    if (sameCategoryPosts.length >= maxCount) {
        return sameCategoryPosts.slice(0, maxCount);
    }
    
    // Otherwise, add posts from other categories to reach the max count
    const otherPosts = allPosts.filter(post => 
        post.id !== currentPostId && post.category !== currentPost.category
    );
    
    return [...sameCategoryPosts, ...otherPosts].slice(0, maxCount);
}
