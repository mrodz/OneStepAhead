import { useEffect, useState, useRef, useCallback, memo, FC, StyleHTMLAttributes, CSSProperties } from 'react'

import Phone from '@mui/icons-material/Phone'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import LocalDiningIcon from '@mui/icons-material/LocalDining'
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
import pasta from './images/pasta.webp'
import chocolate from './images/chocolate.jpg'
import mobile from './images/mobile.jpg'
import twirlDivider from './images/twirl.svg'
import owner from './images/owner.webp'

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
				5490 W Centinela Ave, Westchester, CA 90045
			</span>
			<PhoneLink number='310-670-8122' text='(310) 670-8122' color="primary" />
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

const ItalySVG: FC<ItalySVGProps> = ({ width, height, style }) => {

	return (
		<svg style={{ width, height, ...(style ?? {}) }} version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 543.000000 642.000000" preserveAspectRatio="xMidYMid meet">
			{RawItalyGraphics}
		</svg>
	)
}

const RawItalyGraphics = (
	<g transform="translate(0.000000,642.000000) scale(0.100000,-0.100000)" fill="#b6b2b2" stroke="none">
		<path d="M2480 6404 c-25 -7 -65 -14 -90 -14 -25 -1 -63 -5 -85 -10 -22 -4 -76 -16 -120 -25 -44 -10 -92 -24 -107 -31 -25 -13 -26 -16 -17 -50 9 -29 7 -39 -7 -55 -20 -23 -79 -26 -87 -5 -17 43 -123 73 -189 54 l-38 -11 0 -65 c0 -46 5 -71 16 -83 9 -10 14 -26 10 -34 -8 -21 -58 -12 -98 16 -38 26 -47 24 -64 -16 -13 -33 -13 -39 7 -83 25 -55 26 -109 4 -131 -15 -15 -19 -13 -44 15 -16 17 -30 37 -32 43 -3 9 -20 8 -64 -4 -108 -28 -131 -19 -153 61 -14 48 -29 57 -63 40 -18 -8 -23 -19 -21 -37 2 -15 -14 -62 -38 -109 -26 -56 -40 -98 -40 -124 0 -49 -15 -105 -34 -131 -14 -19 -16 -19 -45 15 -17 21 -32 52 -36 78 -5 37 -9 42 -33 42 -38 1 -63 17 -110 73 -26 29 -43 61 -47 85 -15 91 -15 90 -38 84 -12 -3 -47 -31 -78 -61 -50 -50 -57 -62 -63 -107 -7 -54 -32 -86 -111 -138 -34 -24 -46 -26 -90 -21 -35 5 -69 1 -108 -10 -46 -13 -63 -14 -90 -4 -30 10 -39 8 -104 -25 -40 -19 -74 -44 -77 -54 -9 -26 2 -50 24 -57 11 -4 25 -26 36 -57 9 -29 34 -70 57 -95 35 -39 39 -47 34 -81 -7 -44 -85 -122 -122 -122 -46 0 -125 -45 -125 -71 0 -4 22 -34 49 -67 35 -42 62 -63 95 -76 66 -25 71 -53 17 -111 -46 -51 -44 -45 -31 -81 9 -22 6 -40 -16 -96 -14 -38 -25 -71 -23 -72 20 -17 102 -48 179 -66 l96 -23 48 22 c46 20 50 20 68 5 10 -10 18 -27 18 -39 0 -24 -36 -83 -77 -126 -24 -26 -24 -28 -9 -58 21 -40 41 -40 150 0 93 34 133 68 166 143 9 23 36 58 59 79 23 21 53 56 66 77 42 67 136 76 252 24 35 -15 64 -21 82 -18 31 7 44 -1 163 -94 55 -42 72 -51 93 -46 100 25 155 -51 220 -305 9 -36 27 -86 41 -113 18 -35 27 -77 35 -156 11 -105 21 -142 39 -142 5 0 21 5 36 10 36 14 49 1 68 -65 14 -47 20 -55 56 -69 26 -10 42 -24 46 -40 3 -15 23 -33 55 -50 27 -15 49 -31 49 -35 0 -5 -12 -20 -26 -34 -18 -18 -24 -32 -19 -46 8 -26 20 -26 52 -1 17 13 33 18 47 14 36 -12 167 -126 186 -164 22 -42 53 -72 100 -95 48 -24 69 -44 90 -85 10 -19 37 -55 60 -80 23 -25 60 -69 82 -98 40 -54 71 -73 145 -92 31 -8 52 -23 84 -61 40 -48 41 -51 23 -64 -11 -8 -26 -17 -34 -20 -17 -5 -75 -114 -66 -123 3 -3 20 7 38 22 18 15 60 47 93 72 58 45 62 46 110 39 28 -4 68 -7 89 -7 89 0 163 -87 153 -182 -9 -99 20 -120 117 -86 93 32 120 10 92 -75 -22 -63 -21 -66 20 -49 19 8 64 18 100 21 54 5 67 3 86 -13 42 -38 74 -143 48 -159 -19 -12 -9 -24 49 -59 32 -20 65 -43 72 -52 8 -10 38 -35 67 -56 49 -37 54 -38 74 -23 44 30 52 21 118 -122 34 -76 85 -170 112 -209 49 -70 50 -72 43 -127 -7 -51 -4 -60 30 -121 21 -38 34 -73 31 -83 -11 -36 -54 -70 -94 -77 -22 -3 -48 -13 -57 -22 -14 -15 -14 -19 4 -50 20 -33 20 -35 3 -91 l-17 -57 -60 -13 c-33 -7 -80 -21 -105 -32 -25 -10 -84 -24 -133 -30 -57 -8 -109 -22 -150 -41 -80 -38 -135 -50 -189 -40 -87 17 -181 15 -217 -4 -42 -22 -64 -17 -166 41 -170 97 -179 98 -244 24 -25 -28 -49 -51 -52 -51 -3 0 -14 18 -24 41 -17 37 -21 40 -48 35 -60 -12 -93 -43 -136 -127 -46 -91 -50 -122 -21 -179 23 -46 73 -81 145 -106 28 -9 61 -24 75 -34 14 -9 118 -63 232 -119 157 -76 217 -101 247 -101 53 0 151 -73 203 -151 l37 -57 68 -7 c37 -4 80 -13 95 -21 57 -30 148 -5 148 40 0 9 11 39 25 66 40 79 32 126 -39 231 -40 60 -42 75 -22 140 8 24 17 65 21 91 5 35 18 63 53 109 26 33 57 75 70 92 21 28 56 56 73 57 3 0 11 -19 18 -42 22 -72 46 -95 108 -102 68 -8 82 2 126 92 17 35 40 71 52 80 62 51 145 208 145 276 0 81 38 114 172 147 45 12 91 28 100 37 15 15 15 22 2 72 -7 30 -14 93 -15 140 0 47 -3 92 -5 101 -3 9 -28 27 -57 39 -29 12 -65 28 -82 35 -16 8 -47 21 -67 29 -36 14 -78 65 -78 94 0 7 11 29 24 50 13 20 31 60 40 87 9 28 45 89 80 136 55 74 69 87 104 96 35 9 43 8 71 -14 17 -13 59 -36 93 -50 53 -21 71 -24 125 -18 l62 6 35 -53 c20 -30 42 -80 50 -116 8 -35 23 -73 33 -84 16 -19 93 -58 112 -58 15 0 81 110 93 154 14 52 1 102 -55 216 -30 62 -36 67 -112 109 -44 24 -104 53 -132 65 -33 14 -97 60 -166 120 -103 89 -123 101 -237 150 -69 29 -156 63 -195 75 -67 22 -254 110 -281 132 -24 20 -16 39 44 102 89 95 104 120 96 163 l-7 36 -56 -7 c-31 -4 -77 -15 -103 -25 -39 -15 -60 -16 -120 -10 -114 13 -220 40 -260 66 -20 13 -49 26 -65 30 -15 3 -46 26 -68 51 -23 26 -67 58 -105 76 -60 30 -66 36 -86 87 -16 41 -29 59 -54 72 -47 24 -80 58 -80 84 0 12 -23 67 -51 122 -36 71 -53 118 -59 163 -8 61 -44 180 -70 230 -7 13 -26 38 -42 56 -26 26 -34 30 -58 23 -24 -7 -31 -4 -44 16 -9 13 -96 77 -194 143 -97 66 -187 128 -199 138 -18 14 -30 50 -57 163 -52 216 -59 256 -51 270 4 7 24 10 48 8 39 -3 42 -1 64 37 33 59 30 82 -21 135 -41 42 -76 117 -76 162 0 10 12 37 27 59 31 47 71 71 93 57 12 -8 41 3 115 43 55 28 111 62 123 73 21 18 36 21 116 21 67 0 98 4 111 15 15 13 19 12 35 -8 71 -87 68 -85 95 -68 25 17 41 56 32 79 -3 7 -32 31 -66 53 -57 36 -61 41 -58 73 2 30 -2 36 -23 41 -30 8 -28 19 11 84 36 58 32 76 -16 76 -46 0 -75 15 -75 40 0 11 30 45 70 81 76 68 87 95 43 105 -16 3 -58 14 -95 25 -41 12 -97 19 -148 19 -59 0 -101 7 -153 24 -40 13 -93 27 -120 30 -33 5 -51 13 -60 29 -32 57 -74 107 -99 118 -33 14 -34 17 -9 43 11 12 23 33 26 49 8 31 2 33 -65 11z" />
		<path d="M1484 2657 c-33 -24 -89 -73 -127 -110 -93 -91 -167 -111 -233 -61 -38 29 -41 44 -18 79 10 16 14 34 10 51 -13 49 -32 7 -46 -98 -7 -57 -19 -115 -27 -130 -21 -42 -16 -56 35 -111 72 -79 98 -125 106 -191 7 -56 7 -59 -24 -91 -25 -26 -31 -39 -28 -66 3 -30 6 -33 38 -34 27 0 37 -6 50 -27 12 -23 13 -31 2 -45 -42 -59 -52 -82 -51 -113 0 -19 -4 -53 -10 -75 -6 -22 -11 -64 -11 -93 0 -29 -4 -62 -10 -72 -5 -10 -11 -44 -12 -75 -4 -70 10 -80 52 -35 l29 31 28 -40 c26 -38 31 -40 78 -41 53 0 155 40 155 60 0 6 -5 20 -10 31 -9 16 -6 25 19 49 38 38 101 42 125 9 14 -21 16 -21 41 -5 31 21 50 62 60 131 4 28 13 60 21 72 8 13 21 55 29 94 15 68 14 75 -5 131 -11 32 -20 69 -20 83 0 14 -8 42 -19 63 -18 35 -18 39 -2 78 9 23 31 54 49 69 28 23 32 33 32 74 0 26 -4 51 -9 57 -6 5 -14 27 -20 49 -16 68 -35 109 -58 128 -16 13 -22 28 -21 55 1 51 -22 109 -49 121 -14 7 -20 16 -17 26 5 12 -2 15 -34 15 -31 0 -52 -9 -98 -43z" />
	</g>
)

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
				<ItalySVG width="10%" height="10%" />
			</div>
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

						<ItalySVG width="50px" height="50px" style={{ alignSelf: 'center' }} />

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

				{/* <div style={{ flex: '1 1 0', backgroundColor: 'hotpink', border: 'solid yellow 3px' }}>
					{/* Hello */}
				{/* </div> * /} */}
				{
					//<div style={{ backgroundColor: "red" /*TRANSITION_COLORS[2]*/ }}></div> this div expands to paint remaining space the color of TRANSITION_COLORS[2]
				}
			</div >
		)
	}

	return (
		<section id="theory" className="landing-content-spacing">
			<div id="theory-title">
				Remote peer tutoring,<br/>to minimize CCUSD's<br/>socioeconomic achievement gap
			</div>
			<div style={{ display: 'grid', height: '100%' }}>
				<Transition />
				<div className="single-cell" id="theory-explanation">
					What is Lorem Ipsum?
					
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

					Why do we use it?
					It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


					Where does it come from?
					Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

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
						Eat, Drink and Gather with Us!
					</span>
					<TwirlDivider />
					<span>
						Brunch, Lunch and Dinner
					</span>
				</h1>

				<nav id="mobile-hero-nav">
					<Button color="secondary" variant="contained">Menu</Button>
					<Button color="secondary" variant="contained">Hours</Button>
					<Button color="secondary" variant="contained">Call Us</Button>
				</nav>

				<div id="mobile-years-active">
					Serving our community since {FOUNDED}
				</div>
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

			<FounderBlurb left colors={[GlobalStyles.COLOR_MAIN, GlobalStyles.COLOR_SPLASH]} url={owner} title="Lorem Ipsum" className="landing-content-spacing landing-content-v-spacing">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus fuga tenetur, esse veniam placeat asperiores deserunt voluptatibus tempora? Iure voluptatem magni cumque dolores ducimus voluptatibus explicabo tenetur tempora autem aut illum animi, hic ipsum eos veritatis nisi in facere architecto saepe obcaecati? Eligendi dolor aperiam velit nihil, impedit eum animi vitae quasi omnis, cupiditate aliquam sunt nostrum architecto porro ipsam magni adipisci natus fuga blanditiis! Dolor molestias, ab iusto aliquam, excepturi rerum veniam a similique beatae reprehenderit quisquam, dicta dolorum sunt quam? Obcaecati dicta, ab eius, quidem necessitatibus quia ducimus earum minima ratione ullam accusantium magni repudiandae sapiente quasi quaerat nam molestias! Unde quisquam fugiat dolorem vitae, quasi omnis officiis distinctio accusantium blanditiis aperiam eos dicta autem, veniam quae. Nam iste pariatur asperiores laboriosam reiciendis aut, vel accusamus nemo animi neque rerum, iusto officia, ab unde? Voluptas libero repellat voluptatibus quisquam. Praesentium dolor quo molestiae, beatae hic iure quam blanditiis, suscipit voluptatem itaque earum assumenda quidem optio sapiente, deleniti soluta! Eligendi, quae, deserunt nobis omnis soluta harum eveniet odit, minus iure adipisci obcaecati aut veniam commodi magnam eos corrupti illum nihil dolore id. Enim quasi repellendus, saepe repudiandae maxime, odio id eius quia reiciendis vero eveniet voluptatibus, recusandae impedit est?
			</FounderBlurb>

			<div ref={greeting} id="visit-us" className={`Header__title ${visible ? 'Landing__fade-in' : ''}`}>
				Visit Us Today!
			</div>
			<FooterSection />
		</main>
	)
}