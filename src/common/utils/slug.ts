import slugify from 'slugify';

const options = {
  replacement: '-',
  remove: undefined,
  lower: true,
  strict: true,
  locale: 'vi',
  trim: true,
};

export function convertToSlug(text: string): string {
  return slugify(text, options);
}
