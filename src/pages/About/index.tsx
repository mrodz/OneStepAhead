import { useEffect, useState } from "react"
import "./index.sass"
import "./media.sass"
import { Divider } from "@mui/material"

function getCompressedPath(personNameNoSpaces: string): string {
	return `Headshots/compressed/${personNameNoSpaces}.jpg`
}

function BlurryPhoto(props: { personNameNoSpaces: string, lazy?: boolean }) {
	const [loaded, setLoaded] = useState(false)

	return (
		<div className={`BlurryPhoto ${loaded ? "BlurryPhoto__loaded" : ""}`} style={{ backgroundImage: `url(${getCompressedPath(props.personNameNoSpaces)})` }}>
			<img {...!!props.lazy ? { loading: "lazy" } : {}} onLoad={() => setLoaded(true)} src={`Headshots/${props.personNameNoSpaces}.jpg`} alt={`${props.personNameNoSpaces}'s headshot`} />
		</div>
	)
}

interface TeamCardProps {
	name: string,
	role: string,
	description?: string,
}

function TeamCard(props: TeamCardProps & { lazy: boolean }) {
	return (
		<div className="TeamCard">
			<BlurryPhoto lazy={props.lazy} personNameNoSpaces={props.name.replaceAll(" ", "")}></BlurryPhoto>
			<div className="TeamCard__text">
				<h2>{props.name}</h2>
				<h3>{props.role}</h3>

				<p>{props.description ?? "No description yet!"}</p>
			</div>
		</div>
	)
}

const TEAM_DATA: TeamCardProps[] = [
	{
		name: "Annabelle Andreone",
		role: "Mentor",
	},
	{
		name: "Audrey Rothenberg",
		role: "Mentor",
		description: "I'm eager to teach and always open to new ideas! (This is a sample bio btw)"
	},
	{
		name: "Augusta Poggi",
		role: "Mentor",
	},
	{
		name: "Brandon Yang",
		role: "Mentor",
	},
	{
		name: "Emi Sakamoto",
		role: "Mentor",
	},
	{
		name: "Evan Daurio",
		role: "Mentor",
	},
	{
		name: "Eve Mott",
		role: "Mentor",
	},
	{
		name: "Gianna Wong",
		role: "Mentor",
		description: "Hi! I am a tutor who loves helping kids learn."
	},
	{
		name: "Kendyll Hoang",
		role: "Mentor",
	},
	{
		name: "Kira Connors",
		role: "Mentor",
	},
	{
		name: "Malia Valentic",
		role: "Mentor",
	},
	{
		name: "MarenBrown",
		role: "Mentor",
	},
	{
		name: "Miles Katz Facher",
		role: "Mentor",
	},
	{
		name: "Nina Faeh",
		role: "Mentor",
	},
	{
		name: "Tiffany Hotton",
		role: "Mentor",
	},
	{
		name: "Una Finn",
		role: "Mentor",
	},
]

export default function About() {

	useEffect(() => {
		const images = []

		for (let card of TEAM_DATA) {
			const img = new Image()
			img.src = getCompressedPath(card.name.replaceAll(" ", ""))
			images.push(img)
		}
	})

	return (
		<main id="Team">
			<h1>Meet Our Team</h1>

			<section id="Team__photo-wrapper">
				{TEAM_DATA.map((props, i) => <TeamCard lazy key={`TEAM_CARD_${props.name}`}  {...props} ></TeamCard>)}
			</section>

			<Divider>
				<h2>2023-2024 Club Members</h2>
			</Divider>

			<section className="Team__group-photo">
				<img alt="school club yearbook snapshot" src="/clubpicture.jpg" />
			</section>
		</main>
	)
}