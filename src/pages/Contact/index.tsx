import { Button, Divider } from '@mui/material'
import './index.sass'
import './media.sass'
import contactimg from './graphic.jpg'

function EmailButton() {
	return (
		<Button href="mailto:onestepaheadculvercity@gmail.com">
			<span id="EmailButton__text-long">
				onestepaheadculvercity@gmail.com
			</span>
			<span id="EmailButton__text-short">
				Here
			</span>
		</Button>
	)
}

export default function Contact() {
	return (
		<main id="Contact">
			<h1>Contact Us</h1>

			<div id="Contact__grid">

				<div id="Contact__info">
					Please email us at
					<EmailButton />
					with any inquiries, questions, or concerns.

					<Divider style={{ margin: '1rem 0' }}>
						<strong id="Contact__parent-callout">Parents!</strong>
					</Divider>

					<div>
						If your child is participating in the program, <strong>please regularly check your inbox or text messages</strong>.
						Our mentors need to be able to reach you to check in, schedule meetings, and announce any unexpected circumstances.
						Thank you for your cooperation!

						<br />
						<br />

						&mdash; The One Step Ahead Team
					</div>
				</div>

				<div id="Contact__img-wrapper">
					<img src={contactimg} />
				</div>
			</div>

		</main>
	)
}