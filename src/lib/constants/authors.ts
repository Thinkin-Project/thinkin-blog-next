import authorsJson from '$posts/_metadata/authors.json';

import type { Author } from '../types';

export const AUTHORS: Record<string, Author> = authorsJson;
