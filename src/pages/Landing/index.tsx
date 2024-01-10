import { useEffect, useState, useRef, useCallback, memo, FC, PropsWithChildren } from 'react'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

import ParallaxImageSplit, { ParallaxImageTextSection } from '../../components/ParallaxImageSplit'

import landinggraphic from './images/landinggraphic.png'
import classroom from './images/classroom.jpg'
import zoom from './images/zoom.jpg'
import ccef from './images/ccef.png'
import ccusd from './images/ccusd.png'
import elmarinologo from './images/elmarinologo.gif'
import elrinconlogo from './images/elrinconlogo.png'
import laballonalogo from './images/laballonalogo.png'
import linhowelogo from './images/linhowelogo.png'
import farragutlogo from './images/farragutlogo.png'

import GlobalStyles from '../../index.sass'
import LandingStyles from './index.sass'

import './index.sass'
import './media.sass'
import { Button, ButtonGroup, IconButton, Avatar, Divider } from '@mui/material'
import { useMobile } from '../../hooks/useSizes'
import FounderBlurb from './FounderBlurb'

interface ImageCarouselDotsProps {
	len: number,
	idx?: number
}

const Dot = memo((props: { on?: boolean }) => {
	return (
		<div className="Dot__carousel-dot" {...props?.on && { "data-on": true }}>
			&bull;
		</div>
	)
})

function ImageCarouselDots({ len, idx = 0 }: ImageCarouselDotsProps) {
	const dots = Array.from({ length: len }, (_, i) => <Dot on={i === idx} key={i} />)

	return (
		<div className="ImageCarouselDots__carousel-dots">
			{dots}
		</div>
	)
}

type ImageCarouselImage = {
	url: string,
	description?: string
}

interface ImageCarouselProps {
	images: ImageCarouselImage[],
	startIdx?: number
}

const IMAGES: ImageCarouselImage[] = [
	{
		url: landinggraphic,
		// description: "Check out our new website :-)"
	},
	// {
	// 	url: classroom,
	// 	description: 'Look at these kids hard at work'
	// },
	// {
	// 	url: tutor,
	// 	description: 'Tutoring Description Goes Here'
	// },
	// {
	// 	url: elmarino,
	// 	description: 'El Marino Language School'
	// },
	// {
	// 	url: chocolate,
	// 	description: 'Size of an iPhone 13 landscape photo'
	// }
]

function rollover(dir: "up" | "down", value: number, limit: number) {
	if (dir === "up")
		return ++value > limit ? 0 : value

	return --value < 0 ? limit : value
}

type ParallaxImageItem = {
	title: string,
	url: string,
	content: JSX.Element | string,
}

interface ParallaxImagesSectionProps {
	items: ParallaxImageItem[]
}

function ParallaxImagesSection({ items }: ParallaxImagesSectionProps) {
	const result = items.map(({ url, title, content }, i) => {
		const image = <ParallaxImageSplit bottomLimit={400} fileName={url} alt={title} leading={i % 2 === 0 ? 'L' : 'R'} />

		return (
			<ParallaxImageTextSection key={i} title={title} content={content} image={image} />
		)
	})

	return (
		<section id="parallax-images" className="landing-content-spacing">
			<div className="single-cell ParallaxImagesSection__wrapper" >
				{result}
			</div>

			<div className="single-cell ParallaxImagesSection__bg">
			</div>
		</section>
	)
}

function DataSplashSection() {
	return (
		<section id="facts">
			{/* <ul className="DataSplashSection__list landing-content-spacing">
				<li><div className="DataSplashSection__fact"><strong>##</strong> Students Helped</div></li>
				<li><div className="DataSplashSection__fact"><strong>$####</strong> Dollars Raised</div></li>
				<li><div className="DataSplashSection__fact"><strong>##</strong> Qualified Mentors</div></li>
			</ul> */}
		</section>
	)
}

