RESET.planetoid = {
	unl: _=>MAIN.sac.did(),

	req: _=>hasAGHMilestone(13),
	reqDesc: _=>"Get 45 Negative Energy.",

	resetDesc: `<b class="red">Coming soon! Wait until Planetoid comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=> ``,

	title: `Planetoid`,
	resetBtn: `...`,

	reset(force=false) {
		true
	},
}
RESET.planetoid_realm = RESET.planetoid