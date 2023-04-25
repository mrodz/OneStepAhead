import { PropsWithChildren } from 'react'
import './index.sass'
import './media.sass'

interface FounderBlurbProps {
	url: string,
	title: string,
	left?: boolean,
	className?: string,
	colors: [string, string]
}

interface CircleProps {
	background: string,
	radius: string,
	left?: string,
	right?: string,
	top?: string,
	bottom?: string,
}

function Circle({ background, radius, ...placement }: CircleProps) {
	return (
		<div className='Circle' style={{ background, height: radius, width: radius, ...placement }}></div>
	)
}

export default function FounderBlurb({ url, title, left = false, className, ...props }: PropsWithChildren<FounderBlurbProps>) {
	// const templateColumns = ['1fr', 'auto']

	// if (left) templateColumns.reverse()

	// we need to add spacing to the front if we append it
	if (!!className) className = ' ' + className

	return (
		<section className={"FounderBlurb" + (className ?? '')} {...left ? { ['data-left']: true } : {}}>
			<div className="FounderBlurb__text-section" {...left ? { style: { order: 1, paddingLeft: 0, paddingRight: '30px' } } : {}}>
				<h2>
					{title}
				</h2>
				<p>
					{props.children}
				</p>
			</div>
			<div className="FounderBlurb__image-section">
				<img src={url} alt={`Image of ${title}`}></img>
				<div className="FounderBlurb__circles">
					<Circle background={props.colors[0]} radius="6em" right="20px" bottom="20px" />
					<Circle background={props.colors[1]} radius="3em" top="60px" left="20px" />
				</div>
			</div>
		</section>
	)
}