import { useEffect, useState, useRef, useCallback, memo } from 'react'

import Phone from '@mui/icons-material/Phone'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LocalDiningIcon from '@mui/icons-material/LocalDining'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

import pizza from './pizza.webp'
import wine from './wine.jpg'
import parm from './parm.jpg'
import pasta from './pasta.jpg'

import './index.sass'
import styles from './index.sass'

/**
 * @param signal a callback function, will fire when this comes into view.
 * @returns JSX
 */
function LocationBar(props: { signal?: (arg: boolean) => void }) {
	const header = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			props?.signal?.(entry.isIntersecting)
		}, { root: null, rootMargin: '0px', threshold: 0.01 })

		const copy = header.current // required per the rules of useEffect with DOM elements.

		if (copy) observer.observe(copy)

		return () => {
			if (copy) observer.unobserve(copy)
		}
	}, [header])

	return (
		<div className="location-bar" ref={header}>
			5490 W Centinela Ave, Westchester, CA 90045
			<Button sx={{ padding: 0 }} variant='text' href="tel:310-670-8122">
				<Phone /> (310) 670-8122
			</Button>
		</div >
	)
}

interface HeaderButtonProps {
	content: string,
	emphasized?: boolean
}

function HeaderButton({ content, emphasized = false }: HeaderButtonProps) {
	return (
		<Button variant={!emphasized ? 'text' : 'contained'}>
			{content}
		</Button>
	)
}

interface ImageCarouselDotsProps {
	len: number,
	idx?: number
}

const Dot = memo((props: { on?: boolean }) => {
	return (
		<div className="carousel-dot" {...props?.on && { "data-on": true }}>
			&bull;
		</div>
	)
})

function ImageCarouselDots({ len, idx = 0 }: ImageCarouselDotsProps) {
	const dots = Array.from({ length: len }, (_, i) => <Dot on={i === idx} key={i} />)

	return (
		<div className="carousel-dots">
			{dots}
		</div>
	)
}

type ImageCarouselImage = {
	url: string,
	description: string
}

interface ImageCarouselProps {
	images: ImageCarouselImage[],
	startIdx?: number
}

const IMAGES: ImageCarouselImage[] = [
	{
		url: pizza,
		description: 'This is pizza!'
	},
	{
		url: wine,
		description: 'Some of our specialty wines'
	},
	{
		url: pasta,
		description: 'Tasty linguine'
	},
	{
		url: parm,
		description: 'Check out our fresh cheese'
	}
]

function rollover(dir: "up" | "down", value: number, limit: number) {
	if (dir === "up")
		return ++value > limit ? 0 : value

	return --value < 0 ? limit : value
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

	const [newSrc, setNewSrc] = useState<null | string>(null)
	const timeoutId = useRef<Array<any>>([])

	const nextButton = useRef<HTMLButtonElement>(null)

	const advance = useCallback(() => {
		if (switching) return

		setSwitching(true)
		setNewSrc(images[rollover("up", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			inc()
			setSwitching(false)
		}, styles.delay))
	}, [switching, inc, images, currentIdx])

	const retract = useCallback(() => {
		if (switching) return

		setSwitching(true)
		setNewSrc(images[rollover("down", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			dec()
			setSwitching(false)
		}, styles.delay))
	}, [switching, dec, images, currentIdx])

	useEffect(() => {
		const intervalId = setInterval(() => {
			nextButton.current?.click()
		}, styles.delay * 20)

		return () => {
			if (timeoutId.current.length !== 0) {
				let id
				while ((id = timeoutId.current.pop()) !== undefined) {
					clearTimeout(id)
				}
			}

			clearInterval(intervalId)
		}
	}, [timeoutId])

  useEffect(() => {
    // Here, we ASYNCHRONOUSLY preload images to avoid flickering in
    // the carousel.
    // IN DEV MODE ONLY: will create duplicate nodes due to React.StrictMode's policy.
    // The duplicates can be safely ignored.
    for (const { url } of images) {
      let imagePreload = document.createElement("link")
      imagePreload.rel = "preload"
      imagePreload.href = url
      imagePreload.as = "image"

      document.head.appendChild(imagePreload)
    }
  }, [])

	return (
		<div className="image-carousel landing-content-spacing">
			<div role="img" className={`image-carousel-img${switching ? " fade-out" : ""}`} style={{ backgroundImage: `url(${images[currentIdx].url})`, }}></div>
			{switching && (
				<div role="img" className={`image-carousel-img${switching ? " fade-in" : ""}`} style={{ backgroundImage: `url(${newSrc})`, position: 'absolute', zIndex: 2, top: 0, left: 0, /*backgroundColor: "red",*/ }}></div>
			)}

			<div className="image-carousel-blurb important-left-items">
				{images[currentIdx].description}
			</div>

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
		</div >
	)
}

