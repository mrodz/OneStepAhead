import { ComponentPropsWithoutRef, useRef, useState } from "react";

import { Button, Divider, IconButton, Menu, MenuItem, SpeedDial, SpeedDialAction, SpeedDialIcon, SwipeableDrawer, useMediaQuery } from "@mui/material";

import MenuBookIcon from '@mui/icons-material/MenuBook'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import WatchIcon from '@mui/icons-material/Watch'
import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CloseIcon from '@mui/icons-material/Close';

import { useMobile } from "../../hooks/useSizes";

import './index.sass'
import './media.sass'
import { Link, useNavigate } from "react-router-dom";

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
	new DialAction(<MenuBookIcon />, 'Donate')
		.onClick(() => window.location.href = "/donate"),
	new DialAction(<PersonPinIcon />, 'Learn About Us')
		.onClick(() => window.location.href = "/about"),
	new DialAction(<WatchIcon />, 'Refer a student')
		.onClick(() => window.location.href = "referrals"),
	new DialAction(<KeyboardArrowUpIcon />, 'Back to Top')
		.onClick(() => window.scrollTo({ top: 0, left: 0 }))
]

interface HeaderNavButtonPropsWithContent {
	dropdown: {
		title: string,
		href: string,
	}[]
}

interface HeaderNavButtonPropsWithoutContent {
	href: string
}

type HeaderNavButtonProps = HeaderNavButtonPropsWithContent | HeaderNavButtonPropsWithoutContent;

function HeaderNavButton(props: HeaderNavButtonProps & ComponentPropsWithoutRef<"button">) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if ("dropdown" in props) {
			setAnchorEl(event.currentTarget);
		}
		if ("href" in props) {
			navigate(props.href)
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				id="basic-button"
				LinkComponent={Link}
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				{props.children}
			</Button>
			{"dropdown" in props && (
				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					{props.dropdown.map(({ title, href }) => (
						<MenuItem key={`MenuItem_${title}`} onClick={() => {
							handleClose()
							navigate(href)
						}}>{title}</MenuItem>
					))}
				</Menu>
			)}
		</>

	)
}

