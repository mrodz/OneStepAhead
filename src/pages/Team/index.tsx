import { useEffect, useState } from "react"
import "./index.sass"
import "./media.sass"
import { Divider } from "@mui/material"

function getCompressedPath(personNameNoSpaces: string): string {
	return `Headshots/compressed/${personNameNoSpaces}.jpg`
}

function BlurryPhoto(props: { personNameNoSpaces: string }) {
	const [loaded, setLoaded] = useState(false)

	return (
		<div className={`BlurryPhoto ${loaded ? "loaded" : ""}`} style={{ backgroundImage: `url(${getCompressedPath(props.personNameNoSpaces)})` }}>
			<img loading="lazy" onLoad={() => setLoaded(true)} src={`Headshots/${props.personNameNoSpaces}.jpg`} alt="" />
		</div>
	)
}

interface TeamCardProps {
	name: string,
	role: string,
	description?: string,
}

function TeamCard(props: TeamCardProps) {
	return (
		<div className="TeamCard">
			<BlurryPhoto personNameNoSpaces={props.name.replaceAll(" ", "")}></BlurryPhoto>
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
		role: "Role TBD",
	},
	{
		name: "Audrey Rothenberg",
		role: "TBD",
		description: "I'm eager to teach and always open to new ideas! (This is a sample bio btw)"
	},
	{
		name: "Augusta Poggi",
		role: "TBD",
	},
	{
		name: "Brandon Yang",
		role: "TBD",
	},
	{
		name: "Emi Sakamoto",
		role: "TBD",
	},
	{
		name: "Evan Daurio",
		role: "TBD",
	},
	{
		name: "Eve Mott",
		role: "TBD",
	},
	{
		name: "Gianna Wong",
		role: "TBD",
	},
	{
		name: "Kendyll Hoang",
		role: "TBD",
	},
	{
		name: "Kira Connors",
		role: "TBD",
	},
	{
		name: "Malia Valentic",
		role: "TBD",
	},
	{
		name: "MarenBrown",
		role: "TBD",
	},
	{
		name: "Miles Katz Facher",
		role: "TBD",
	},
	{
		name: "Nina Faeh",
		role: "TBD",
	},
	{
		name: "Tiffany Hotton",
		role: "TBD",
	},
	{
		name: "Una Finn",
		role: "TBD",
	},
]

export default function Team() {

	useEffect(() => {
		const images = []

		for (let card of TEAM_DATA) {
			const img = new Image()
			img.src = getCompressedPath(card.name.replaceAll(" ", ""))
			images.push(img)
		}
	})

	return (
		<main className="team">
			<h1>Meet Our Team</h1>

			<section className="Team__photo-wrapper">
				{TEAM_DATA.map((props) => <TeamCard {...props} ></TeamCard>)}
				<div style={{ margin: "auto 0", fontStyle: "italic" }}>
					... We're growing! Check back for more mentors to come
				</div>
			</section>

			<Divider>
				<h2>2023-2024 Club Members</h2>
			</Divider>

			<section className="Team__group-photo">
				<img src="/clubpicture.jpg" />
			</section>
		</main>
	)
}