function preloadImages(sources: string[]) {
	let preloadedImages = new Array(sources.length)

	for (const source of sources) {
		const image = new Image()

		// allow garbage collection on duplicate values.
		image.onload = function () {
			let idx = preloadedImages.indexOf(this)
			if (idx !== -1) preloadedImages.splice(idx, 1)
		}

		preloadedImages.push(image)
		image.src = source
	}
}

function useRollover(size: number, initial: number = 0): [number, () => void, () => void] {
	const [state, setState] = useState(initial)

	const inc = useCallback(() => {
		setState(state => rollover("up", state, size))
	}, [size])

	const dec = useCallback(() => {
		setState(state => rollover("down", state, size))
	}, [size])

	return [state, inc, dec]
}

function ImageCarousel({ images, startIdx = 0 }: ImageCarouselProps) {
	const [currentIdx, inc, dec] = useRollover(images.length - 1, startIdx)

	const [switching, setSwitching] = useState(false)

	const [newSrc, setNewSrc] = useState<string>(null!)
	const timeoutId = useRef<NodeJS.Timeout[]>([])

	const nextButton = useRef<HTMLButtonElement>(null!)

	const advance = useCallback(() => {
		if (switching) return

		setSwitching(true)
		setNewSrc(images[rollover("up", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			inc()
			setSwitching(false)
		}, LandingStyles.delay))
	}, [switching, inc, images, currentIdx])

	const retract = useCallback(() => {
		if (switching) return

		setSwitching(true)
		setNewSrc(images[rollover("down", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			dec()
			setSwitching(false)
		}, LandingStyles.delay))
	}, [switching, dec, images, currentIdx])

	useEffect(() => {
		const intervalId = setInterval(() => {
			nextButton.current?.click()
		}, LandingStyles.delay * 20)

		// allows cleanup of ref value
		const clone = timeoutId.current

		return () => {
			if (clone.length !== 0) {
				let id
				while ((id = clone.pop()) !== undefined) {
					clearTimeout(id)
				}
			}

			clearInterval(intervalId)
		}
	}, [timeoutId])

	// Here, we ASYNCHRONOUSLY preload images to avoid flickering in
	// the carousel.
	useEffect(() => {
		preloadImages(images.map(img => img.url))
	}, [images])

	const multipleItems = images.length > 1

	return (
		<div className="ImageCarousel__image-carousel landing-content-spacing">
			<div role="img" className={`div-as-img ${switching ? "ImageCarousel__fade-out" : ""}`} style={{ backgroundImage: `url(${images[currentIdx].url})`, }}></div>
			{switching && (
				<div role="img" className={`div-as-img ${switching ? "ImageCarousel__fade-in" : ""}`} style={{ backgroundImage: `url(${newSrc})`, position: 'absolute', zIndex: 2, top: 0, left: 0 }}></div>
			)}

			{!!images[currentIdx].description && <div className="ImageCarousel__image-carousel-blurb important-left-items">
				{images[currentIdx].description}
			</div>}

			{multipleItems && <>
				<Avatar sx={{
					bgcolor: '#fff',
					position: 'absolute',
					zIndex: 10,
					top: '50%',
					bottom: '50%',
					right: '10px',
					height: 'max-content'
				}}>
					<IconButton ref={nextButton} onClick={advance}>
						<KeyboardArrowRightIcon />
					</IconButton>
				</Avatar>

				<Avatar sx={{
					bgcolor: '#fff',
					position: 'absolute',
					zIndex: 10,
					top: '50%',
					bottom: '50%',
					left: '10px',
					height: 'max-content'
				}}>
					<IconButton onClick={retract} >
						<KeyboardArrowLeftIcon />
					</IconButton>
				</Avatar>

				<ImageCarouselDots len={images.length} idx={currentIdx} />
			</>}
		</div >
	)
}

/**
 * @see {@link HeroTransition} for usage
 */
const TRANSITION_COLORS: [string, string, string] = [
	'#748573',
	'#516351',
	GlobalStyles.COLOR_MAIN
]

