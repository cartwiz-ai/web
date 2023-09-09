import React, { useState, useEffect } from "react"
import styles from "./Product.module.css"
import { useParams, useNavigate } from "react-router-dom"

export default function Product() {
	let URL_TO_FETCH = `http://localhost:4003/api/product/getProductDetails`
	let IMAGE_URL = "https://cartwiz-images.pages.dev"
	let URL_TO_AI_SUMMARY = "http://localhost:4003/api/product/getProductRating"

	const [reviews, setReviews] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [contentId, setContentId] = useState("")
	const [productDisplayName, setProductDisplayName] = useState("")
	const [baseColour, setBaseColour] = useState("")
	const [pros, setPros] = useState([])
	const [cons, setCons] = useState([])
	const [aiSummary, setAiSummary] = useState("")

	let { productId } = useParams()
	let navigate = useNavigate()

	useEffect(() => {
		async function main() {
			let request = await fetch(`${URL_TO_FETCH}/${productId}`)

			if (!request.ok) {
				console.log("Error fetching product details")
				return
			}

			let response = await request.json()

			setReviews(response.reviews)
			setIsLoading(false)
			setContentId(response.contentId)
			setProductDisplayName(response.productDisplayName)
			setBaseColour(response.baseColour)

			console.log(response)

			try {
				let aiRequest = await fetch(`${URL_TO_AI_SUMMARY}/${productId}`)
				let aiResponse = await aiRequest.json()

				if (aiResponse.pros === undefined) {
					return
				}

				setPros(aiResponse.pros)
				setCons(aiResponse.cons)
				setAiSummary(aiResponse.review)
			} catch (error) {}
		}
		main()
	}, [])

	const chatWithChatBot = () => {
		console.log("REACT SUCKS")
	}

	let handleTryOnButton = () => {
		navigate(`/tryOn/${productId}`)
	}

	return (
		<div>
			<div className={styles.buttonHolder}>
				<button className={styles.tryOnButton} onClick={handleTryOnButton}>Try On</button>
			</div>
			<div className={styles.productImage}>
				<img
					src={`${IMAGE_URL}/${contentId}.jpg`}
					alt={productDisplayName}
				/>
			</div>
			<div className={styles.chips}>
				<div className={styles.prosConsChipHolder}>
					<Pros pros={pros} />
					<Cons cons={cons} />
				</div>
			</div>
			<div className={styles.productDetails}>
				<h1>{productDisplayName}</h1>
				<span className={styles.aiSummary}>{aiSummary}</span>
				<p>Color: {baseColour}</p>
				<button onClick={chatWithChatBot}>Chat about this...</button>
				<div>
					<h2>Customer Reviews</h2>
					{/* Add customer reviews section here */}
					{reviews.map((review) => (
						<Review review={review} key={review._id} />
					))}
				</div>
			</div>
			{isLoading ? <p>Loading product description...</p> : <></>}
		</div>
	)
}

function Review({ review }) {
	return (
		<div className={styles.review}>
			<div className={styles.user}>
				<img
					src={review.user.profilePic}
					alt={`${review.user.firstName} ${review.user.lastName}`}
					className={styles.profilePic}
				/>
				<h3 className={styles.userName}>
					{review.user.firstName} {review.user.lastName}
				</h3>
			</div>
			<p className={styles.reviewBody}>{review.review}</p>
		</div>
	)
}

function Pros({ pros }) {
	return (
		<>
			{pros.map((pro) => (
				<div className={styles.prosChip}>{pro}</div>
			))}
		</>
	)
}

function Cons({ cons }) {
	return (
		<>
			{cons.map((con) => (
				<div className={styles.consChip}>{con}</div>
			))}
		</>
	)
}
