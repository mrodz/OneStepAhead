import useMediaQuery from '@mui/material/useMediaQuery'

const MOBILE_SIZE = '400px'

export default function useMobile() {
	const mobile = useMediaQuery(`(max-width: ${MOBILE_SIZE})`)

	return mobile
}