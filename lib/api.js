import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
})

const getClient = (preview) => (preview ? previewClient : client)

function parseAuthor({ fields }) {
  return {
    name: fields.name,
    picture: fields.picture.fields.file,
  }
}

function parseCategory({ fields }) {
  return {
    name: fields.name,
    posts: fields.posts ? fields.posts.map(post => parsePost(post)) : null,
  }
}

function parsePost({ fields }) {
  return {
    title: fields.title,
    slug: fields.slug,
    date: fields.date,
    content: fields.content,
    excerpt: fields.excerpt,
    hero: fields.hero || false,
    coverImage: fields.coverImage.fields.file,
    author: parseAuthor(fields.author)
  }
}

function parsePostEntries(entries, cb = parsePost) {
  return entries?.items?.map(cb)
}

function parseCategoryEntries(entries, cb = parseCategory) {
  return entries?.items?.map(cb)
}

export async function getPreviewPostBySlug(slug) {
  const entries = await getClient(true).getEntries({
    content_type: 'post',
    limit: 1,
    'fields.slug[in]': slug,
  })
  return parsePostEntries(entries)[0]
}

export async function getAllPostsWithSlug() {
  const entries = await client.getEntries({
    content_type: 'post',
    select: 'fields.slug',
  })
  return parsePostEntries(entries, (post) => post.fields)
}

export async function getAllCategoriesWithSlug() {
  const entries = await client.getEntries({
    content_type: 'category',
    select: 'fields.slug',
  })
  return parseCategoryEntries(entries, (category) => category.fields)
}

export async function getAllCategoriesForHome() {
  const entries = await getClient(false).getEntries({
    content_type: 'category',
    // select: 'fields.slug',
  })
  return parseCategoryEntries(entries, (category) => category.fields)
}

export async function getAllPostsForHome(preview) {
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    order: '-fields.date',
  })
  return parsePostEntries(entries)
}

export async function getCategoryPosts(slug, preview) {
  const entry = await getClient(preview).getEntries({
    content_type: 'category',
    'fields.slug[in]': slug,
  })

  return parseCategoryEntries(entry, (category) => category.fields)
}

export async function getPostAndMorePosts(slug, preview) {
  const entry = await getClient(preview).getEntries({
    content_type: 'post',
    limit: 1,
    'fields.slug[in]': slug,
  })
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    limit: 2,
    order: '-fields.date',
    'fields.slug[nin]': slug,
  })

  return {
    post: parsePostEntries(entry)[0],
    morePosts: parsePostEntries(entries),
  }
}
