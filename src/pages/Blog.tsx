import { Link } from "react-router-dom";
import { parseMeta } from "../utils/parseMeta.ts";

const blogs = import.meta.glob<string>("../blogs/*.md", {
	query: "?raw",
	import: "default",
	eager: true
});

const posts = Object.entries(blogs)
	.map(([path, content]) => {
		const { data } = parseMeta(content);
		const slug = path.split("/").pop().replace(".md", "");
		return { slug, ...data };
	})
	.sort((a, b) => new Date(b.date) - new Date(a.date));

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
