import type { Category, Post } from "@prisma/client";
import { PostContentEditor } from "@/components/post-content-editor";
import { savePostAction } from "@/lib/actions/post";

type PostEditorFormProps = {
  categories: Category[];
  post?: Post | null;
};

export function PostEditorForm({ categories, post }: PostEditorFormProps) {
  return (
    <form action={savePostAction} className="editor-form panel">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="input-row">
        <label>
          Title
          <input name="title" defaultValue={post?.title} required />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={post?.slug} placeholder="auto-generated-from-title" />
        </label>
      </div>

      <div className="input-row">
        <label>
          Author
          <input name="authorName" defaultValue={post?.authorName ?? "Zenmora Co."} />
        </label>
        <label>
          Tags
          <input name="tags" defaultValue={post?.tags ?? ""} placeholder="living room, cozy, neutral" />
        </label>
      </div>

      <label>
        Excerpt
        <textarea name="excerpt" defaultValue={post?.excerpt} required />
      </label>

      <label>
        Content
        <PostContentEditor name="content" defaultValue={post?.content} />
      </label>

      <div className="input-row">
        <label>
          Meta title
          <input name="metaTitle" defaultValue={post?.metaTitle ?? ""} placeholder="Optional SEO title" />
        </label>
        <label>
          Meta description
          <input name="metaDescription" defaultValue={post?.metaDescription ?? ""} placeholder="Optional SEO description" />
        </label>
      </div>

      <div className="input-row">
        <label>
          Category
          <select name="categoryId" defaultValue={post?.categoryId ?? ""} required>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={post?.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      <div className="input-row">
        <label>
          Hero image path
          <input name="heroImage" defaultValue={post?.heroImage ?? "/images/hero-room.svg"} required />
        </label>
        <label>
          Hero image upload
          <input type="file" name="heroImageFile" accept="image/*" />
        </label>
      </div>

      <div className="input-row">
        <label>
          Hero image alt
          <input name="heroAlt" defaultValue={post?.heroAlt ?? "Neutral interior scene"} required />
        </label>
        <label>
          Attachment label
          <input name="attachmentName" defaultValue={post?.attachmentName ?? ""} placeholder="Moodboard PDF" />
        </label>
      </div>

      <div className="input-row">
        <label>
          Attachment path
          <input name="attachmentUrl" defaultValue={post?.attachmentUrl ?? ""} placeholder="/uploads/attachments/resource.pdf" />
        </label>
        <label>
          Attachment upload
          <input type="file" name="attachmentFile" />
        </label>
      </div>

      <div className="checkbox-row">
        <label>
          <input type="checkbox" name="featured" defaultChecked={post?.featured} />
          Use as trending feature
        </label>
        <label>
          <input type="checkbox" name="latest" defaultChecked={post ? post.latest : true} />
          Show in latest inspiration
        </label>
        <label>
          <input type="checkbox" name="notifySubscribers" defaultChecked={!post?.notifiedAt} />
          Email active subscribers on publish
        </label>
      </div>

      <button type="submit" className="primary-button">
        {post ? "Update post" : "Save post"}
      </button>
    </form>
  );
}
