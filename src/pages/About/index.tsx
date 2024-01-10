import { useEffect, useState } from "react"
import "./index.sass"
import "./media.sass"
import { Divider } from "@mui/material"

function getCompressedPath(personNameNoSpaces: string): string {
	return `Headshots/compressed/${personNameNoSpaces}.jpg`
}

function BlurryPhoto(props: { personNameNoSpaces: string, lazy?: boolean }) {
	const iOS =
		typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	// the styles for pulsating loading do not work on iOS for some reason
	const [loaded, setLoaded] = useState(iOS)

	return (
		<div className={`BlurryPhoto ${loaded ? "BlurryPhoto__loaded" : ""}`} {...!loaded ? { style: { backgroundImage: `url(${getCompressedPath(props.personNameNoSpaces)})` } } : {}}>
			<img {...!!props.lazy ? { loading: "lazy" } : {}} onLoad={() => setLoaded(true)} src={`Headshots/${props.personNameNoSpaces}.jpg`} alt={`${props.personNameNoSpaces}'s headshot`} />
		</div>
	)
}


interface TeamCardProps {
	name: string,
	role: string,
	description?: string,
	leadership?: number,
}

function TeamCard(props: TeamCardProps & { lazy: boolean }) {
	return (
		<div className="TeamCard">
			<BlurryPhoto lazy={props.lazy} personNameNoSpaces={props.name.replaceAll(" ", "")}></BlurryPhoto>
			<div className="TeamCard__text">
				<h2>{props.name}</h2>
				<h3>{props.role}</h3>

				<p>{props.description ?? "No bio yet!"}</p>
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
		role: "COO",
		leadership: 2,
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
		name: "Carmen Piro",
		role: "Mentor",
	},
	{
		name: "Emi Sakamoto",
		role: "Reading Curriculum Director",
		leadership: 1,
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
		name: "Flora Woo",
		role: "CFO",
		leadership: 2,
	},
	{
		name: "Gianna Wong",
		role: "Mentor",
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
		name: "Maren Brown",
		role: "Mathematics Curriculum Director",
		leadership: 1,
	},
	{
		name: "Mateo Rodriguez",
		role: "CTO",
		description: "Hey! I'm a passionate developer, and I'm managing the website and other tech-related affairs.",
		leadership: 2,
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
	{
		name: "Katie Sirio",
		role: "Reading Project Manager",
		leadership: 1,
	},
	{
		name: "Miriam Mirvish",
		role: "Mathematics Project Manager",
		leadership: 1,
	},
	{
		name: "Sofia Kinsella",
		role: "Creative Director",
		leadership: 1,
	},
	{
		name: "Robert Logan",
		role: "Project Controls Manager",
		leadership: 1,
	},
	{
		name: "Lila Bragard",
		role: "CEO",
		leadership: 10,
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
			<h1>Learn About Us</h1>

			<h2>Our Mission</h2>

			<section id="Team__description">
				Lorem Ipsum Dolor Sit Amet
			</section>

			<hr />

			<h2>Meet Our Team</h2>

			<section id="Team__description">
				Our workforce consists of lovely people who are each passionate about personal growth and teaching. We are proud to work with all of these individuals!
			</section>

			<section id="Team__leadership">
				<h3>Leadership</h3>
				{TEAM_DATA.filter(prop => prop.leadership !== undefined).sort((a, b) => b.leadership! - a.leadership!).map((props) => <TeamCard lazy key={`TEAM_CARD_${props.name}`}  {...props} ></TeamCard>)}

			</section>

			<section id="Team__photo-wrapper">
				<h3>Mentors</h3>
				{TEAM_DATA.filter(prop => prop.leadership === undefined).map((props) => <TeamCard lazy key={`TEAM_CARD_${props.name}`}  {...props} ></TeamCard>)}
			</section>

			<Divider>
				<h3>2023-2024 Club Members</h3>
			</Divider>

			<section className="Team__group-photo">
				<img alt="school club yearbook snapshot" src="/clubpicture.jpg" />
			</section>
		</main>
	)
}