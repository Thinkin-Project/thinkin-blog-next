import type { Author } from '../types';

export const authors: Record<string, Author> = {
    admin: {
        id: 'admin',
        name: 'Thinkin Team',
        avatar: 'https://github.com/shadcn.png',
        bio: '分享科技、設計與生活思考的團隊。我們致力於提供高質量的內容，啟發讀者的思考。',
        website: 'https://thinkin.blog',
        github: 'https://github.com/thinkin-blog'
    },
    ame: {
        id: 'ame',
        name: 'Ame',
        avatar: 'https://github.com/Ame.png',
        bio: '熱愛前端開發與設計的開發者。喜歡探索新技術，並將其應用在有趣的專案中。',
        github: 'https://github.com/Ame'
    }
};
