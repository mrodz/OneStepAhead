import { useEffect, useState, useRef, useCallback, memo, FC, CSSProperties } from 'react'

import Phone from '@mui/icons-material/Phone'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import WatchIcon from '@mui/icons-material/Watch'
import MenuIcon from '@mui/icons-material/Menu'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import SpeedDial from '@mui/material/SpeedDial'
import CloseIcon from '@mui/icons-material/Close';
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import useMediaQuery from '@mui/material/useMediaQuery'

import ParallaxImageSplit, { ParallaxImageTextSection } from './ParallaxImageSplit'

import classroom from './images/classroom.jpg'
import tutor from './images/tutor.jpg'
import elmarino from './images/elmarino.jpg'
import chocolate from './images/chocolate.jpg'
import mobile from './images/kidsreading.jpg'
import twirlDivider from './images/twirl.svg'
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
import { Divider, SwipeableDrawer } from '@mui/material'
import { useMobile } from '../../hooks/useSizes'
import FounderBlurb from './FounderBlurb'

interface LocationBarProps {
	signal?: (arg: boolean) => void
}

interface PhoneLinkProps {
	number: string,
	text?: string,
	color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

const PhoneLink: FC<PhoneLinkProps> = ({ number, text, color = 'inherit' }) => {
	return (
		<Button sx={{ whiteSpace: 'nowrap', fontSize: 'inherit' }} color={color} variant='text' href={`tel:${number}`}>
			<Phone /> {text ?? number}
		</Button>
	)
}

/**
 * @param signal a callback function, will fire when this comes into view.
 * @returns JSX
 */
function LocationBar({ signal }: LocationBarProps) {
	const header = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			signal?.(entry.isIntersecting)
		}, { root: null, rootMargin: '0px', threshold: 1.0 })

		const copy = header.current // required per the rules of useEffect with DOM elements.

		if (copy) observer.observe(copy)

		return () => {
			if (copy) observer.unobserve(copy)
		}
	}, [header, signal])

	return (
		<div className="LocationBar__location-bar" ref={header}>
			<span>
				Certified Nonprofit, Student-led, Community Backed
			</span>
			{/* <PhoneLink number='310-670-8122' text='(310) 670-8122' color="primary" /> */}
		</div >
	)
}

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
	description: string
}

interface ImageCarouselProps {
	images: ImageCarouselImage[],
	startIdx?: number
}

const IMAGES: ImageCarouselImage[] = [
	{
		url: classroom,
		description: 'Look at these kids hard at work'
	},
	{
		url: tutor,
		description: 'Tutoring Description Goes Here'
	},
	{
		url: elmarino,
		description: 'El Marino Language School'
	},
	{
		url: chocolate,
		description: 'Size of an iPhone 13 landscape photo'
	}
]

function rollover(dir: "up" | "down", value: number, limit: number) {
	if (dir === "up")
		return ++value > limit ? 0 : value

	return --value < 0 ? limit : value
}

type ParallaxImageItem = {
	title: string,
	url: string,
	content: string
}

interface ParallaxImagesSectionProps {
	items: ParallaxImageItem[]
}

interface ItalySVGProps {
	width?: string | number,
	height?: string | number,
	style?: CSSProperties
}

function ParallaxImagesSection({ items }: ParallaxImagesSectionProps) {
	const result = items.map(({ url, title, content }, i) => {
		const image = <ParallaxImageSplit fileName={url} alt={title} leading={i % 2 === 0 ? 'L' : 'R'} />

		return (
			<ParallaxImageTextSection key={i} title={title} content={content} image={image} />
		)
	})

	return (
		<section id="parallax-images" className="landing-content-spacing">
			<div className="single-cell" style={{ zIndex: 2, display: 'grid', gridTemplateRows: `repeat(${result.length}, 1fr)` }}>
				{result}
			</div>

			<div className="single-cell ParallaxImagesSection__bg">
			</div>
		</section>
	)
}

