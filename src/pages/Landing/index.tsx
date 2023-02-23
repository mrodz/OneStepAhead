import { useEffect, useState } from 'react'
import Phone from '@mui/icons-material/Phone'
import Button from '@mui/material/Button'
import pizza from './pizza.webp'
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

interface ImageCarouselProps {
	images: string[],
	startIdx?: number
}

/**
 * BOTTOM > TOP
 * @fade-out(TOP) & @fade-in(BOTTOM)
 * TOP = BOTTOM
 * BOTTOM = next()
 */
function ImageCarousel({ images, startIdx = 0 }: ImageCarouselProps) {
	const [{ currentIdx, nextIdx }, setIndexes] = useState({
		currentIdx: startIdx,
		nextIdx: undefined
	})

	useEffect(() => {

	}, [])

	function advance() {

	}

	function retract() {

	}

	return (
		<div>
			todo...
		</div>
	)
}

function Header() {
	return (
		<div className='landing-header'>
			<div className='header-logo'>
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
			<LocationBar />
			<Header />

			<ImageCarousel images={[]} />
		</main>
	)
}