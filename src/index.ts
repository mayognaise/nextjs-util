import * as fs from 'fs';
import * as matter from 'gray-matter';

export interface FilesByDirectory {
  data: {
    [key: string]: any;
  };
  content: string;
  slug: string;
}

export interface FilesByDirectoryOptions {
  extension?: string;
  sort?: string;
  sortType?: 'date' | 'number';
  order?: 'asc' | 'desc';
}

export const getFilesByDirectory = (
  directory: string,
  {
    extension = 'mdx',
    sort,
    sortType,
    order = 'asc',
  }: FilesByDirectoryOptions = {},
): FilesByDirectory[] => {
  const regex = new RegExp(`\.${extension}?$`);
  return fs
    .readdirSync(directory)
    .filter((file) => regex.test(file))
    .map((file) => {
      const slug = file.replace(regex, '');
      return {
        ...matter.read(`${directory}/${file}`),
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
};

export const getPrevFileBySlug = (
  slug: string,
  items: FilesByDirectory[],
  loop?: boolean,
): FilesByDirectory | undefined => {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1 || (index === 0 && !loop)) return undefined;
  return items[index - 1] || items[items.length - 1];
};

export const getNextFileBySlug = (
  slug: string,
  items: FilesByDirectory[],
  loop?: boolean,
): FilesByDirectory | undefined => {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1 || (index === items.length - 1 && !loop)) return undefined;
  return items[index + 1] || items[0];
};
