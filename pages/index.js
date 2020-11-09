import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPostsForHome, getAllCategoriesForHome } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'

export default function Index({ preview, allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)

  const categories = []//allCategories
  console.log('Categories: ', categories)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Glasgow European Society</title>
        </Head>
        <Container>
          <Intro />
          <div className="flex">
            <div className="flex-1 max-w-lg">
              <div className="text-xl font-bold pr-12">Categories</div>
              <ul>
                {
                  categories && categories.map(cat => (
                    <li>
                      {cat.name}
                    </li>
                  ))
                }
              </ul>
            </div>
            {heroPost && (
              <HeroPost
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
  // console.log('all posts: ', allPosts)
  // const allCategories = await getAllCategoriesForHome()
  // console.log('all posts: ', allCategories.posts)
  return {
    props: { preview, allPosts },
  }
}
