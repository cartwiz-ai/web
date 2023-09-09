import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./routes/Home"
import ImageSearch from "./routes/ImageSearch"
import Search from "./routes/Search"
import Product from "./routes/Product"
import TryOn from "./routes/TryOn"
import Chat from "./routes/Chat"


import NotFoundError from "./routes/NothingHere"

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="search" element={<Search />} />
      <Route path="imageSearch" element={<ImageSearch />} />
	  		<Route path="product/:productId" element={<Product />} />
			<Route path="tryOn/:productId" element={<TryOn />} />
			<Route path="chat/:productId" element={<Chat />} />
			
			<Route path="*" element={<NotFoundError />} />
		</Routes>
	</BrowserRouter>
)