const YEARS_OF_OPERATION = new Date().getFullYear() - 1960

/**
 * @param jiggleHeader if true, apply a shake animation to the header.
 * @returns 
 */
function Header(props: { jiggleHeader: boolean }) {
	return (
		<div className={`landing-header landing-content-spacing ${props.jiggleHeader ? 'jiggle-header' : ''}`}>
			<div className='header-logo important-left-items'>
				Compari's
			</div>
			<nav id="header-items">
				<HeaderButton content='Menu' emphasized />
				<HeaderButton content='Our Story' />
				<HeaderButton content='Hours' />
			</nav>
		</div>
	)
}

/**
 * @see {@link HeroTransition} for usage
 */
const TRANSITION_COLORS: [string, string, string] = [
	'#748573',
	'#516351',
	styles.colorMain
]

function HeroTransition() {
	/**
	 * Check out this site! https://getwaves.io/
	 * @returns JSX
	 */
	function Transition() {
		return (
			<div id="transition" className="single-cell">
				<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<path fill={TRANSITION_COLORS[0]} fillOpacity="1" d="M0,128L17.1,112C34.3,96,69,64,103,90.7C137.1,117,171,203,206,240C240,277,274,267,309,224C342.9,181,377,107,411,96C445.7,85,480,139,514,138.7C548.6,139,583,85,617,106.7C651.4,128,686,224,720,245.3C754.3,267,789,213,823,176C857.1,139,891,117,926,122.7C960,128,994,160,1029,165.3C1062.9,171,1097,149,1131,128C1165.7,107,1200,85,1234,106.7C1268.6,128,1303,192,1337,192C1371.4,192,1406,128,1423,96L1440,64L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"></path>
				</svg>
				<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<rect width="100%" height="100%" fill={TRANSITION_COLORS[0]} />
					<path fill={TRANSITION_COLORS[1]} fillOpacity="1" d="M0,192L24,192C48,192,96,192,144,181.3C192,171,240,149,288,128C336,107,384,85,432,101.3C480,117,528,171,576,176C624,181,672,139,720,133.3C768,128,816,160,864,154.7C912,149,960,107,1008,117.3C1056,128,1104,192,1152,181.3C1200,171,1248,85,1296,80C1344,75,1392,149,1416,186.7L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
				</svg>
				<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<rect width="100%" height="100%" fill={TRANSITION_COLORS[1]} />
					<path fill={TRANSITION_COLORS[2]} fillOpacity="1" d="M0,192L24,192C48,192,96,192,144,181.3C192,171,240,149,288,128C336,107,384,85,432,101.3C480,117,528,171,576,176C624,181,672,139,720,133.3C768,128,816,160,864,154.7C912,149,960,107,1008,117.3C1056,128,1104,192,1152,181.3C1200,171,1248,85,1296,80C1344,75,1392,149,1416,186.7L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
				</svg>
				<div style={{ backgroundColor: TRANSITION_COLORS[2] }}></div> {/* this div expands to paint remaining space the color of TRANSITION_COLORS[2] */}
			</div>
		)
	}

	return (
		<section id="theory" className="landing-content-spacing">
			<Typography fontFamily="Montserrat" sx={{ textAlign: 'center' }} fontStyle="italic" mt="2rem" mb=".5rem" fontSize="36pt">
				Chi Mangia Bene, Vive Bene
			</Typography>
			<div style={{ display: 'grid' }}>
				<Transition />
				<div className="single-cell" id="theory-explanation">
					At Compari's, we believe love is best expressed at the dinner table.
					That's why, for {YEARS_OF_OPERATION} years, we've been serving our community
					and sharing the authentic Northern Italian cuisine.
					<br />
					<br />
					Our slogan translates to <i>Those who eat well, live well</i>.
					Whether you stop by for a date, to enjoy comforting food, or
					to dine with family, you'll leave believing our motto.
					<br />
					<br />
					We look forward to serving you!
					<br />
					&mdash; Our Kitchen, Servers, and Staff

					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
						<LocalDiningIcon />
					</div>
				</div>
			</div>
		</section>
	)
}

function HeroSection() {
	const [jiggle, setJiggle] = useState(false)

	return (
		<section id="hero">
			<LocationBar signal={(atTop) => setJiggle(!atTop)} />
			<Header jiggleHeader={jiggle} />
			<ImageCarousel images={IMAGES} />
		</section>
	)
}

export default function Landing() {
	return (
		<main className="landing">
			<HeroSection />
			<HeroTransition />
		</main>
	)
}