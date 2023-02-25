import { useEffect, useState, useRef, useCallback, memo } from 'react'
import Phone from '@mui/icons-material/Phone'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import pizza from './pizza.webp'
import wine from './wine.jpg'
import parm from './parm.jpg'
import pasta from './pasta.jpg'

import './index.sass'
import styles from './index.sass'
import { Avatar } from '@mui/material';

function LocationBar() {
	return (
		<div className="location-bar">
			5490 W Centinela Ave, Westchester, CA 90045 <Button sx={{ padding: 0 }} variant='text' href="tel:310-670-8122"><Phone /> (310) 670-8122</Button>
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
	if (dir === "up") {
		return ++value > limit ? 0 : value
	} else {
		return --value < 0 ? limit : value
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

/**
 * BOTTOM > TOP
 * @fade-out(TOP) & @fade-in(BOTTOM)
 * TOP = BOTTOM
 * BOTTOM = next()
 */
function ImageCarousel({ images, startIdx = 0 }: ImageCarouselProps) {
	const [currentIdx, inc, dec] = useRollover(images.length - 1, startIdx)

	const [switching, setSwitching] = useState(false)

	const [newSrc, setNewSrc] = useState<null | string>(null) // = useRef<null | string>(null)
	const timeoutId = useRef<Array<any>>([])

	const nextButton = useRef<HTMLButtonElement>(null)
	const autoAdvance = useRef(true)

	const advance = useCallback(() => {
		if (switching) return
		// if (flag) autoAdvance.current = false

		setSwitching(true)
		setNewSrc(images[rollover("up", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			inc()
			setSwitching(false)
		}, styles.delay))
	}, [switching, inc, images, currentIdx])

	const retract = useCallback(() => {
		if (switching) return
		// if (flag) autoAdvance.current = false

		setSwitching(true)
		setNewSrc(images[rollover("down", currentIdx, images.length - 1)].url)

		timeoutId.current.push(setTimeout(() => {
			dec()
			setSwitching(false)
		}, styles.delay))
	}, [switching, dec, images, currentIdx])

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (autoAdvance.current) {
				nextButton.current?.click()
			} else {
				// debugger
				clearInterval(intervalId)
			}
			// if (!autoAdvance.current) {
			// 	clearInterval(intervalId)
			// 	return
			// }

			// advance(false)
		}, styles.delay * 20)

		return () => {
			if (timeoutId.current.length !== 0) {
				let id
				while ((id = timeoutId.current.pop()) !== undefined)
					clearTimeout(id)
			}

			if (autoAdvance.current)
				clearInterval(intervalId)
		}
	}, [])

	return (
		<div className="image-carousel landing-content-spacing">
			<div role="img" className={switching ? "fade-out" : ""} style={{ backgroundImage: `url(${images[currentIdx].url})`, height: '100%', backgroundPosition: 'center top', backgroundSize: '100% auto' }}></div>
			{switching && (
				<div role="img" className={switching ? "fade-in" : ""} style={{ backgroundImage: `url(${newSrc})`, position: 'absolute', zIndex: 2, top: 0, width: '100%', left: 0, /*backgroundColor: "red",*/ height: '100%', backgroundPosition: 'center top', backgroundSize: '100% auto' }}></div>
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
					<ArrowForwardIosIcon />
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
					<ArrowBackIosIcon />
				</IconButton>
			</Avatar>

			<ImageCarouselDots len={images.length} idx={currentIdx} />
		</div >
	)
}

function Header() {
	return (
		<div className='landing-header landing-content-spacing'>
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

export default function Landing() {
	return (
		<main className="landing">
			<section id="top">
				<LocationBar />
				<Header />

				<ImageCarousel images={IMAGES} />
			</section>
			<section>
			</section>
		</main>
	)
}