function HeroTransition() {
	/**
	 * Check out this site! https://getwaves.io/
	 * @returns JSX
	 */
	function Transition() {
		return (
			<div id="transition" className="single-cell">
				{/* <div style={{ flex: '1 1 0', backgroundColor: 'lime', border: 'solid orange 2px' }}>

				</div> */}

				<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<path fill={TRANSITION_COLORS[0]} fillOpacity="1" d="M0,128L17.1,112C34.3,96,69,64,103,90.7C137.1,117,171,203,206,240C240,277,274,267,309,224C342.9,181,377,107,411,96C445.7,85,480,139,514,138.7C548.6,139,583,85,617,106.7C651.4,128,686,224,720,245.3C754.3,267,789,213,823,176C857.1,139,891,117,926,122.7C960,128,994,160,1029,165.3C1062.9,171,1097,149,1131,128C1165.7,107,1200,85,1234,106.7C1268.6,128,1303,192,1337,192C1371.4,192,1406,128,1423,96L1440,64L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"></path>
				</svg>
				<svg style={{ marginTop: '-2px' }} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<rect width="100%" height="100%" fill={TRANSITION_COLORS[0]} />
					<path fill={TRANSITION_COLORS[1]} fillOpacity="1" d="M0,192L24,192C48,192,96,192,144,181.3C192,171,240,149,288,128C336,107,384,85,432,101.3C480,117,528,171,576,176C624,181,672,139,720,133.3C768,128,816,160,864,154.7C912,149,960,107,1008,117.3C1056,128,1104,192,1152,181.3C1200,171,1248,85,1296,80C1344,75,1392,149,1416,186.7L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
				</svg>
				<svg style={{ marginTop: '-3px' }} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<rect width="100%" height="100%" fill={TRANSITION_COLORS[1]} />
					<path fill={TRANSITION_COLORS[2]} fillOpacity="1" d="M0,192L24,192C48,192,96,192,144,181.3C192,171,240,149,288,128C336,107,384,85,432,101.3C480,117,528,171,576,176C624,181,672,139,720,133.3C768,128,816,160,864,154.7C912,149,960,107,1008,117.3C1056,128,1104,192,1152,181.3C1200,171,1248,85,1296,80C1344,75,1392,149,1416,186.7L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
				</svg>
			</div >
		)
	}

	return (
		<section id="theory" className="landing-content-spacing">
			<div id="theory-title">
				Remote peer mentoring to minimize CCUSD’s socioeconomic achievement gap.			</div>
			<div style={{ display: 'grid', height: '100%' }}>
				<Transition />
				<div className="single-cell" id="theory-explanation">
					<p>
						One Step Ahead Culver City is a 501(c)3 non-profit organization and Culver City High School club working towards a more equitable future for all students in CCUSD. We connect students from all five elementary schools with high school mentors who assist them in their individual struggles with reading and math.
					</p>

					<Divider style={{ marginTop: '2rem', marginBottom: '2rem' }}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V4q0-.825.588-1.413T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.588 1.413T18 22H6Zm5-11l2.5-1.5L16 11V4h-5v7Z"></path></svg>
						</div>
					</Divider>
					<p>
						Our vision is centered around community: we work with teachers, MTSS specialists, administrators, parents, and students; to ensure our work is impactful and long-lasting. We hope to not only catch our students back up but to build intrinsic learning motivation and growth mindsets that will help them for the rest of their education.
					</p>
				</div>
			</div>
		</section>
	)
}

function MobileHero() {
	return (
		<div className="MobileHero__main">
			<div className='MobileHero__focus-image' style={{
				backgroundImage: "url('/hero_image.webp')"
			}} />
			<div className='MobileHero__focus-text'>
				<h1>
					One Step Ahead
					<br />
					&bull;&nbsp;&bull;&nbsp; &bull;
					<br />
					Culver City, California
				</h1>
				<div className='MobileHero__location'>
					<img width="80%" src="/kids_in_classroom.jpg" alt="kids in classroom" />
					{/* Making a <b>real</b> difference in our community, one kid at a time */}
				</div>
			</div>
		</div>
	)
}

