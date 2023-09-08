import styles from "./SearchBar.module.css"
import image from "./assets/image.svg"
import mic from "./assets/mic.svg"
import search from "./assets/search.svg"

export default function SearchBar() {

	return (
		<div className={styles.searchWrapper}>
			<div className={styles.inputFieldContainer}>
				<input type="text" />
				<img src={search} alt="search icon" />
			</div>

			<div className={styles.buttonsContainer}>
				<img src={mic} alt="microphone icon" />
				<img src={image} alt="image icon" />
			</div>
			
		</div>
	);

	
}