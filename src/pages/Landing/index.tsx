import { useEffect, useState } from 'react'
import Phone from '@mui/icons-material/Phone'
import Button from '@mui/material/Button'

import pizza from './pizza.webp'
import wine from './wine.jpg'
import parm from './parm.jpg'

import './index.sass'

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

function ImageCarouselDots({ len, idx = 0 }: ImageCarouselDotsProps) {
	function Dot(props: { on?: boolean }) {
		return (
			<div className="carousel-dot" {...props?.on && { "data-on": true }}>&bull;</div>
		)
	}

	const dots = new Array(len)

	for (let i = 0; i < len; i++) {
		dots[i] = <Dot on={i === idx} />
	}

	return (
		<div className="carousel-dots">
			{dots}
		</div>
	)
}

interface ImageCarouselProps {
	images: {
		url: string,
		description: string
	}[],
	startIdx?: number
}

const IMAGES = [
	{
		url: pizza,
		description: 'This is pizza!'
	},
	{
		url: wine,
		description: 'Some of our specialty wines'
	},
	{
		url: parm,
		description: 'Check out our freshly-grated cheese'
	}
]

function useRollover(size: number, initial: number = 0): [number, () => void, () => void] {
	const [state, setState] = useState(initial)

	function inc() {
		setState(state => ++state > size ? 0 : state)
	}

	function dec() {
		setState(state => --state < 0 ? size : state)
	}

	return [state, inc, dec]
}

/**
 * BOTTOM > TOP
 * @fade-out(TOP) & @fade-in(BOTTOM)
 * TOP = BOTTOM
 * BOTTOM = next()
 */
function ImageCarousel({ images, startIdx = 0 }: ImageCarouselProps) {
	type IndexesState = { currentIdx: number, nextIdx: number | undefined }

	const [currentIdx, inc, dec] = useRollover(images.length - 1, startIdx)
	// const [{ currentIdx, nextIdx }, setIndexes] = useState<IndexesState>({
	// 	currentIdx: startIdx,
	// 	nextIdx: undefined
	// })

	useEffect(() => {

	}, [])

	function advance() {

	}

	function retract() {

	}

	return (
		<div className="image-carousel landing-content-spacing">
			<div role="img" style={{ backgroundImage: `url(${images[currentIdx].url})`, height: '100%', backgroundPosition: 'center top', backgroundSize: '100% auto' }}></div>

			<div className="image-carousel-blurb important-left-items">
				{images[currentIdx].description}
			</div>

			<button onClick={() => inc()}>++</button>
			<button onClick={() => dec()}>--</button>

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
				tbd
			</section>
		</main>
	)
}