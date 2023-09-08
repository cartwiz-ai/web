import React, { useRef, useEffect, useState } from "react"
import Webcam from "react-webcam"
import * as tf from "@tensorflow/tfjs"
import * as mobilenet from "@tensorflow-models/mobilenet"

export default function ImageSearch() {
	const webcamRef = useRef(null)
	const [model, setModel] = useState(null)

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
			<button onClick={capture}>Classify Image</button>
		</>
	)
}
