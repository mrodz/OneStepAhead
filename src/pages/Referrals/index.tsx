import { Card } from "@mui/material"
import "./index.sass"

export default function Referrals() {

	return (
		<Card className="Referrals__card">
			<iframe style={{ border: "none", width: "100%", height: "100%" }} src="https://referrals.onestepaheadculvercity.org/?embed" />
		</Card>
	)
}