function HeroSection() {
	const isMobile = useMobile();

	const focus = isMobile ? <MobileHero /> : <div id="hero-wrapper"><ImageCarousel images={IMAGES} /></div>

	return (
		<section id="hero">
			{focus}
		</section>
	)
}

function SupportSection() {
	const sectionRef = useRef(null);

	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (!visible && entry.isIntersecting) setVisible(true)
		}, { root: null, rootMargin: '0px', threshold: 0.001 })

		const copy = sectionRef.current // required per the rules of useEffect with DOM elements.

		if (copy) observer.observe(copy)

		return () => {
			if (copy) observer.unobserve(copy)
		}
	}, [visible])

	return (
		<section ref={sectionRef} id="supporters" className="landing-content-spacing">
			<div className="Header__title">
				Thank You To Our Friends At
			</div>

			<div className={`SupportSection__images ${visible ? "SupportSection__fade-in" : ""}`}>
				<img data-do-not-render-mobile alt="Culver City Unified School District" style={{ maxWidth: "100px" }} src={ccusd} />
				<img alt="El Marino Language School" className="standard-image" src={elmarinologo} />
				<img alt="El Rincon Elementary School" className="standard-image" src={elrinconlogo} />
				<img alt="La Ballona Elementary School" className="standard-image" src={laballonalogo} />
				<img alt="Linwood E. Howe Elementary School" className="standard-image" src={linhowelogo} />
				<img alt="Farragut Elementary School" className="standard-image" src={farragutlogo} />
			</div>

			<div className="Header__title" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
				And a Special Thanks To
			</div>

			<div ref={sectionRef} className={`SupportSection__images ${visible ? "SupportSection__fade-in" : ""}`}>
				<img alt="Culver City Education Foundation" className="standard-image" src={ccef} />
			</div>


		</section>
	)
}

function FooterSection() {
	return (
		<footer className="Landing__footer">
			<div id="footer-location">
				<div id="footer-location-title">One Step Ahead Culver City</div>
				<table id="footer-location-about-desktop" cellSpacing="0">
					<tbody>
						<tr>
							<th>Find us at:</th>
							{/* <th>Call us at:</th> */}
						</tr>
						<tr>
							<td>Culver City High School &mdash; 4401 Elenda Street, Culver City, CA 90230</td>
							{/* <td><PhoneLink number='111-222-3333' text='(111) 222-3333' /></td> */}
						</tr>
					</tbody>
				</table>
				<div id="footer-location-about-mobile">
					<div>
						Culver City High School, 4401 Elenda Street, Culver City, CA 90230
					</div>
					{/* <PhoneLink number='111-222-3333' text='(111) 222-3333' /> */}
				</div>

				<div id="footer-location-quote">
					Email Us At: <a href="mailto:onestepaheadculvercity@gmail.com">onestepaheadculvercity@gmail.com</a>
				</div>
			</div>
			<div id="footer-credits">
				<span id="copyright">
					{new Date().getFullYear()} Mateo Rodriguez Web Development, All Rights Reserved.
				</span>
			</div>

		</footer >
	)
}

