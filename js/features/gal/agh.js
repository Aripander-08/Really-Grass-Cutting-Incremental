//ANTI-GRASSHOPS OR NEGATIVE ENERGY
function resetGHPotential() {
	player.gal.ghPotential = 0
	player.gal.gsPotential = 0
}

MILESTONE.agh = {
	unl: _ => galUnlocked(),
	req: _ => hasStarTree("progress", 6),
	reqDesc: `Get "Negative Energy" upgrade in Progress Chart.`,

	res: _ => player?.gal?.neg,
	title: x => `<span style="font-size: 10px">
		Negative Energy: <b>${player.gal.neg}</b> (Potential: <b>${tmp.gal.agh.neg}</b>)<br>
		(gain more by -1 Grasshop or +10 Anti-Realm Levels at 200)
	</span>`,
	title_ms: x => x + " Negative Energy",

	milestone: [
		{
			req: 3,
			desc: `<b class="green">Double</b> Space Power.`
		}, {
			req: 6,
			desc: `Astral boosts Stars.`,
		}, {
			req: 9,
			desc: `Astral boosts Rocket Fuel.`,
		}, {
			req: 12,
			desc: `Astral boosts Charge.`,
		}, {
			unl: _ => player.aRes.fTimes,
			req: 15,
			desc: `Astral boosts XP.`,
		}, {
			unl: _ => player.aRes.fTimes,
			req: 21,
			desc: `Astral boosts Fun.`,
		}, {
			unl: _ => player.aRes.fTimes,
			req: 24,
			desc: `Astral boosts SFRGT.`,
		}, {
			unl: _ => player.aRes.fTimes,
			req: 27,
			desc: `Unlock the Dark Matter Plant reset. Moonstone chance is doubled.`,
		}, {
			unl: _ => hasUpgrade("funMachine", 3),
			req: 33,
			desc: `Astral adds Unnatural Healing.`,
		}, {
			unl: _ => hasUpgrade("funMachine", 3),
			req: 36,
			desc: `Astral multiplies effects for each 25 levels of AP upgrade.`,
		}, {
			unl: _ => hasUpgrade("funMachine", 3),
			req: 39,
			desc: `Astral boosts Grass.`,
		}, {
			unl: _ => hasUpgrade("funMachine", 3),
			req: 45,
			desc: `Unlock the Planetoid. Astral multiplies Rings.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 51,
			desc: `Unlock a 'Deranged' formation.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 54,
			desc: `Unlock a 'Scoped' formation.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 57,
			desc: `Unlock a 'Greedy' formation.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 60,
			desc: `Unlock a 'Combo' formation.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 63,
			desc: `Unlock a 'XP+++' formation.`,
		}, {
			unl: _ => hasAGHMilestone(11),
			req: 66,
			desc: `Unlock a 'Headstart' formation.`,
		}
	]
}

function hasAGHMilestone(x,def=1) { return hasMilestone("agh", x) }
function getAGHEffect(x,def=1) { return getMilestoneEff("agh", x, def) }

function updateAGHTemp() {
	let data = tmp.gal.agh || {}
	if (!tmp.gal.agh) tmp.gal.agh = data

	data.neg = Math.floor(30 - player.grasshop * (tmp.gal.sc ? 1 - starTreeEff("progress", 12, 0) : 1) + player.gal.gsPotential)
}

el.update.agh = _=>{
	if (mapID != 'at') return
	updateMilestoneHTML('agh')
}