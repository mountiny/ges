import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import markdownStyles from './markdown-styles.module.css'

export default function PostBody({ content }) {
  // {markdownStyles['markdown']}
  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-lg">
        {documentToReactComponents(content)}
      </div>
    </div>
  )
}
