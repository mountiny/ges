export default async function createComment(req, res) {

  const {text, article_id} = JSON.parse(req.body)

  // const client = contentful.createClient({
  //   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  // })

  // // Create entry
  // client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  // .then((space) => space.getEnvironment('master'))
  // .then((environment) => environment.createEntryWithId('<content_type_id>', '<entry_id>', {
  //   fields: {
  //     title: {
  //       'en-US': 'Entry title'
  //     }
  //   }
  // }))
  // .then((entry) => console.log(entry))
  // .catch(console.error)
}