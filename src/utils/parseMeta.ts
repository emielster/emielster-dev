export function parseMeta(raw: string) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { data: {} as Record<string, string>, content: raw };

	const [, frontmatter, content] = match;
	const data: Record<string, string> = {};

	frontmatter.split("\n").forEach((line) => {
		const idx = line.indexOf(":");
		if (idx === -1) return;
		const key = line.slice(0, idx).trim();
		const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
		data[key] = value;
	});

	return { data, content };
}
