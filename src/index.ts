import * as fs from 'fs';
import * as matter from 'gray-matter';

// Default extension
const defaultExtension = 'mdx';

export interface FilesByDirectory<T> {
  data: T;
  content: string;
  slug: string;
}

interface FilesByDirectoryOptions {
  extension?: string;
  sort?: string;
  sortType?: 'date' | 'number';
  order?: 'asc' | 'desc';
}

export interface StaticPathsByDirectory {
  params: {
    slug: string;
  };
}

interface StaticPathsByDirectoryOptions {
  extension?: string;
}

export function getStaticPathsByDirectory(
  directory: string,
  { extension = defaultExtension }: StaticPathsByDirectoryOptions = {},
): StaticPathsByDirectory[] {
  const regex = new RegExp(`\.${extension}?$`);
  return fs
    .readdirSync(directory)
    .filter((file) => regex.test(file))
    .map((file) => {
      const slug = file.replace(regex, '');
      return { params: { slug } };
    });
}

export function getFilesByDirectory<T extends Record<string, any>>(
  directory: string,
  {
    extension = defaultExtension,
    sort,
    sortType,
    order = 'asc',
  }: FilesByDirectoryOptions = {},
): FilesByDirectory<T>[] {
  const regex = new RegExp(`\.${extension}?$`);
  return fs
    .readdirSync(directory)
    .filter((file) => regex.test(file))
    .map((file) => {
      const slug = file.replace(regex, '');
      const { data, content } = matter.read(`${directory}/${file}`);
      return {
        data: data as T,
        content,
        slug,
      };
    })
    .sort((a, b) => {
      let sortA = (sort && a.data[sort]) || a.slug;
      let sortB = (sort && b.data[sort]) || b.slug;

      if (sortType) {
        if (sortType === 'date') {
          sortA = new Date(sortA);
          sortB = new Date(sortB);
        } else if (sortType === 'number') {
          sortA = Number(sortA);
          sortB = Number(sortB);
        }
        return order === 'asc' ? sortA - sortB : sortB - sortA;
      }

      sortA = sortA.toUpperCase();
      sortB = sortB.toUpperCase();

      if (order === 'asc') {
        if (sortA < sortB) {
          return -1;
        }
        if (sortA > sortB) {
          return 1;
        }
      } else {
        if (sortA > sortB) {
          return -1;
        }
        if (sortA < sortB) {
          return 1;
        }
      }

      return 0;
    });
}

export function getFileBySlug<T extends Record<string, any>>(
  slug: string,
  items: FilesByDirectory<T>[],
): FilesByDirectory<T> | undefined {
  return items.find((item) => item.slug === slug);
}

export function getPrevFileBySlug<T extends Record<string, any>>(
  slug: string,
  items: FilesByDirectory<T>[],
  loop?: boolean,
): FilesByDirectory<T> | undefined {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1 || (index === 0 && !loop)) return undefined;
  return items[index - 1] || items[items.length - 1];
}

export function getNextFileBySlug<T extends Record<string, any>>(
  slug: string,
  items: FilesByDirectory<T>[],
  loop?: boolean,
): FilesByDirectory<T> | undefined {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1 || (index === items.length - 1 && !loop)) return undefined;
  return items[index + 1] || items[0];
}
