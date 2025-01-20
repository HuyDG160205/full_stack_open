const CreateNew = ({
  addBlog,
  title,
  handleTitle,
  author,
  handleAuthor,
  url,
  handleUrl,
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input id="title" type="text" value={title} onChange={handleTitle} />
        </div>
        <div>
          author
          <input
            id="author"
            type="text"
            value={author}
            onChange={handleAuthor}
          />
        </div>
        <div>
          url
          <input id="url" type="text" value={url} onChange={handleUrl} />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default CreateNew
