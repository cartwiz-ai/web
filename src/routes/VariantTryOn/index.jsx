import styles from "./VariantTryOn.module.css"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductItem from "../../components/ProductItem"



export default function VariantTryOn() {

	let URL_TO_FETCH = `http://localhost:4003/api/product/id`

	let { variantId } = useParams()
	let navigate = useNavigate()
	const [inputValue, setInputValue] = useState(0)

	let [productDisplayName, setproductDisplayName] = useState("")
	let [baseColour, setbaseColour] = useState("")
	let [contentId, setcontentId] = useState("")
	let [_id, set_id] = useState("")
	let [ready, isReady] = useState(false)


	useEffect(() => {
		async function main() {

			if(!variantId) return navigate(`/`)

			let request = await fetch(`${URL_TO_FETCH}/${variantId}`)
			if (!request.ok) {
				console.log("Error fetching product details")
				return navigate(`/`)
			}

			let response = await request.json()

			setproductDisplayName(response.productDisplayName)
			setbaseColour(response.baseColour)
			setcontentId(response.contentId)
			set_id(response._id)
			
			console.log(response)

			isReady(true)

		}

		main()

	}, [])

	const handleInputChange = (event) => {
		setInputValue(event.target.value)
	}

	const handleColorChange = () => {
		const color = `hsl(${inputValue}, 100%, 50%)`
		document.getElementById("tryOnButton").style.backgroundColor = color
	}


	return (
		ready ? <div className={styles.variantTryOnWrapper}>
			<h1>Variant Try On</h1>

			<ProductItem
				product={{productDisplayName, baseColour, contentId, _id}}
			/>

			<div className={styles.sliderWrapper}>
				<label htmlFor="heightSlider">Height</label>
				<input type="range" id="heightSlider" name="heightSlider" min="0" max="100" />
				<label htmlFor="weightSlider">Weight</label>
				<input type="range" id="weightSlider" name="weightSlider" min="0" max="100" />
				<label htmlFor="favColorSlider">Favorite Color</label>
				<input type="range" id="favColorSlider" name="favColorSlider" min="0" max="360" onChange={handleInputChange} />
			</div>
			<button id="tryOnButton" className={styles.tryOnButton} onClick={handleColorChange}>
				Variant Try On
			</button>
		</div>: <></>
	)
}