import React, { useState, FC } from 'react'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'
import './ParallaxImageSplit.sass'

/**
 * Denotes which half of the image you're referring to: L(eft) or R(ight).
 */
type dir = 'L' | 'R'

type DocumentDimensions = {
	width: number,
	height: number
}

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

	/**
	 * Set the speeds at which each half will move.
	 */
	speeds?: {
		/**
		 * Callback function to get the speed object.
		 * You can use the dimensions supplied to supply
		 * different speeds depending on the width/height
		 * of the device.
		 * 
		 */
		getSpeeds: (dim: DocumentDimensions) => {
			/**
			 * Denoted by the leading property.
			 * Defaults to +100
			 */
			leading: number,
			/**
			 * The opposite of leading.
			 * Defaults to -100
			 */
			lagging: number
		}
	},
	className?: string,
	onLoad?: () => void,
}

interface ParallaxImageTextSectionProps {
	even?: boolean,
	image: React.ReactElement,
	title: string,
	content: string,
	id?: number
}

export function ParallaxImageTextSection(props: ParallaxImageTextSectionProps) {
	const components = [
		(
			<div className="first-description" key={0}>
				<div>
					<h1>
						{props.title}
					</h1>
					<section className="text-content">
						{props.content}
					</section>
				</div>
			</div>
		),
		(
			<div className="text-section-image" key={1}>
				<>
					{props.image}
				</>
			</div>
		)
	]

	// let dim = useContext(AppDimensionContext)
	let fin: React.ReactElement[] = [...components]

	// if the device is not mobile, select every "even" element
	// and reverse the order (to fit with the grid columns).
	const mobile = false // dim.width < styles.switchToMobileView

	if (props?.even === false && !mobile) {
		fin[0] = components[1]
		fin[1] = components[0]
	}

	return (
		<div className="parallax-image-text-section" {...!props?.even && { "data-even": true }}>
			{fin}
		</div>
	)
}

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

	let img = new Image()
	img.src = props.fileName

	img.onload = () => {
		function createCanvas(placement: dir) {
			const canvas = document.createElement('canvas')

			canvas.width = img.width / 2
			canvas.height = img.height

			// casting to get rid of typescript warnings.
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

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

	const mobile = false //dim.width < styles.switchToMobileView

	const speeds = props?.speeds?.getSpeeds({
		height: document.body.clientHeight,
		width: document.body.clientWidth
	}) ?? {
		leading: !mobile ? +50 : +25,
		lagging: !mobile ? -50 : -25
	}

	const prefixAlt = (prefix: string): string => Array.isArray(props.alt) ? props.alt[0] : prefix + props.alt
	const speed = (l: boolean) => l ? speeds.leading : speeds.lagging

	return (
		<>
			<ParallaxProvider>
				<div className={'parallax-image-wrapper-1 ' + (props?.className ?? '')} data-parallax-image-split>
					<div className='parallax-image-wrapper'>
						<Parallax speed={speed(leading)}>
							<img data-fade-first className='parallax-image' draggable="false" src={leftProduct} loading='lazy' alt={props?.alt ? prefixAlt('left half, ') : ''} />
						</Parallax>
						<Parallax speed={speed(!leading)}>
							<img data-fade-second className='parallax-image' draggable="false" src={rightProduct} loading='lazy' alt={props?.alt ? prefixAlt('right half, ') : ''} />
						</Parallax>
					</div>
				</div>
			</ParallaxProvider>
		</>
	)
})

export default ParallaxImageSplit