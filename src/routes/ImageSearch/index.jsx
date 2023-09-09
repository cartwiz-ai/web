import styles from "./ImageSearch.module.css"
import React, { useRef, useEffect, useState } from "react"
import Webcam from "react-webcam"
import { useNavigate } from "react-router-dom"
// import * as tf from "@tensorflow/tfjs"
// import * as mobilenet from "@tensorflow-models/mobilenet"

export default function ImageSearch() {
	const webcamRef = useRef(null)
	const [model, setModel] = useState(null)
	
	let [chips, setChips] = useState([])

	useEffect(() => {
		async function loadModel() {
			const model = await mobilenet.load()
			setModel(model)
		}
		loadModel()
	}, [])

	const capture = async () => {
		const canvas = document.createElement("canvas")
		canvas.width = webcamRef.current.video.videoWidth
		canvas.height = webcamRef.current.video.videoHeight
		const ctx = canvas.getContext("2d")
		ctx.drawImage(webcamRef.current.video, 0, 0)
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const rawPixelData = Array.from(new Uint8Array(imageData.data))

		if (model) {
			const tensor = tf.browser
				.fromPixels(canvas)
				.resizeNearestNeighbor([224, 224])
				.toFloat()
				.expandDims()
			const predictions = await model.classify(tensor)
			console.log(predictions)
			let chips = predictions.map((prediction) => prediction.className)
			setChips(chips)

		}
	}


	return (
		<>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				videoConstraints={{ facingMode: "environment" }}
			/>
			<button onClick={capture}>Image Search</button>

			{
				chips.length > 0 ? <Chips chips={chips} /> : <> </>
			}

		</>
	)
}

function Chips({ chips }) {

	return (
		<div className={styles.chipsContainer}>
			{chips.map((chip, index) => (
				<Chip chip={chip} key={index} />
			))}
		</div>
	)
}

function Chip({ chip }) {

	let navigate = useNavigate()

	let handleClick = () => {
		navigate(`/search?q=${chip}`)
	}

	return <span className={styles.chipSpan} onClick={handleClick}>{chip}</span>
}
