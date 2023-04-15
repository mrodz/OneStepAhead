import useMediaQuery from '@mui/material/useMediaQuery'
import { createContext, useContext, useEffect, PropsWithChildren } from 'react'

const MOBILE_SIZE = '400px'
const MobileContext = createContext(false)

export function MobileProvider({ children }: PropsWithChildren) {
	const mobile = useMediaQuery(`(max-width: ${MOBILE_SIZE})`)

	useEffect(() => {
		console.log('hi!!!')
	}, [mobile])

	return (
		<MobileContext.Provider value={mobile}>
			{children}
		</MobileContext.Provider>
	)
}

export function useMobile() {
	return useContext(MobileContext)
}