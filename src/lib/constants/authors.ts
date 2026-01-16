import authorsJson from '$lib/data/authors.json';

import type { Author } from '../types';

export const AUTHORS: Record<string, Author> = authorsJson;