const PARALLAX_IMAGES: ParallaxImageItem[] = [
	{
		title: 'Students helping students one-on-one to stay one step ahead in their education',
		content: <>
			<div>
				<p>
					A student's ability to perform in the classroom is heavily tied to factors outside of their control.
					Students from socioeconomically disadvantaged households are statistically more likely to fall behind
					and stay behind in both reading and math in our current school system.
				</p>
				<p>
					Our one-on-one approach to peer mentoring ensures that each student's individual needs are met to keep them academically motivated and engaged. We hope that through our work we can create a more diverse future generation of leaders in Culver City, California.
				</p>
			</div>
			<ButtonGroup>
				<Button href="/mission" size='large' variant='contained' fullWidth style={{ textAlign: 'center' }}>
					Explore our mission and work
				</Button>
			</ButtonGroup>

		</>,
		url: classroom
	},
	{
		title: 'Our mentors are all passionate high school volunteers working to share their knowledge and skills',
		content: <>
			<div>
				<p>
					Our mentors are all passionate high school volunteers working to share their
					knowledge and skills in hopes of a more equitable future.
				</p>
				<p>
					We require that our mentors be extremely well versed in their subject matter, and perform
					extensive training to ensure that every session is effective.
				</p>
				<p>
					Above all, our goal is for each student to consider their mentor a real friend.
				</p>
			</div>
			<ButtonGroup>
				<Button href="/mission" size='large' variant="contained" fullWidth style={{ textAlign: 'center' }}>
					Become a Mentor
				</Button>
				<Button href="/mission" size='large' variant="contained" fullWidth style={{ textAlign: 'center' }}>
					Meet the Team
				</Button>
			</ButtonGroup>
		</>,
		url: '/clubpicture.jpg',
	},
	{
		title: 'We rely on the Culver City community for support to make our program the best it can be',
		content: <>
			<div>
				<p>
					We gather input from teachers, specialists, and parents to target the
					students who need our help the most. One Step Ahead provides these
					kids with assistance that they may not have received otherwise in their families.
				</p>
				<p>
					While all our mentors and leaders double as volunteers, we still require funds
					to keep our program going. We are incredibly grateful to the community members
					and organizations who make it possible for us to buy books for students, fund
					the legal side of running a nonprofit, register a website domain, and cover
					extra program costs.
				</p>
			</div>
			<ButtonGroup>
				<Button href="/mission" size='large' variant="contained" fullWidth style={{ textAlign: 'center' }}>
					The Referral Process
				</Button>
				<Button href="/mission" size='large' variant="contained" fullWidth style={{ textAlign: 'center' }}>
					Donate Today
				</Button>
			</ButtonGroup>
		</>,
		url: classroom,
	}
]

const Quotes: FC<PropsWithChildren> = (props) => {
	return (
		<ul className="Quotes">
			{props.children}
		</ul>
	)
}

const Quote: FC<PropsWithChildren> = (props) => {
	return (
		<li className="Quote">
			<div className="Quote__symbol">
				<FormatQuoteIcon />
			</div>
			<div className="Quote__content">
				{props.children}
			</div>
		</li>
	)
}

export default function Landing() {
	const greeting = useRef<HTMLDivElement>(null)

	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			// setVisible(entry.isIntersecting)
			if (!visible && entry.isIntersecting) setVisible(true)
		}, { root: null, rootMargin: '0px', threshold: 0.1 })

		const copy = greeting.current // required per the rules of useEffect with DOM elements.

		if (copy) observer.observe(copy)

		return () => {
			if (copy) observer.unobserve(copy)
		}
	}, [greeting, visible])

	return (
		<main id="Landing">
			<HeroSection />
			<HeroTransition />

			<ParallaxImagesSection items={PARALLAX_IMAGES} />

			<FounderBlurb left colors={[GlobalStyles.COLOR_MAIN, GlobalStyles.COLOR_SPLASH]} url={zoom} title="Testimonials" className="landing-content-spacing landing-content-v-spacing">
				<div>
					<Quotes>
						<Quote>
							<div>
								I almost automatically saw a massive boost in Sebastian's confidence level when reading aloud with him or with me. Decoding words with Miles, he says, is...
							</div>
							<div className="Quote__emphasis">
								really cool and fun to do!
							</div>
							<div>
								The way in which they read together over Zoom, paragraph by paragraph, and then discussing what the story is about... and knowing it's okay not to know the definition of certain words are two critical factors that I feel Miles is developing and showing Sebastian weekly!
							</div>
						</Quote>
					</Quotes>
				</div>
			</FounderBlurb>

			<SupportSection />

			<DataSplashSection />

			<Divider />

			<div ref={greeting} id="visit-us" className={`Header__title ${visible ? 'Landing__fade-in' : ''}`}>
				Mentoring for a Brighter Future
			</div>
			<FooterSection />
		</main>
	)
}