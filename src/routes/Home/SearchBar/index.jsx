import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./SearchBar.module.css"
import image from "./assets/image.svg"
import mic from "./assets/mic.svg"
import search from "./assets/search.svg"
import hearing from "./assets/hearing.svg"

export default function SearchBar({text}) {

	let navigate = useNavigate()

	let [isListening, setIsListening] = useState(false)


	let [textValue, setTextValue] = useState(text || "")

	let handleTextChange = (event) => {
		setTextValue(event.target.value)
	}

	let handleSearchButtonClick = () => {
		console.log("search button clicked")
		if(textValue.length > 0) {
			navigate(`/search?q=${textValue}`)
		}
	}

	let handleImageSearchButtonClick = () => {
		console.log("image search button clicked")
		navigate("/imageSearch")
	}

	let handleEnterKeyDown = (event) => {
		if (event.key === "Enter") {
			handleSearchButtonClick()
		}
	}


	let handleMicButtonClick = async () => {
		console.log("mic button clicked")
		setIsListening(true)

		try {
			let recognition = new window.webkitSpeechRecognition()
			recognition.continuous = false
			recognition.interimResults = false
			recognition.lang = "en-US"
			recognition.start()

			await new Promise((resolve, reject) => {
				recognition.onresult = (event) => {
					let transcript = event.results[0][0].transcript
					setTextValue(transcript)
					setTimeout(() => {
						navigate(`/search?q=${transcript}`)
					}, 1000)
					resolve()
				}

				recognition.onend = () => {
					console.log("recognition ended")
					resolve()
					setIsListening(false)
				}

				recognition.onerror = (event) => {
					console.error(event.error)
					reject(event.error)
				}
			})
		} catch (error) {
			console.error(error)
		}
	}


	return (
		<div className={styles.searchWrapper}>
			<div className={styles.inputFieldContainer}>
				<input type="text"
					className={styles.inputField}
					value={textValue}
					placeholder="Search anything..."
					onChange={handleTextChange}
					onKeyDown={handleEnterKeyDown}
				/>
				<img src={search} alt="search icon"
				
					onClick={handleSearchButtonClick}
				/>
			</div>

			<div className={styles.buttonsContainer}>
				<img src={isListening ? hearing : mic} alt="microphone icon"
					className={styles.microphoneIcon}
					onClick={handleMicButtonClick}
				/>
				<img src={image} alt="image icon"
					className={styles.imageIcon}
					onClick={handleImageSearchButtonClick}
				/>
			</div>
			
		</div>
	);

	
}