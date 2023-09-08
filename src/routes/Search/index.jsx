import { useNavigate, useSearchParams } from "react-router-dom"



export default function Search() {
	const [searchParams, _] = useSearchParams()


	let q = searchParams.get("q")



	return <>You Searched for: {q}</>;
}