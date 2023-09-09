import styles from "./PageTitle.module.css";

const PageTitle = ({ title }) => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>{title}</h1>
		</div>
	);
};

export default PageTitle;