function HeaderNav() {
	const useHamburger = useMediaQuery('(max-width: 700px)')

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

						<IconButton onClick={() => setOpen(false)} sx={{ alignSelf: 'end', mt: '24px', mr: '12px' }}>
							<CloseIcon />
						</IconButton>

						<div className="drawer-text">
							<img alt="One Step Ahead Logo" src="/mainlogo.png" className="logo-png" />
						</div>

						<Divider sx={{ mt: '20px' }} />

						<nav id="Header__items">
							<Link onClick={() => setOpen(false)} to="/donate" className="HeaderButton">
								<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="M255.55 22.36c-30.93 0-56 25.07-56 56c0 30.927 25.07 56 56 56c30.927 0 56-25.073 56-56c0-30.93-25.073-56-56-56zM105.067 144.47c-3.047.028-6.012.55-8.748 1.536c-7.296 2.627-12.95 7.77-17.562 13.617c-3.63 4.602-6.523 9.754-9.012 14.992c-6.79-6.374-14.215-15.785-21.8-30.117l-15.91 8.418c10.115 19.112 20.597 31.962 31.292 40.066c-.405 1.802-.907 3.66-1.164 5.364c-2.005 13.302 2.913 24.966 9.637 34.736c5.34 7.757 11.825 14.87 18.132 22.367c-7.497 15.76-11.35 32.49-11.368 49.366c.07 28.777 11.283 56.823 32.082 80.243l3.655-13.117l17.34 4.832l-25.13 90.18c20.857 6.423 41.04 6.52 61.62-1.072l18.727-66.73l17.33 4.865l-8.892 31.69c17.887 4.99 36.674 7.578 55.607 7.657a212.674 212.674 0 0 0 36.81-3.396l-8.942-39.63l17.558-3.963l14.996 66.473c24.936 11.267 48.496 10.575 72.764 1.222l-25.115-78.986l17.152-5.455l4.97 15.636c21.796-38.09 68.757-29.083 91.825-40.08c11.686-3.894 5.42-69.874 4.916-73.04c-.38-2.39-29.734-3.818-40.16-2.248c-5.975.9-16.344-12.078-27.39-27.597c-5.387-10.488-12.357-20.405-20.753-29.527c-3.988-5.276-2.735-3.092-6.533-6.474c.715 6.697 2.12 12.306 4.152 16.23l-15.986 8.277c-7.378-14.252-7.98-32.853-5.662-52.858c1.583-13.67 4.81-27.957 9.03-41.733c-11.81 6.755-22.626 17.48-32.02 30.586c-13.665 19.064-24.126 42.55-30.647 62.644l-17.12-5.556c2.777-8.56 6.2-17.655 10.255-26.835c-14.467-6.574-35.467-9.76-57.426-8.826c-23.852 1.01-48.83 6.716-68.043 16.2l-7.97-16.143c22.13-10.923 49.122-16.934 75.25-18.043c3.267-.138 6.52-.203 9.747-.19c20.69.086 40.372 3.378 56.274 10.78a227.067 227.067 0 0 1 7.125-12.537c-21.74-7.8-45.253-11.897-69.058-12.03c-63.206.056-121.303 27.923-151.383 72.614c-4.954-5.81-9.525-11.11-12.89-16c-5.26-7.64-7.608-13.682-6.695-21.126c10.458 3.152 20.632 2.07 28.694-1.87c10.316-5.044 17.423-13.85 20.473-23.39c1.526-4.77 2.056-9.862.813-14.928c-1.243-5.065-4.63-10.034-9.598-12.953c-4.862-2.856-10.17-4.187-15.25-4.142zm.328 17.805a6.87 6.87 0 0 1 1 .03c1.362.138 2.86.687 4.803 1.828c.864.508.986.713 1.234 1.722c.247 1.01.248 2.895-.475 5.157c-1.447 4.523-5.713 10-11.235 12.7c-4.346 2.125-9.372 2.917-15.66.847c2.174-5.033 4.823-9.984 7.824-13.787c3.257-4.13 6.74-6.828 9.528-7.832c1.045-.375 1.995-.623 2.978-.665zm278.153 98.647c8.835 0 16 7.163 16 16c0 8.836-7.165 16-16 16c-8.838 0-16-7.164-16-16c0-8.837 7.162-16 16-16z"></path></svg>
								Donate
							</Link>
							<Link onClick={() => setOpen(false)} to="/referrals" className="HeaderButton">
								<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11a5 5 0 0 1 5 5v6h-2v-6a3 3 0 0 0-2.824-2.995L12 13a3 3 0 0 0-2.995 2.824L9 16v6H7v-6a5 5 0 0 1 5-5Zm-6.5 3c.279 0 .55.033.81.094a5.948 5.948 0 0 0-.301 1.575L6 16v.086a1.493 1.493 0 0 0-.356-.08L5.5 16a1.5 1.5 0 0 0-1.493 1.355L4 17.5V22H2v-4.5A3.5 3.5 0 0 1 5.5 14Zm13 0a3.5 3.5 0 0 1 3.5 3.5V22h-2v-4.5a1.5 1.5 0 0 0-1.355-1.493L18.5 16c-.175 0-.343.03-.5.085V16c0-.666-.108-1.306-.308-1.904c.258-.063.53-.096.808-.096Zm-13-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Zm-13 2a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm13 0a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM12 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"></path></svg>
								Get Involved
							</Link>
							<Link onClick={() => setOpen(false)} to="/contact" className="HeaderButton">
								<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 -960 960 960"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-200v120h400v-120H280Zm200 100q17 0 28.5-11.5T520-180q0-17-11.5-28.5T480-220q-17 0-28.5 11.5T440-180q0 17 11.5 28.5T480-140ZM280-320h400v-400H280v400Zm0-480h400v-40H280v40Zm0 560v120-120Zm0-560v-40 40Z" /></svg>
								Contact
							</Link>
							<Link onClick={() => setOpen(false)} to="/about" className="HeaderButton">
								<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 17.05q1.1-.525 2.212-.788T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2v9.85ZM12 20q-1.2-.95-2.6-1.475T6.5 18q-1.325 0-2.775.5T1 20.05V5.55Q2.1 4.8 3.588 4.4T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.425 0 2.913.4T23 5.55v14.5Q21.75 19 20.287 18.5T17.5 18q-1.5 0-2.9.525T12 20Zm2-10.1V8.2q.825-.35 1.688-.525T17.5 7.5q.65 0 1.275.1T20 7.85v1.6q-.6-.225-1.213-.338T17.5 9q-.95 0-1.825.238T14 9.9Zm0 5.5v-1.7q.825-.35 1.688-.525T17.5 13q.65 0 1.275.1t1.225.25v1.6q-.6-.225-1.213-.338T17.5 14.5q-.95 0-1.825.225T14 15.4Zm0-2.75v-1.7q.825-.35 1.688-.525t1.812-.175q.65 0 1.275.1T20 10.6v1.6q-.6-.225-1.213-.338T17.5 11.75q-.95 0-1.825.238T14 12.65Z"></path></svg>
								About
							</Link>
						</nav>

						<Divider sx={{ mb: '20px' }} />

						<div className="drawer-text" style={{ fontSize: '12pt', margin: '1rem 0' }}>
							Today is the day to make real change in your community
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

	return (
		<nav id="Header__items">
			<HeaderNavButton href="/donate">Donate</HeaderNavButton>

			<HeaderNavButton href="/contact">Contact Us</HeaderNavButton>

			<HeaderNavButton dropdown={[
				{
					title: "Become a mentor",
					href: "/join"
				},
				{
					title: "Refer a student",
					href: "/referrals",
				}
			]}>Get Involved</HeaderNavButton>

			<HeaderNavButton dropdown={[
				{
					title: "About us",
					href: "/about"
				},
				{
					title: "Our mission",
					href: "/mission"
				}
			]}>
				About
			</HeaderNavButton>
		</nav >
	)
}

/**
 * @param jiggleHeader if true, apply a shake animation to the header.
 * @returns 
 */
export default function Header() {
	const header = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const isMobile = useMobile()

	return (
		<>
			<header ref={header} className={"Header__landing-header landing-content-spacing"}>
				<a className='Header__header-logo Header__title important-left-items' href="/">
					<img alt="One Step Ahead Logo" src="/mainlogo.png" className="logo-png" />
				</a>
				<div className="Header__nav-floater">
					<HeaderNav />
				</div>
			</header>

			{!isMobile && <SpeedDial
				className="Header__dial"
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
