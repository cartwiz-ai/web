import { useNavigate } from "react-router-dom";
import styles from "./ProductItem.module.css"



export default function ProductItem(props) {
	const { productDisplayName, baseColour, contentId, _id} = props.product;

	let navigate = useNavigate()


	let handleDivClick = () => {
		console.log("div clicked")
		// navigate to /product/productId
		navigate(`/product/${_id}`)
	}

	return (
		<div className={styles.productItem} onClick={handleDivClick}>
			<div className={styles.productImage}>
				<img
					src={`https://cartwiz-images.pages.dev/${contentId}.jpg`}
					alt={productDisplayName}
				/>
			</div>
			<div className={styles.productInfo}>
				<h2 className={styles.productTitle}>{productDisplayName}</h2>
				<p className={styles.productColor}>Color: {baseColour}</p>
			</div>
		</div>
	);
}
