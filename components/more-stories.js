import PostPreview from '../components/post-preview'

export default function MoreStories({ posts, headline = "More Stories" }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        {headline}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-gap-16 lg:col-gap-16 row-gap-20 md:row-gap-32 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage && post.coverImage.url ? post.coverImage : post.coverImage.fields.file}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}
