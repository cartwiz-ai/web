import { useState, useEffect } from "react"
import SearchBar from "./SearchBar"
import styles from "./Home.module.css"
import ProductItem from "../../components/ProductItem"

export default function Home() {
	return (
		<>
			<SearchBar />
			<Recommendations />
		</>
	)
}

function Category({ categoryName, items }) {
	return (
		<div className={styles.categoryWrapper}>
			<h2 className={styles.categoryName}>{categoryName}</h2>
			<div className={styles.productsHolder}>
				{items.map((item, index) => (
					<ProductItem product={{ ...item }} key={index} />
				))}
			</div>
		</div>
	)
}

function Recommendations() {
	const URL_TO_FETCH = `https://cartwiz.hop.sh/api/product/home`

	const [categories, setCategories] = useState([])
	let [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function main() {
			const request = await fetch(URL_TO_FETCH)
			const response = await request.json()

			console.log(response)

			setCategories(response)
			setIsLoading(false)
		}
		main()
	}, [])

	return isLoading ? (
		<div>Loading...</div>
	) : (
		<>
			{categories.map((category, index) => (
				<Category
					categoryName={category.categoryName}
					items={category.products}
					key={index}
				/>
			))}
		</>
	)
}
