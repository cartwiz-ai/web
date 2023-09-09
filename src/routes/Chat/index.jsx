import React, { useEffect, useState } from "react"
import styles from "./Chat.module.css"
import { useParams, useNavigate } from "react-router-dom"

export default function Chat() {
	const [messages, setMessages] = useState([
		{ text: "Tell me more about this product", sender: "user" },
	])
	const [inputValue, setInputValue] = useState("")

	let [product, setProduct] = useState({})

	let PRODUCT_API_URL = "https://cartwiz.hop.sh/api/product/id"
	let CHATBOT_API_ENDPOINT = "https://cartwiz.hop.sh/api/chatbot/chat"

	let { productId } = useParams()
	let navigate = useNavigate()

	const handleInputChange = (event) => {
		setInputValue(event.target.value)
	}

	function sanitizedMessages() {
		const sanitizedMessages = messages.map((message) => {
			return { content: message.text }
		})
		return sanitizedMessages
	}

	function sanitizeThisMessage(newMessage) {
		const sanitizedMessage = { content: newMessage.text }
		return sanitizedMessage
	} 

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		if (inputValue.trim() !== "") {
			const newMessage = { text: inputValue, sender: "user" }
			setMessages([...messages, newMessage])
			setInputValue("")
			const chatbotRequest = await fetch(CHATBOT_API_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productJSON: product,
					messages: [...sanitizedMessages(), sanitizeThisMessage(newMessage)],
				}),
			})

			const chatbotResponse = await chatbotRequest.json()

			setTimeout(
				() =>
					setMessages([
						...messages,
						{ text: inputValue, sender: "user"},
						{ text: chatbotResponse, sender: "bot" },
					]),
				200
			)
		}
	}

	useEffect(() => {
		async function main() {
			if (!productId) {
				return navigate("/")
			}

			let request = await fetch(`${PRODUCT_API_URL}/${productId}`)
			let response = await request.json()

			setProduct(response)

			let chatbotRequest = await fetch(CHATBOT_API_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productJSON: response,
					messages: sanitizedMessages(),
				}),
			})

			let chatbotResponse = await chatbotRequest.json()

			setMessages([...messages, { text: chatbotResponse, sender: "bot" }])
		}

		main()
	}, [])

	return (
		<div className={styles.chatContainer}>
			<div className={styles.chatMessages}>
				{messages.map((message, index) => (
					<div
						key={index}
						className={`${styles.chatMessage} ${
							message.sender === "bot" ? styles.bot : styles.user
						}`}
					>
						{message.text}
					</div>
				))}
			</div>
			<form onSubmit={handleFormSubmit} className={styles.chatForm}>
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Type your message here..."
					className={styles.chatInput}
				/>
				<button type="submit" className={styles.chatSubmit}>
					Send
				</button>
			</form>
		</div>
	)
}
