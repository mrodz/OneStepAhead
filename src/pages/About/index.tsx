import { useEffect, useState } from "react"
import "./index.sass"
import "./media.sass"

function getCompressedPath(personNameNoSpaces: string): string {
	return `Headshots/compressed/${personNameNoSpaces}.jpg`
}

function BlurryPhoto(props: { personNameNoSpaces: string, lazy?: boolean, leadership: boolean }) {
	const iOS =
		typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	// the styles for pulsating loading do not work on iOS for some reason
	const [loaded, setLoaded] = useState(iOS)

	const optionalProperties: any = {};

	if (!loaded) {
		optionalProperties["style"] = { backgroundImage: `url(${getCompressedPath(props.personNameNoSpaces)})` };
	}

	if (props.leadership) {
		optionalProperties["data-leadership"] = true
	}

	return (
		<div className={`BlurryPhoto ${loaded ? "BlurryPhoto__loaded" : ""}`} {...optionalProperties}>
			<img {...!!props.lazy ? { loading: "lazy" } : {}} onLoad={() => setLoaded(true)} src={`Headshots/${props.personNameNoSpaces}.jpg`} alt={`${props.personNameNoSpaces}'s headshot`} />
		</div>
	)
}


interface TeamCardProps {
	name: string,
	role: string,
	leadership?: number,
}

function TeamCard(props: TeamCardProps & { lazy: boolean }) {
	return (
		<div className="TeamCard" {...props.leadership ? { "data-leadership": props.leadership } : {}}>
			<BlurryPhoto lazy={props.lazy} leadership={!!props.leadership} personNameNoSpaces={props.name.replaceAll(" ", "")}></BlurryPhoto>
			<div className="TeamCard__text">
				<h2>{props.name}</h2>
				<h3>{props.role}</h3>
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
		role: "Chief Operating Officer",
		leadership: 9,
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
		role: "Mathematics Project Manager",
		leadership: 2
	},
	{
		name: "Emi Sakamoto",
		role: "Reading Curriculum Director",
		leadership: 8,
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
		role: "Chief Financial Officer",
		leadership: 5,
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
		leadership: 7,
	},
	{
		name: "Mateo Rodriguez",
		role: "Chief Technology Officer",
		leadership: 6,
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
		leadership: 3,
	},
	{
		name: "Miriam Mirvish",
		role: "Mentor",
	},
	{
		name: "Sofia Kinsella",
		role: "Creative Director",
		leadership: 4,
	},
	{
		name: "Robert Logan",
		role: "Project Controls Manager",
		leadership: 1,
	},
	{
		name: "Lila Bragard",
		role: "Chief Executive Officer and Founder",
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
			<h1>Our Team</h1>

			<section id="Team__group-photo">
				<img alt="school club yearbook snapshot" src="/clubpicture.jpg" />
			</section>

			<section id="Team__description">
				One Step Ahead Culver City was founded in 2023 by Culver City High School students and has remained a student-led, student-run organization. Every member of our team mentors for our program in addition to any of their additional leadership or organizational responsibilities.
			</section>

			<section id="Team__leadership">
				<h3 style={{ fontSize: "200%" }}>Leadership</h3>
				{TEAM_DATA.filter(prop => prop.leadership !== undefined).sort((a, b) => b.leadership! - a.leadership!).map((props) => <TeamCard lazy key={`TEAM_CARD_${props.name}`}  {...props} ></TeamCard>)}

			</section>

			<section id="Team__photo-wrapper">
				<h3 style={{ fontSize: "200%" }}>Mentors</h3>
				{TEAM_DATA.filter(prop => prop.leadership === undefined).map((props) => <TeamCard lazy key={`TEAM_CARD_${props.name}`}  {...props} ></TeamCard>)}
			</section>
		</main>
	)
}