function DataSplashSection() {
	return (
		<section>

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

	return (
		<div className="ImageCarousel__image-carousel landing-content-spacing">
			<div role="img" className={`div-as-img ${switching ? "ImageCarousel__fade-out" : ""}`} style={{ backgroundImage: `url(${images[currentIdx].url})`, }}></div>
			{switching && (
				<div role="img" className={`div-as-img ${switching ? "ImageCarousel__fade-in" : ""}`} style={{ backgroundImage: `url(${newSrc})`, position: 'absolute', zIndex: 2, top: 0, left: 0 }}></div>
			)}

			<div className="ImageCarousel__image-carousel-blurb important-left-items">
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

const FOUNDED = 1960
const YEARS_OF_OPERATION = new Date().getFullYear() - FOUNDED

interface DialAction {
	icon: JSX.Element,
	name: string,
	cb: () => void
}

class DialAction implements DialAction {
	constructor(icon: JSX.Element, name: string) {
		this.icon = icon
		this.name = name
		this.cb = undefined!
	}

	onClick(cb: () => void): this {
		this.cb = cb
		return this
	}

	run() {
		this.cb?.()
	}
}

const actions: readonly DialAction[] = [
	new DialAction(<MenuBookIcon />, 'View Our Menu'),
	new DialAction(<PersonPinIcon />, 'Learn About Us'),
	new DialAction(<WatchIcon />, 'Check Our Hours'),
	new DialAction(<KeyboardArrowUpIcon />, 'Back to Top')
		.onClick(() => window.scrollTo({ top: 0, left: 0 }))
]

function HeaderNav() {
	const useHamburger = useMediaQuery('(max-width: 700px)')

	const nav_items = <nav id="header-items">

		<button className="HeaderButton">
			<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="M255.55 22.36c-30.93 0-56 25.07-56 56c0 30.927 25.07 56 56 56c30.927 0 56-25.073 56-56c0-30.93-25.073-56-56-56zM105.067 144.47c-3.047.028-6.012.55-8.748 1.536c-7.296 2.627-12.95 7.77-17.562 13.617c-3.63 4.602-6.523 9.754-9.012 14.992c-6.79-6.374-14.215-15.785-21.8-30.117l-15.91 8.418c10.115 19.112 20.597 31.962 31.292 40.066c-.405 1.802-.907 3.66-1.164 5.364c-2.005 13.302 2.913 24.966 9.637 34.736c5.34 7.757 11.825 14.87 18.132 22.367c-7.497 15.76-11.35 32.49-11.368 49.366c.07 28.777 11.283 56.823 32.082 80.243l3.655-13.117l17.34 4.832l-25.13 90.18c20.857 6.423 41.04 6.52 61.62-1.072l18.727-66.73l17.33 4.865l-8.892 31.69c17.887 4.99 36.674 7.578 55.607 7.657a212.674 212.674 0 0 0 36.81-3.396l-8.942-39.63l17.558-3.963l14.996 66.473c24.936 11.267 48.496 10.575 72.764 1.222l-25.115-78.986l17.152-5.455l4.97 15.636c21.796-38.09 68.757-29.083 91.825-40.08c11.686-3.894 5.42-69.874 4.916-73.04c-.38-2.39-29.734-3.818-40.16-2.248c-5.975.9-16.344-12.078-27.39-27.597c-5.387-10.488-12.357-20.405-20.753-29.527c-3.988-5.276-2.735-3.092-6.533-6.474c.715 6.697 2.12 12.306 4.152 16.23l-15.986 8.277c-7.378-14.252-7.98-32.853-5.662-52.858c1.583-13.67 4.81-27.957 9.03-41.733c-11.81 6.755-22.626 17.48-32.02 30.586c-13.665 19.064-24.126 42.55-30.647 62.644l-17.12-5.556c2.777-8.56 6.2-17.655 10.255-26.835c-14.467-6.574-35.467-9.76-57.426-8.826c-23.852 1.01-48.83 6.716-68.043 16.2l-7.97-16.143c22.13-10.923 49.122-16.934 75.25-18.043c3.267-.138 6.52-.203 9.747-.19c20.69.086 40.372 3.378 56.274 10.78a227.067 227.067 0 0 1 7.125-12.537c-21.74-7.8-45.253-11.897-69.058-12.03c-63.206.056-121.303 27.923-151.383 72.614c-4.954-5.81-9.525-11.11-12.89-16c-5.26-7.64-7.608-13.682-6.695-21.126c10.458 3.152 20.632 2.07 28.694-1.87c10.316-5.044 17.423-13.85 20.473-23.39c1.526-4.77 2.056-9.862.813-14.928c-1.243-5.065-4.63-10.034-9.598-12.953c-4.862-2.856-10.17-4.187-15.25-4.142zm.328 17.805a6.87 6.87 0 0 1 1 .03c1.362.138 2.86.687 4.803 1.828c.864.508.986.713 1.234 1.722c.247 1.01.248 2.895-.475 5.157c-1.447 4.523-5.713 10-11.235 12.7c-4.346 2.125-9.372 2.917-15.66.847c2.174-5.033 4.823-9.984 7.824-13.787c3.257-4.13 6.74-6.828 9.528-7.832c1.045-.375 1.995-.623 2.978-.665zm278.153 98.647c8.835 0 16 7.163 16 16c0 8.836-7.165 16-16 16c-8.838 0-16-7.164-16-16c0-8.837 7.162-16 16-16z"></path></svg>
			Donate
		</button>
		<button className="HeaderButton">
			<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11a5 5 0 0 1 5 5v6h-2v-6a3 3 0 0 0-2.824-2.995L12 13a3 3 0 0 0-2.995 2.824L9 16v6H7v-6a5 5 0 0 1 5-5Zm-6.5 3c.279 0 .55.033.81.094a5.948 5.948 0 0 0-.301 1.575L6 16v.086a1.493 1.493 0 0 0-.356-.08L5.5 16a1.5 1.5 0 0 0-1.493 1.355L4 17.5V22H2v-4.5A3.5 3.5 0 0 1 5.5 14Zm13 0a3.5 3.5 0 0 1 3.5 3.5V22h-2v-4.5a1.5 1.5 0 0 0-1.355-1.493L18.5 16c-.175 0-.343.03-.5.085V16c0-.666-.108-1.306-.308-1.904c.258-.063.53-.096.808-.096Zm-13-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm-13 2a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm13 0a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM12 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"></path></svg>
			Get Involved
		</button>
		<button className="HeaderButton">
			<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 17.05q1.1-.525 2.212-.788T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2v9.85ZM12 20q-1.2-.95-2.6-1.475T6.5 18q-1.325 0-2.775.5T1 20.05V5.55Q2.1 4.8 3.588 4.4T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.425 0 2.913.4T23 5.55v14.5Q21.75 19 20.287 18.5T17.5 18q-1.5 0-2.9.525T12 20Zm2-10.1V8.2q.825-.35 1.688-.525T17.5 7.5q.65 0 1.275.1T20 7.85v1.6q-.6-.225-1.213-.338T17.5 9q-.95 0-1.825.238T14 9.9Zm0 5.5v-1.7q.825-.35 1.688-.525T17.5 13q.65 0 1.275.1t1.225.25v1.6q-.6-.225-1.213-.338T17.5 14.5q-.95 0-1.825.225T14 15.4Zm0-2.75v-1.7q.825-.35 1.688-.525t1.812-.175q.65 0 1.275.1T20 10.6v1.6q-.6-.225-1.213-.338T17.5 11.75q-.95 0-1.825.238T14 12.65Z"></path></svg>
			About
		</button>
	</nav>

	if (useHamburger) {
		const Drawer = () => {
			const [open, setOpen] = useState(false)
			const isMobile = useMobile()
			const iOS =
				typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

			return (
				<>
					<SwipeableDrawer
						anchor='right'
						open={open}
						onClose={() => setOpen(false)}
						onOpen={() => setOpen(true)}
						disableBackdropTransition={!iOS}
						disableDiscovery={iOS}
						PaperProps={{
							sx: {
								width: 'min(400px, 100%)'
							}
						}}
					>

						<IconButton onClick={() => setOpen(false)} sx={{ alignSelf: 'end', mt: '12px', mr: '12px' }}>
							<CloseIcon />
						</IconButton>

						<div className="drawer-text">
							<img src="/mainlogo.png" className="logo-png" />
						</div>

						<Divider sx={{ mt: '20px' }} />

						{nav_items}

						<Divider sx={{ mb: '20px' }} />

						<div className="drawer-text" style={{ fontSize: '12pt', margin: '3rem 0' }}>
							Today is the day to try Ladera's little slice of Italy!
						</div>
					</SwipeableDrawer >
					<IconButton sx={{ color: isMobile ? 'white' : 'unset', marginLeft: 'auto', mr: '12px' }} onClick={() => setOpen(state => !state)}>
						<MenuIcon />
					</IconButton>
				</>
			)
		}

		return (
			<Drawer />
		)
	}

	return nav_items
}

/**
 * @param jiggleHeader if true, apply a shake animation to the header.
 * @returns 
 */
function Header(props: { jiggleHeader: boolean }) {
	const header = useRef<HTMLDivElement>(null)
	const [extended, setExtended] = useState(true)
	const [open, setOpen] = useState(false)
	const isMobile = useMobile()

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setExtended(entry.isIntersecting)
		}, { root: null, rootMargin: '0px', threshold: 1.0 })

		const copy = header.current // required per the rules of useEffect with DOM elements.

		if (copy) observer.observe(copy)

		return () => {
			if (copy) observer.unobserve(copy)
		}
	}, [header])

	return (
		<>
			<header ref={header} className={`Header__landing-header landing-content-spacing ${!extended && !isMobile ? 'Header__hide-header' : ''}`}>
				<div className='Header__header-logo Header__title important-left-items'>
					<img src="/mainlogo.png" className="logo-png" />
				</div>
				<div className="Header__nav-floater">
					<HeaderNav />
				</div>
			</header>

			{!isMobile && <SpeedDial
				className="Header__dial"
				hidden={extended}
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				ariaLabel="Navigable Menu"
				icon={
					<SpeedDialIcon className="Header__dial-icon" />
				}
			>
				{actions.map((action) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={() => {
							action.run()
							setOpen(false)
						}}
					/>
				))}
			</SpeedDial>}
		</>
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
				Mentoring For a Change
			</div>
			<div style={{ display: 'grid', height: '100%' }}>
				<Transition />
				<div className="single-cell" id="theory-explanation">
					<p>
						The harsh reality of being a student is that one's ability to perform in the classroom
						is heavily tied to factors outside the control of children. In our school zone,
						Culver City Unified School District, resource coordinators at all five elementary schools
						have reported reading comprehension and math scores far below state standards among kids
						from disadvantaged households.
					</p>
					<p>
						This socioeconomic gap affects Culver City's future generation of workers and leaders
						from as early as the first grade. We actively make a difference in our community by
						fostering 1-on-1 mentoring relationships between qualified high school students and
						children at risk of falling behind.
					</p>
					<p>
						We are more than just tutors; our mentors get to know their buddies and start building
						a relationship from the very first session. Our mentors check in with their students at
						least once a week. This consistency helps guide their buddies through whatever turbulence
						they may face across all aspects of life.
					</p>
					<p>
						Learn more about <a className="a color-primary" href="/buddies">who we mentor</a> and <a className="a color-primary" href="/program">how to see if a child you know qualifies</a> for One Step
						Ahead by clicking on the respective links.
					</p>
					<p>
						Do you have what it takes to be a mentor? Find out by <a className="a color-primary" href="/mentors">checking our student profile</a> and
						talking to a team member today!
					</p>

					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V4q0-.825.588-1.413T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.588 1.413T18 22H6Zm5-11l2.5-1.5L16 11V4h-5v7Z"></path></svg>
					</div>
				</div>
			</div>
		</section>
	)
}

