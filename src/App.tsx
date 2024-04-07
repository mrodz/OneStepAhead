import './App.sass'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import NotFound from './pages/404'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { MobileProvider } from './hooks/useSizes'
import About from './pages/About'
import Header from './components/Header'
import Mission from './pages/Mission'
import Contact from './pages/Contact'

const themeOptions: ThemeOptions = {
	palette: {
		mode: 'light',
		primary: {
			main: '#5a794c',
		},
		secondary: {
			main: '#93accd',
		},
		error: {
			main: '#ffe000',
		},
		warning: {
			main: '#844b8c',
		},
		success: {
			main: '#00b8ff',
		},
	},
}

function FooterSection() {
	return (
		<footer className="Landing__footer">
			<div id="footer-location">
				<div id="footer-location-title">One Step Ahead Culver City</div>
				<table id="footer-location-about-desktop" cellSpacing="0">
					<tbody>
						<tr>
							<th>Find us at:</th>
							{/* <th>Call us at:</th> */}
						</tr>
						<tr>
							<td>Culver City High School &mdash; 4401 Elenda Street, Culver City, CA 90230</td>
							{/* <td><PhoneLink number='111-222-3333' text='(111) 222-3333' /></td> */}
						</tr>
					</tbody>
				</table>
				<div id="footer-location-about-mobile">
					<div>
						Culver City High School, 4401 Elenda Street, Culver City, CA 90230
					</div>
					{/* <PhoneLink number='111-222-3333' text='(111) 222-3333' /> */}
				</div>

				<div id="footer-location-quote">
					Email Us At: <a href="mailto:onestepaheadculvercity@gmail.com">onestepaheadculvercity@gmail.com</a>
				</div>
			</div>
			<div id="footer-credits">
				<span id="copyright">
					{new Date().getFullYear()} Mateo Rodriguez Web Development, All Rights Reserved.
				</span>
			</div>
		</footer >
	)
}

const theme = createTheme(themeOptions)

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<MobileProvider>
					<Header />
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/about" element={<About />} />
						<Route path="/mission" element={<Mission />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					<FooterSection />
				</MobileProvider>
			</BrowserRouter >
		</ThemeProvider>
	)
}
