import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
    const { rest } = params;

    // 從路徑中擷取最後一段作為 slug
    // 例如 /post/2020/12/14/design-pattern-builder
    // rest 會是 "2020/12/14/design-pattern-builder"
    const segments = rest.split('/');
    const slug = segments[segments.length - 1];

    // 執行 301 永久重新導向
    throw redirect(301, `/posts/${slug}`);
};
