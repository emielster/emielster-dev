import { Link } from "react-router-dom";
import { parseMeta } from "../utils/parseMeta.ts";

interface PostMeta {
	title: string;
	date: string;
}

interface Post extends PostMeta {
	slug: string;
}

const blogs = import.meta.glob<string>("../blogs/*.md", {
	query: "?raw",
	import: "default",
	eager: true
});

const posts: Post[] = Object.entries(blogs)
	.map(([path, content]) => {
		const { data } = parseMeta(content);
		const slug = path.split("/").pop()?.replace(".md", "") ?? path;
		return { slug, ...(data as unknown as PostMeta) };
	})
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function Blog() {
	return (
		<div>
			<h1>Blogs</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.slug}>
						<Link to={`/blog/${post.slug}`}>{post.title}</Link>
						<span> ({post.date})</span>
					</li>
				))}
			</ul>
		</div>
	);
}
