import * as path from 'path';
import {
  getStaticPathsByDirectory,
  getFilesByDirectory,
  getFileBySlug,
  getPrevFileBySlug,
  getNextFileBySlug,
} from '../index';

export const POSTS_PATH = path.join(process.cwd(), 'src/__mocks__/posts');

describe('getStaticPathsByDirectory', () => {
  const items = getStaticPathsByDirectory(POSTS_PATH);

  it('has proper data', () => {
    expect(items).toEqual([
      { params: { slug: 'bye' } },
      { params: { slug: 'hello' } },
      { params: { slug: 'night' } },
    ]);
  });
});

describe('getFilesByDirectory', () => {
  it('has slug from file name', () => {
    const items = getFilesByDirectory(POSTS_PATH);

    expect(items[0].slug).toBe('bye');
    expect(items[1].slug).toBe('hello');
    expect(items[2].slug).toBe('night');
  });

  it('has dec order', () => {
    const items = getFilesByDirectory(POSTS_PATH, { order: 'desc' });

    expect(items[0].slug).toBe('night');
    expect(items[1].slug).toBe('hello');
    expect(items[2].slug).toBe('bye');
  });

  it('does not have file with invalid extension', () => {
    const items = getFilesByDirectory(POSTS_PATH, { extension: 'greet' });

    expect(items.length).toBe(0);
  });

  it('has sort order by number', () => {
    const items = getFilesByDirectory(POSTS_PATH, {
      sort: 'no',
      sortType: 'number',
    });

    expect(items[0].slug).toBe('hello');
    expect(items[1].slug).toBe('bye');
    expect(items[2].slug).toBe('night');
  });

  it('has sort order by date', () => {
    const items = getFilesByDirectory(POSTS_PATH, {
      sort: 'date',
      sortType: 'date',
      order: 'desc',
    });

    expect(items[0].slug).toBe('night');
    expect(items[1].slug).toBe('bye');
    expect(items[2].slug).toBe('hello');
  });
});

describe('getFileBySlug', () => {
  const items = getFilesByDirectory(POSTS_PATH);

  it('returns undefined if passing invalid slug', () => {
    const prev = getFileBySlug('hola', items);

    expect(prev).toBe(undefined);
  });

  it('returns hello as default if passing hello as slug', () => {
    const prev = getFileBySlug('hello', items);

    expect(prev?.slug).toBe('hello');
  });
});

describe('getPrevFileBySlug', () => {
  const items = getFilesByDirectory(POSTS_PATH);

  it('returns undefined as default if passing bye as slug', () => {
    const prev = getPrevFileBySlug('bye', items);

    expect(prev).toBe(undefined);
  });

  it('returns bye as default if passing hello as slug', () => {
    const prev = getPrevFileBySlug('hello', items);

    expect(prev?.slug).toBe('bye');
  });

  it('returns night with loop if passing bye as slug', () => {
    const prev = getPrevFileBySlug('bye', items, true);

    expect(prev?.slug).toBe('night');
  });
});

describe('getNextFileBySlug', () => {
  const items = getFilesByDirectory(POSTS_PATH);

  it('returns undefined as default if passing night as slug', () => {
    const next = getNextFileBySlug('night', items);

    expect(next).toBe(undefined);
  });

  it('returns hello as default if passing bye as slug', () => {
    const next = getNextFileBySlug('bye', items);

    expect(next?.slug).toBe('hello');
  });

  it('returns bye with loop if passing night as slug', () => {
    const next = getNextFileBySlug('night', items, true);

    expect(next?.slug).toBe('bye');
  });
});
