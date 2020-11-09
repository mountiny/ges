import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPostsForHome, getAllCategoriesForHome } from '../lib/api'
import Head from 'next/head'
import Link from 'next/link'
import { CMS_NAME } from '../lib/constants'

export default function Index({ preview, allPosts, allCategories }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)

  const categories = allCategories.filter(cat => cat.posts && cat.posts.length > 0)

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Glasgow European Society</title>
        </Head>
        <Container>
          <Intro />
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <div className="text-xl font-bold pr-12 pb-4">Topics</div>
              <ul>
                {
                  categories && categories.map((cat, key) => (
                    <li key={key}>
                      <Link as={`/topics/${cat.slug}`} href="/topics/[slug]">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
            {heroPost && (
              <HeroPost
                className='col-span-3'
                title={heroPost.title}
                coverImage={heroPost.coverImage}
                date={heroPost.date}
                author={heroPost.author}
                slug={heroPost.slug}
                excerpt={heroPost.excerpt}
              />
            )}
          </div>
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = await getAllPostsForHome(preview)
  const allCategories = await getAllCategoriesForHome()
  return {
    props: { preview, allPosts, allCategories },
  }
}
