import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllCategoriesWithSlug, getCategoryPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import { CMS_NAME } from '../../lib/constants'

export default function Topic({ category, preview }) {
  const router = useRouter()


  if (!router.isFallback && !category) {
    return <ErrorPage statusCode={404} />
  }

  if (!category) return <ErrorPage statusCode={404} />

  const posts = category.posts.map(post => post.fields)

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {category.name} | Glasgow European Society
                </title>
                <meta property="og:image" content={posts[0].coverImage.fields.file.url} />
              </Head>
              <section>
                <MoreStories 
                  posts={posts}
                  headline={category.name}
                />
              </section>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getCategoryPosts(params.slug, preview)
  return {
    props: {
      preview,
      category: data && data[0]
    },
  }
}

export async function getStaticPaths() {
  const allCategories = await getAllCategoriesWithSlug()
  console.log('All categories_ ', allCategories)
  return {
    paths: allCategories?.map(({ slug }) => `/topics/${slug}`) ?? [],
    fallback: true,
  }
}