const TwirlDivider = memo(() => (
	<img alt="" src={twirlDivider} className='TwirlDivider'></img>
))

function MobileHero() {
	return (
		<div className="MobileHero__main">
			<div className='MobileHero__focus-image'>
				<div role="img" className='div-as-img' style={{ backgroundImage: `url(${mobile})` }}></div>
			</div>
			<div className='MobileHero__focus-text'>
				<h1 id="mobile-greeting">
					<span>
						Remote Peer Tutoring
					</span>
					<TwirlDivider />
					<span>
						Accessible to CCUSD's Youth
					</span>
				</h1>

				<nav id="mobile-hero-nav">
					<Button color="secondary" variant="contained">About</Button>
					<Button color="secondary" variant="contained">Donate</Button>
					<Button color="secondary" variant="contained">Join Us</Button>
				</nav>
			</div>
		</div>
	)
}

function HeroSection() {
	const [jiggle, setJiggle] = useState(false)

	const cb = useCallback((atTop: boolean) => {
		setJiggle(!atTop)
	}, [])

	const isMobile = useMobile();

	const focus = isMobile ? <MobileHero /> : <ImageCarousel images={IMAGES} />

	return (
		<section id="hero">
			<LocationBar signal={cb} />
			<Header jiggleHeader={jiggle} />
			{focus}
		</section>
	)
}

