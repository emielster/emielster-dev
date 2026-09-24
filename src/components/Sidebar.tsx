import { NavLink } from "react-router-dom";

export default function Sidebar() {
	return (
		<nav className="sidebar">
			<h2>emielster.dev</h2>
			<NavLink to="/" end>Home</NavLink>
			<NavLink to="/about">About</NavLink>
			<NavLink to="/now">Now</NavLink>
			<NavLink to="/projects">Projects</NavLink>
			<NavLink to="/blog">Blog</NavLink>
		</nav>
	);
}
