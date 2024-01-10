import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material'
import './index.sass'
import './media.sass'

export default function NotFound() {
	let navigate = useNavigate();

	return (
		<main id="NotFound">
			<h1>
				404
			</h1>
			<div id="NotFound__welcome">
				Hey! Thanks for checking out our site.
			</div>
			<div id="NotFound__description">
				Unfortunately, this page either does not exist or is still being built.
				This website is under construction! 🏗️

				<br />
				<br />

				You're at:
				<br />
				<code>
					{window.location.pathname}
				</code>
			</div>
			<Button id="NotFound__button" variant='contained' onClick={() => navigate(-1)}>
				Go Back
			</Button>
		</main>
	)
}