function SupportSection() {
	return (
		<section id="supporters" className="landing-content-spacing">
			<div className="Header__title">
				Thank You To Our Friends
			</div>

			<div className="SupportSection__images">

				<img width="300px" src={ccef} />
				<img style={{ maxWidth: "100px" }} src={ccusd} />
				<img width="300px" src={elmarinologo} />
				<img width="300px" src={elrinconlogo} />
				<img width="300px" src={laballonalogo} />
				<img width="300px" src={linhowelogo} />
				<img width="300px" src={farragutlogo} />
			</div>
		</section>
	)
}

function FooterSection() {
	return (
		<footer className="Landing__footer">
			<div id="footer-location">
				<div id="footer-location-title">One Step Ahead</div>
				<table id="footer-location-about-desktop" cellSpacing="0">
					<tbody>
						<tr>
							<th>Find us at:</th>
							<th>Call us at:</th>
						</tr>
						<tr>
							<td>5490 W Centinela Ave, Westchester, CA 90045</td>
							<td><PhoneLink number='310-670-8122' text='(310) 670-8122' /></td>
						</tr>
					</tbody>
				</table>
				<div id="footer-location-about-mobile">
					<div>
						5490 W Centinela Ave, Westchester, CA 90045
					</div>
					<PhoneLink number='310-670-8122' text='(310) 670-8122' />
				</div>

				<div id="footer-location-quote">
					&quot;&#9733;&#9733;&#9733;&#9733;&#9733;&quot; since {FOUNDED}
				</div>
			</div>
			<div id="footer-credits">
				<span id="copyright">
					{new Date().getFullYear()} Mateo Rodriguez Web Development, All Rights Reserved.
					For business inquiries and affordable tech solutions, contact us at <span style={{ whiteSpace: 'nowrap', fontSize: 'inherit' }}>+1 (310) 773-8797</span>.
					Los Angeles, CA
				</span>
			</div>

		</footer >
	)
}

