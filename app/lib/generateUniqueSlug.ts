import { slugify } from './slugify';

export async function generateUniqueSlug(
  baseSlug: string,
  model: any,
  currentId?: string
): Promise<string> {
  let slug = baseSlug;
  let count = 1;
  const query: any = { slug };
  if (currentId) query._id = { $ne: currentId }; // exclude current property on update
  while (await model.findOne(query)) {
    slug = `${baseSlug}-${count}`;
    query.slug = slug;
    count++;
  }
  return slug;
}