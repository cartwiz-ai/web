import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import ProductItem from "../../components/ProductItem"
import PageTitle from "../../components/PageTitle"
import styles from "./TryOn.module.css"
import man from "/man.jpg"


function TryOn() {

	let URL_TO_FETCH = `https://cartwiz.hop.sh/api/product/id`
	
	let { productId } = useParams()
	let navigate = useNavigate()

	let [productDisplayName, setproductDisplayName] = useState("")
	let [baseColour, setbaseColour] = useState("")
	let [contentId, setcontentId] = useState("")
	let [_id, set_id] = useState("")

	let [ready, isReady] = useState(false)
	let [image, setImage] = useState(null)
	let [showImageUpload, setShowImageUpload] = useState(true)
	let [showTryOnButton, setShowTryOnButton] = useState(false)
	let [showGenerating, setShowGenerating] = useState(false)
	let [showProduct, setShowProduct] = useState(true)

	useEffect(()=> {
		
		async function main() {
			if(!productId) return navigate(`/`)
			let request = await fetch(`${URL_TO_FETCH}/${productId}`)

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

	const handleImageUpload = (event) => {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onloadend = () => {
				setImage(reader.result)
				setShowImageUpload(false)
				setShowTryOnButton(true)
			}
		}
	}

	const handleDrop = (event) => {
		event.preventDefault()
		const file = event.dataTransfer.files[0]
		if (file) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onloadend = () => {
				setImage(reader.result)
				setShowImageUpload(false)
				setShowTryOnButton(true)
			}
		}
	}

	const handleTryOn = () => {
		setShowGenerating(true)
		setShowTryOnButton(false)
		setShowImageUpload(false)
		setShowProduct(false)
		setTimeout(() => {
			setShowGenerating(false)
			setImage("/man.jpg")
		}, 3000)
	}

	return (
		ready ? (
			<div className={styles.tryOnWrapper}>
				<PageTitle title="Try On" />
				{
					showProduct ? <ProductItem
					product={{productDisplayName, baseColour, contentId, _id}}
				/> : null
				}
				{showImageUpload && (
					<div className={styles.imageUploadWrapper}>
						<label htmlFor="imageUpload">Upload Image</label>
						<input
							type="file"
							id="imageUpload"
							accept="image/*"
							onChange={handleImageUpload}
						/>
						<div
							className={styles.dropRegion}
							onDrop={handleDrop}
							onClick={() => document.getElementById('imageUpload').click()}
						>
							Drop Image Here
						</div>
					</div>
				)}
				{image && (
					<div className={styles.imagePreviewWrapper}>
						<img src={image} alt="User uploaded" className={styles.userUploadedImage} height={260} />
					</div>
				)}
				{showTryOnButton && (
					<button className={styles.tryOnButton} onClick={handleTryOn}>TryOn Now</button>
				)}
				{showGenerating && (
					<Generating />
				)}
			</div>
		) : <Loading />
	)
}

export default TryOn


function Loading() {
	return (
		<div className={styles.loadingWrapper}>
			<h1>Please wait while we make arrangements to Try on...</h1>
		</div>
	)
}

function Generating() {
	return (
		<div className={styles.loadingWrapper}>
			<h1>Generating Try On... Please Wait...</h1>
		</div>
	)
}