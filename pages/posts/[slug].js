import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import { CMS_NAME } from '../../lib/constants'
import { useCommentsEntries, createCommentEntry } from '../../graphql/api'
import { useForm } from "react-hook-form";

function getEntries(data, slug) {
  return data ? data.entries.data.reverse().filter(a => a.article_id === slug) : []
}

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  const { data, errorMessage } = useCommentsEntries()


  const [entries, setEntries] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, errors, reset } = useForm();


  useEffect(() => {
    if (!entries.length) {
      setEntries(getEntries(data, post.slug))
    }
  }, [data, entries.length])


  useEffect(() => {
    setEntries(getEntries(data, post.slug))
  }, [post])

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  const onSubmit = (data) => {
    let content = data.content
    if (content === "") {
      alert("You have written nothing!")
      return
    }
    if (content.length > 10000) {
      content = content.substring(0, 10000)
    }
    
    setSubmitting(true)
    createCommentEntry(post.slug, content)
      .then((data) => {
        console.log('data: ', data.data)
        entries.unshift(data.data.createComment)
        reset()
        setEntries(entries)
        setSubmitting(false)
      })
      .catch((error) => {
        console.log(`boo :( ${error}`)
        alert('🤷‍♀️')
        setSubmitting(false)
      })
  }


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
                  {post.title} | Glasgow European Society
                </title>
                <meta property="og:image" content={post.coverImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
              {
                entries.length !== 0 && (
                  <div className="flex flex-col max-w-2xl mx-auto">
                    <h3 className="font-bold text-2xl pb-4 pt-12">Comments</h3>
                    {entries.map((comment) => (
                      <div className="w-full border border-accents-5 rounded-lg mb-4 px-4 py-4" key={comment._id}>
                        {comment.content}
                      </div>
                    ))}
                  </div>
                )
              }
              <div className="flex flex-col max-w-2xl mx-auto">
                <h3 className="font-bold text-2xl pb-4 pt-12">Leave Comments</h3>
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                  <textarea className="bg-accents-8 rounded h-32 resize-none px-4 py-4" name="content" id="" cols="30" rows="10" ref={register}></textarea>
                  <div className="mt-4 flex justify-end">
                    <input className="px-4 py-2 bg-accents-1 text-secondary font-bold rounded" type="submit" value={submitting ? "Submitting" : "Add comment"}/>
                  </div>
                </form>
              </div>
            </article>
            <SectionSeparator />
            {morePosts && morePosts.length > 0 && (
              <MoreStories posts={morePosts} />
            )}
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, preview)

  return {
    props: {
      preview,
      post: data?.post ?? null,
      morePosts: data?.morePosts ?? null,
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  }
}
