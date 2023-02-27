import './App.sass'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import NotFound from './pages/404'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'

const themeOptions: ThemeOptions = {
	palette: {
		mode: 'light',
		primary: {
			main: '#5a794c',
		},
		secondary: {
			main: '#f50057',
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

const theme = createTheme(themeOptions)

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />}>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter >
		</ThemeProvider>
	)
}
