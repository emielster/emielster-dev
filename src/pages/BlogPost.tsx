import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { parseMeta } from "../utils/parseMeta.ts";

const blogs = import.meta.glob<string>("../blogs/*.md", {
	query: "?raw",
	import: "default",
	eager: true
});

export default function BlogPost() {
	const { slug } = useParams();
	const path = Object.keys(blogs).find((p) => p.endsWith(`${slug}.md`));

	if (!path) return <p>Uh-oh! I didn't write that.</p>;

	const { data, content } = parseMeta(blogs[path]);

	return (
		<article>
			<h1>{data.title}</h1>
			<p>{data.date}</p>
			<ReactMarkdown>{content}</ReactMarkdown>
		</article>
	);
}
