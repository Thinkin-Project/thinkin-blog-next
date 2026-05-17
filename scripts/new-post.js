import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.resolve(__dirname, '../src/posts');
const METADATA_DIR = path.resolve(POSTS_DIR, '_metadata');

const METADATA_FILES = {
    authors: path.resolve(METADATA_DIR, 'authors.json'),
    topics: path.resolve(METADATA_DIR, 'topics.json'),
    tags: path.resolve(METADATA_DIR, 'tags.json')
};

/**
 * Load metadata from JSON file
 */
function loadMetadata(type) {
    if (!fs.existsSync(METADATA_FILES[type])) return type === 'authors' ? {} : [];
    return JSON.parse(fs.readFileSync(METADATA_FILES[type], 'utf-8'));
}

/**
 * Save metadata to JSON file
 */
function saveMetadata(type, data) {
    fs.writeFileSync(METADATA_FILES[type], JSON.stringify(data, null, 4), 'utf-8');
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

async function main() {
    console.log('\x1b[36m%s\x1b[0m', '🚀 開始建立新文章...\n');

    // 1. 基礎資訊
    const response = await prompts([
        {
            type: 'text',
            name: 'title',
            message: '文章標題 (Title):',
            validate: (value) => (value.length < 1 ? '標題不能為空' : true)
        },
        {
            type: 'text',
            name: 'description',
            message: '文章描述 (Description):',
            validate: (value) => (value.length < 1 ? '描述不能為空' : true)
        },
        {
            type: 'text',
            name: 'slug',
            message: '文章 Slug (Slug):',
            initial: (prev) => generateSlug(prev),
            validate: (value) => {
                if (fs.existsSync(path.join(POSTS_DIR, value))) {
                    return '該 Slug 已存在，請更換一個';
                }
                return true;
            }
        }
    ]);

    if (!response.title) return;

    // 2. 元數據選擇 (作者)
    const authorsObj = loadMetadata('authors');
    const authorsList = Object.values(authorsObj);
    const authorRes = await prompts([
        {
            type: 'multiselect',
            name: 'selectedAuthors',
            message: '選擇作者 (Authors):',
            choices: [
                ...authorsList.map((a) => ({ title: a.name, value: a.id })),
                { title: '[ 新增作者 ]', value: '__new__' }
            ],
            min: 1
        }
    ]);

    if (authorRes.selectedAuthors && authorRes.selectedAuthors.includes('__new__')) {
        const newAuthor = await prompts([
            {
                type: 'text',
                name: 'id',
                message: '新作者 ID (slug 格式):',
                validate: (v) => /^[a-z0-9-]+$/.test(v) || '僅限小寫字母、數字及連字號'
            },
            { type: 'text', name: 'name', message: '新作者名稱:', validate: (v) => v.length > 0 },
            {
                type: 'text',
                name: 'avatar',
                message: '新作者頭像路徑:',
                initial: '/assets/authors/default.jpg'
            }
        ]);
        if (newAuthor.id) {
            authorsObj[newAuthor.id] = { ...newAuthor, bio: '', links: {} };
            saveMetadata('authors', authorsObj);
            authorRes.selectedAuthors = authorRes.selectedAuthors
                .filter((v) => v !== '__new__')
                .concat(newAuthor.id);
        }
    }

    // 3. 元數據選擇 (主題)
    const topics = loadMetadata('topics');
    const topicRes = await prompts([
        {
            type: 'autocomplete',
            name: 'selectedTopic',
            message: '選擇主題 (Topic):',
            choices: [
                ...topics.map((t) => ({ title: t.name, value: t.slug })),
                { title: '[ 新增主題 ]', value: '__new__' }
            ],
            suggest: (input, choices) =>
                choices.filter((i) => i.title.toLowerCase().includes(input.toLowerCase()))
        }
    ]);

    if (topicRes.selectedTopic === '__new__') {
        const newTopic = await prompts([
            { type: 'text', name: 'name', message: '新主題名稱:', validate: (v) => v.length > 0 },
            {
                type: 'text',
                name: 'slug',
                message: '新主題 Slug:',
                initial: (prev) => generateSlug(prev),
                validate: (v) => /^[a-z0-9-]+$/.test(v)
            }
        ]);
        if (newTopic.slug) {
            topics.push({ ...newTopic, aliases: [] });
            saveMetadata('topics', topics);
            topicRes.selectedTopic = newTopic.slug;
        }
    }

    // 4. 元數據選擇 (標籤)
    const tags = loadMetadata('tags');
    const tagRes = await prompts([
        {
            type: 'multiselect',
            name: 'selectedTags',
            message: '選擇標籤 (Tags):',
            choices: [
                ...tags.map((t) => ({ title: t.name, value: t.slug })),
                { title: '[ 新增標籤 ]', value: '__new__' }
            ]
        }
    ]);

    if (tagRes.selectedTags && tagRes.selectedTags.includes('__new__')) {
        const newTag = await prompts([
            { type: 'text', name: 'name', message: '新標籤名稱:', validate: (v) => v.length > 0 },
            {
                type: 'text',
                name: 'slug',
                message: '新標籤 Slug:',
                initial: (prev) => generateSlug(prev),
                validate: (v) => /^[a-z0-9-]+$/.test(v)
            }
        ]);
        if (newTag.slug) {
            tags.push({ ...newTag, aliases: [] });
            saveMetadata('tags', tags);
            tagRes.selectedTags = tagRes.selectedTags
                .filter((v) => v !== '__new__')
                .concat(newTag.slug);
        }
    }

    // 5. 其他屬性
    const settings = await prompts([
        {
            type: 'text',
            name: 'ogImage',
            message: '封面圖片路徑 (預設: ./hero.jpeg):'
        },
        {
            type: 'toggle',
            name: 'featured',
            message: '是否為精選文章 (Featured)?',
            initial: false,
            active: 'yes',
            inactive: 'no'
        },
        {
            type: 'toggle',
            name: 'drafted',
            message: '是否為草稿 (Draft)?',
            initial: true,
            active: 'yes',
            inactive: 'no'
        }
    ]);

    // 6. 建立檔案與目錄
    const targetDir = path.join(POSTS_DIR, response.slug);
    const imagesDir = path.join(targetDir, 'images');

    // 取得本地日期 (YYYY-MM-DD)
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    const today = localDate.toISOString().split('T')[0];

    fs.mkdirSync(imagesDir, { recursive: true });

    const finalOgImage = settings.ogImage || './hero.jpeg';

    const content = `---
title: '${response.title.replace(/'/g, "''")}'
description: '${response.description.replace(/'/g, "''")}'
ogImage: '${finalOgImage}'
slug: '${response.slug}'
date: '${today}'
drafted: ${settings.drafted}
featured: ${settings.featured}
topic: '${topicRes.selectedTopic}'
tags: ${JSON.stringify(tagRes.selectedTags)}
authors: ${JSON.stringify(authorRes.selectedAuthors)}
---

## 前言

在這裡寫下你的文章前言...

## 內容

開始寫作吧！你可以使用相對路徑引用圖片，例如：
![範例圖片](./images/example.png)
`;

    fs.writeFileSync(path.join(targetDir, 'index.md'), content, 'utf-8');

    console.log('\x1b[32m%s\x1b[0m', `\n✅ 文章已建立：${targetDir}`);
    if (finalOgImage) {
        const imageName = path.basename(finalOgImage);
        console.log('\x1b[33m%s\x1b[0m', `💡 別忘了放入 ${imageName} 哦！`);
    }
}

main().catch(console.error);
