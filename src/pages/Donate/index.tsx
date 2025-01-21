import { EmailButton } from "../Contact"
import donateimg from "./graphic.png"

import "./index.sass"
import "./media.sass"

export default function Donate() {
	return (
		<main id="Donate">
			<h1>Donate</h1>

			<div id="Donate_box">
				<h2>Thank you for considering a donation!</h2>
				<p>
					We are incredibly thankful to all whose efforts have propelled One Step Ahead to its current state. The Culver City Community sponsors our efforts to mentor our school district's next wave of brilliant minds. Your funds help us purchase books, learning tools, meeting software, and bring in professional adults for seminars about education.
				</p>
				<p>
					<h2>Get in touch with us to donate</h2>
					If you are able to support us, please contact us via email and our business team will graciously respond.
				</p>
				<p>
					<h2>Our primary contact is via email</h2>
					<EmailButton />
				</p>

				<div id="Donate__img-wrapper">
					<img alt="logo" src={donateimg} />
				</div>
			</div>
		</main>
	)
}