import React, { useState, FC } from 'react'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'
import './index.sass'
import { useMediaQuery } from '@mui/material'

/**
 * Denotes which half of the image you're referring to: L(eft) or R(ight).
 */
type dir = 'L' | 'R'

interface ParallaxImageSplitProps {
	/**
	 * the path to image to be loaded here.
	 * obtain using:
	 * import %VARIABLE_NAME% from "%RELATIVE_FILE_PATH%"
	 */
	fileName: string,
	/**
	 * Add alternate text to the images.
	 * 
	 * If {@link string[]} is provided, will assign [0] to the left
	 * and [1] to the right.
	 * 
	 * If {@link string} is provided, wil assign "Left " + string 
	 * to the left and "Right " + string to the right.
	 */
	alt?: string[] | string,
	/**
	 * Which half of the image should fly by at the quickest rate.
	 * Defaults to the Left Side when constructing a .
	 */
	leading?: dir,
	className?: string,
	onLoad?: () => void,
	bottomLimit?: number,
	parallax?: boolean,
}

interface ParallaxImageTextSectionProps {
	image: React.ReactElement,
	title: string,
	content: JSX.Element | string,
	id?: number
}

export function ParallaxImageTextSection(props: ParallaxImageTextSectionProps) {
	const components = [
		(
			<div className="ParallaxImageTextSection__first-description" key={0}>
				<h2>
					{props.title}
				</h2>
				<div className="ParallaxImageTextSection__text-content">
					{props.content}
				</div>
			</div>
		),
		(
			<div className="ParallaxImageTextSection__text-section-image" key={1}>
				<>
					{props.image}
				</>
			</div>
		)
	]

	return (
		<div className="ParallaxImageTextSection">
			{components}
		</div>
	)
}

const prefixAlt = (alt: string[] | string, prefix: string): string => prefix + (Array.isArray(alt) ? alt[0] : alt)

/**
 * Component that accepts an image, splits it in half, and applies the 
 * parallax effect to each part. The final effect is one image whose halves,
 * when scrolled, slide apart from each other rather aesthetically.
 * 
 * CSS Selector: [data-parallax-image-split]
 * 
 * ## If you want to apply movement speeds conditionally, this component must have access to a `React.Context<DocumentDimensions>`
 * ---     
 * ```tsx
 * 
 * // Example:
 * <AppDimensionProvider>
 * 	<ParallaxImageSplit 
 * 		fileName="IMAGE URL"
 * 		speeds={{
 * 			getSpeeds: (dim) => {
 * 				return {
 * 					leading: dim.width > 500 ? +200 : +50,
 * 					lagging: -100
 * 				}
 * 			},
 * 			dimensionContext: AppDimensionContext
 * 		}}
 * 	/>
 * </AppDimensionProvider>
 * ```
 * Where:
 * * \<AppDimensionProvider/\> is a `React.Context.Provider` whose value represents 
 * the window's current dimensions as a state.
 * * AppDimensionContext is the `React.Context<DocumentDimensions>` bound to the provider.
 * 
 * ### If you wish to use this module's implementation of this:
 * `<ParallaxImageSplitProvider>` supplies this functionality, and can be imported
 * from this module.
 * 
 * ```tsx
 * // Usage:
 * 
 * import ParallaxImageSplit, { ParallaxImageSplitProvider } from 'ParallaxImageSplit.tsx'
 * 
 * // ...
 * <ParallaxImageSplitProvider>
 * 	<ParallaxImageSplit 
 * 		fileName="IMAGE URL" 
 * 		speeds={{
 * 			getSpeeds: (dim) => {
 * 				return {
 * 					leading: dim.width > 500 ? +200 : +50,
 * 					lagging: -100
 * 				}
 * 			}
 * 		}}
 * 	/>
 * </ParallaxImageSplitProvider>
 * ```
 * When using this class, you do not have to supply `dimensionContext` because it is inferred.
 * 
 * ---
 * @author Mateo
 * @param props {@link ParallaxImageSplitProps}
 * @returns JSX.
 */
const ParallaxImageSplit: FC<ParallaxImageSplitProps> = React.memo((props) => {
	// need to use states because images must load before we can 
	// read dimensions, which takes time.
	const [leftProduct, setLeftProduct] = useState('')
	const [rightProduct, setRightProduct] = useState('')

	const size = useMediaQuery(`(max-width:${props.bottomLimit ?? 0}px)`)

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || size || props.parallax === false) {
		return (
			<div className='ParallaxImageSplit__parallax-image-wrapper'>
				<img
					style={{ objectFit: 'cover', objectPosition: 'center' }}
					className='ParallaxImageSplit__parallax-image'
					draggable="false" src={props.fileName}
					loading='lazy'
					data-fade-first
					alt={prefixAlt(props?.alt ?? '', '(reduced motion)')} />
			</div>
		)
	}

	let img = new Image()
	img.src = props.fileName

	img.onload = () => {
		function createCanvas(placement: dir) {
			const canvas = document.createElement('canvas')

			canvas.width = img.width / 2
			canvas.height = img.height

			// casting to get rid of typescript warnings.
			const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.imageSmoothingQuality = 'high'

			// if left, start at the origin; if right, start midway through.
			const start = placement === 'L' ? 0 : img.width / 2

			ctx.drawImage(img, start, 0, img.width, img.height, 0, 0, img.width, img.height)

			// Convert to base64; return this
			return canvas.toDataURL('image/jpeg')
		}

		setLeftProduct(createCanvas('L'))
		setRightProduct(createCanvas('R'))

		props?.onLoad?.()
	}

	const leading = (props?.leading ?? 'L') === 'L'

	const speed = (l: boolean) => l ? +25 : -25

	return (
		<>
			<ParallaxProvider>
				<div className='ParallaxImageSplit__parallax-image-wrapper'>
					<Parallax speed={speed(leading)}>
						<img
							style={{ objectFit: 'cover', objectPosition: 'right' }}
							data-fade-first className='ParallaxImageSplit__parallax-image'
							draggable="false"
							src={leftProduct}
							loading='lazy'
							alt={props?.alt ? prefixAlt(props.alt!, 'left half, ') : ''}
						/>
					</Parallax>
					<Parallax speed={speed(!leading)}>
						<img
							style={{ objectFit: 'cover', objectPosition: 'left' }}
							data-fade-second
							className='ParallaxImageSplit__parallax-image'
							draggable="false"
							src={rightProduct}
							loading='lazy'
							alt={props?.alt ? prefixAlt(props.alt!, 'right half, ') : ''}
						/>
					</Parallax>
				</div>
			</ParallaxProvider>
		</>
	)
})

export default ParallaxImageSplit