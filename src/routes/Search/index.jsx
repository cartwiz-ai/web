import styles from "./Search.module.css"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ProductItem from "../../components/ProductItem"
import SearchBar from "../Home/SearchBar"

const SEARCH_ENDPOINT =
	"https://cartwiz.hop.sh/api/product/getProduct?searchString="

export default function Search() {
	const [searchParams, _] = useSearchParams()
	let q = searchParams.get("q")

	let [ready, isReady] = useState(false)
	let [products, setProducts] = useState([])

	useEffect(() => {
		async function fetchData() {
			isReady(false)
			const response = await fetch(SEARCH_ENDPOINT + q)
			const data = await response.json()
			console.log(data)
			isReady(true)
			setProducts(data)
		}
		fetchData()
	}, [q])

	return ready ? <Stuff products={products} q={q} /> : <Loading />
}

function Stuff({ products, q }) {
	return (
		<>
		<SearchBar text={q} />
		<div className={styles.productsHolder}>
			{products.map((product) => (
				<ProductItem product={product} key={product._id} />
			))}
		</div></>
	)
}

function Loading() {
	return (
		<div className={styles.loadingWrapper}>
			<h1>Please wait while we fetch your products...</h1>
			<span>Loading Search Results Recommendation</span>
		</div>
	)
}