const PARALLAX_IMAGES: ParallaxImageItem[] = [
	{
		content: "Hi",
		title: 'Repeat image of kids',
		url: classroom
	},
	{
		content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
		title: 'Title #2',
		url: tutor
	}
]

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
		<main className="landing">
			<HeroSection />
			<HeroTransition />


			<ParallaxImagesSection items={PARALLAX_IMAGES} />

			<FounderBlurb left colors={[GlobalStyles.COLOR_MAIN, GlobalStyles.COLOR_SPLASH]} url={zoom} title="Lorem Ipsum" className="landing-content-spacing landing-content-v-spacing">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus fuga tenetur, esse veniam placeat asperiores deserunt voluptatibus tempora? Iure voluptatem magni cumque dolores ducimus voluptatibus explicabo tenetur tempora autem aut illum animi, hic ipsum eos veritatis nisi in facere architecto saepe obcaecati? Eligendi dolor aperiam velit nihil, impedit eum animi vitae quasi omnis, cupiditate aliquam sunt nostrum architecto porro ipsam magni adipisci natus fuga blanditiis! Dolor molestias, ab iusto aliquam, excepturi rerum veniam a similique beatae reprehenderit quisquam, dicta dolorum sunt quam? Obcaecati dicta, ab eius, quidem necessitatibus quia ducimus earum minima ratione ullam accusantium magni repudiandae sapiente quasi quaerat nam molestias! Unde quisquam fugiat dolorem vitae, quasi omnis officiis distinctio accusantium blanditiis aperiam eos dicta autem, veniam quae. Nam iste pariatur asperiores laboriosam reiciendis aut, vel accusamus nemo animi neque rerum, iusto officia, ab unde? Voluptas libero repellat voluptatibus quisquam. Praesentium dolor quo molestiae, beatae hic iure quam blanditiis, suscipit voluptatem itaque earum assumenda quidem optio sapiente, deleniti soluta! Eligendi, quae, deserunt nobis omnis soluta harum eveniet odit, minus iure adipisci obcaecati aut veniam commodi magnam eos corrupti illum nihil dolore id. Enim quasi repellendus, saepe repudiandae maxime, odio id eius quia reiciendis vero eveniet voluptatibus, recusandae impedit est?
			</FounderBlurb>

			<SupportSection />

			<DataSplashSection />

			<div ref={greeting} id="visit-us" className={`Header__title ${visible ? 'Landing__fade-in' : ''}`}>
				Mentoring for a Brighter Future
			</div>
			<FooterSection />
		</main>
	)
}