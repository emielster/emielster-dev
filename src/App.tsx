import { BrowserRouter, Routes, Route } from "react-router-dom";


import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import Now from "./pages/Now";



export default function App() {
	return (
		<BrowserRouter>
			<div className="layout">
				<Sidebar />
				<main className="content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/about" element={<About />} />
						<Route path="/now" element={<Now />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}
