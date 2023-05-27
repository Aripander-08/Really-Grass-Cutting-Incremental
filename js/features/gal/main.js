MAIN.gal = {
	gain() {
		let r = E(10)

		r = r.mul(upgEffect('star', 0))
		r = r.mul(upgEffect('star', 1))
		r = r.mul(upgEffect('star', 2))
		r = r.mul(upgEffect('star', 3))

		if (hasGSMilestone(2)) r = r.mul(getGSEffect(2))
		r = r.mul(getAstralEff("st"))
		r = r.mul(upgEffect('moonstone', 3))
		r = r.mul(upgEffect('sfrgt', 1))
		r = r.mul(upgEffect("dm", 3))

		return r
	}
}

RESET.gal = {
	unl: _=>true,

	part_req: _=>tmp.rocket_upgraded?1:10,
	req: _=>player.rocket.part>=RESET.gal.part_req(),
	reqDesc: _=>`Get ${RESET.gal.part_req()} Rocket Parts to unlock.`,

	resetDesc: `Reset <b class="red">EVERYTHING prior</b> except Refinery and Chronology! Last chance before blast-off...`,
	resetGain: _=> galUnlocked() ? `<b>+${tmp.gal.star_gain.format(0)}</b> Stars<br><b class='red'>Max Star Accumulator first!</b>` : `<b class='cyan'>Also unlock Grass-Skips, Star Accumulator upgrade, and Astral!</b>`,

	title: `Galactic`,
	resetBtn: `Galactic!`,
	hotkey: `Shift+G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return

			if (!player.gal) player.gal = setupGal()
			player.gal.stars = player.gal.stars.add(galUnlocked() ? tmp.gal.star_gain : MAIN.gal.gain())
			player.gal.times++

			mapPos.earth = [1, 1]
			if (!inSpace()) goToSpace()
		}
		this.doReset()
	},

	doReset(order="gal") {
		player.gal.time = 0

		player.plat = 0
		if (!hasStarTree("qol", 11)) {
			for (var i = 0; i < 8; i++) {
				player.chal.comp[i] = 0
				player.chal.max[i] = 0
			}
		}
		player.grasshop = 0
		player.steel = E(0)
		player.sTime = 0
		if (player.decel == 1) player.decel = 0
		resetAntiRealm()

		if (!hasStarTree("qol", 9)) player.rocket.amount = E(0)
		if (!tmp.rocket_upgraded) {
			player.rocket.momentum = E(0)
			player.rocket.part = 0
		}
		player.rocket.total_fp = E(0)

		if (!hasStarTree("qol", 0)) resetUpgrades("auto")
		if (!hasStarTree("qol", 1)) resetUpgrades("aAuto")
		resetUpgrades("plat")
		resetUpgrades("factory")
		resetUpgrades("foundry")
		resetUpgrades("gen")
		if (!hasStarTree("qol", 6)) resetUpgrades("assembler")
		resetUpgrades("momentum")
		resetUpgrades("star")
		resetGHPotential()

		RESET.gh.doReset(order)
	},
}

tmp_update.push(_=>{
	if (!galUnlocked()) return

	let data = tmp.gal || {}
	if (!tmp.gal) tmp.gal = data

	data.star_gain = MAIN.gal.gain()
	data.star_gain_p = starTreeEff("qol", 14, 0)

	updateAstralTemp()
	updateAGHTemp()

	data.ms = {}
	data.ms.chance = 1/200
	if (hasGSMilestone(5)) data.ms.chance *= player.gal.msLuck
	if (hasGSMilestone(6) && !player.decel) data.ms.chance /= 10
	if (hasGSMilestone(12)) data.ms.chance *= 2
	if (hasAGHMilestone(7)) data.ms.chance *= 2
	data.ms.gain = 1
	data.ms.gain += upgEffect("dm", 5)
	data.ms.gain *= tmp.cutAmt

	//updateChronoTemp()
	updateSCTemp()
})

function galTick(dt) {
	player.gal.time += dt
	player.gal.sacTime += dt
	player.gal.astral = Math.max(player.gal.astral, ASTRAL.bulk())

	player.gal.ghPotential = Math.max(player.gal.ghPotential, MAIN.gh.bulk())
	player.gal.gsPotential = Math.max(player.gal.gsPotential, aMAIN.gs.bulk())

	if (player.ghAuto && player.grasshop < player.gal.ghPotential) player.grasshop = player.gal.ghPotential
	if (player.gsAuto && player.aRes.grassskip < player.gal.gsPotential) player.aRes.grassskip = player.gal.gsPotential

	if (RESET.gal.req()) player.gal.stars = player.gal.stars.add(tmp.gal.star_gain.mul(tmp.gal.star_gain_p*dt))
	if (RESET.gal.req()) player.gal.neg = Math.max(player.gal.neg, tmp.gal.agh.neg)

	if (hasStarTree("auto", 10)) for (let i = 0; i <= 13; i++) buyMaxSCUpgrade("progress", i)

	if (RESET.sac.req()) player.gal.dm = tmp.gal.dmGain.mul(dt*tmp.gal.dmGainP).add(player.gal.dm)
}

function galUnlocked() {
	return player.gal?.times > 0
}

function setupGal() {
	return {
		time: 0,
		times: 0,

		astral: 0,
		astral_pres: 0,
		sp: E(0),
		moonstone: E(0),
		msLuck: 1,

		ghPotential: 0,
		gsPotential: 0,
		neg: 0,

		stars: E(0),
		star_chart: {
			qol: [],
			auto: [],
			progress: [],
		},

		dm: E(0),
		sacTime: 0,
		sacTimes: 0,
	}
}

//HTML
function inSpace() {
	return mapPos.dim == "space"
}

function goToSpace() {
	if (galUnlocked() && !player.planetoid?.started) switchDim(mapPos.dim != "space" ? "space" : inPlanetoid() ? "planetoid" : "earth")
}

el.update.space = _=>{
	if (mapID == 'sc') {
		updateStarChart()
	}
	if (mapID == 'gal') {
		tmp.el.to_space_div.setDisplay(galUnlocked() && !inSpace())
		tmp.el.to_ground_div.setDisplay(galUnlocked() && inSpace())
		updateUpgradesHTML('star')
	}
	if (mapID == 'at') {
		updateUpgradesHTML('moonstone')
	}
	if (mapID == 'sac') {
		updateResetHTML('sac')
		updateUpgradesHTML("dm")
	}

	tmp.el.main_app.changeStyle('background-color',inSpace() ? "#fff1" : "#fff2")
	document.body.style.backgroundColor = inSpace() ? "#0A001E" : "#0052af"
}

//MOONSTONE
UPGS.moonstone = {
	title: "Moonstone Upgrades",

	underDesc: _=>getUpgResTitle('moonstone')+` (${formatPercent(tmp.gal.ms.chance)} platinum grow chance)`,

	ctn: [
		{
			max: 100,

			costOnce: true,

			title: "Moon Platinum",
			desc: `Increase Platinum gain by <b class="green">+1</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Platinum"],
			
			cost: i => 2,
			bulk: i => i/2,

			effect(i) {
				return i
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: 10,

			costOnce: true,

			title: "Moon Fuel",
			desc: `Boost Rocket Fuel by <b class="green">+0.5x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/RocketFuel"],
			
			cost: i => 10,
			bulk: i => Math.floor(i/10),

			effect(i) {
				return i/2
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: 4,

			costOnce: true,

			title: "Moon Power",
			desc: `Boost Space Power by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Icons/SP"],
			
			cost: i => 5,
			bulk: i => Math.floor(i/5),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			costOnce: true,

			title: "Moon Stars",
			desc: `Boost Stars by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Star"],
			
			max: 4,
			cost: i => 7,
			bulk: i => Math.floor(i/7),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => player.aRes?.fTimes,
			costOnce: true,

			title: "Moon Fun",
			desc: `Boost Fun by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/Fun"],
			
			max: 15,
			cost: i => 5,
			bulk: i => Math.floor(i/5),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => player.aRes?.fTimes,
			costOnce: true,

			title: "Moon SFRGT",
			desc: `Boost SFRGT by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/SuperFun"],

			max: 5,
			cost: i => 10,
			bulk: i => Math.floor(i/10),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			costOnce: true,

			title: "Moon Foundry",
			desc: `Foundry lapses <b class="green">+1x</b> faster per level.`,

			res: "moonstone",
			icon: ["Icons/Foundry"],

			max: 5,
			cost: i => 30,
			bulk: i => Math.floor(i/30),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),

			costOnce: true,

			title: "Moon Dark Matters",
			desc: `Boost Dark Matter by <b class="green">+1x</b> per level.`,

			res: "moonstone",
			icon: ["Curr/DarkMatter"],

			max: 5,
			cost: i => 100,
			bulk: i => Math.floor(i/100),

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		}, {
			unl: _ => hasAGHMilestone(7),
			title: "Moon Platinum II",
			tier: 3,
			desc: `<b class="green">Double</b> Platinum per level.`,

			res: "moonstone",
			icon: ["Curr/Platinum"],
			
			max: 500,
			cost: i => E(2).pow(i).mul(1e3),
			bulk: i => E(i).div(1e3).log(2).floor().toNumber()+1,

			effect(i) {
				return 2**i
			},
			effDesc: x => format(x,1)+"x",
		}
	],
}

//STAR ACCUMULATOR
UPGS.star = {
	title: "Star Accumulator",

	unl: _=>hasUpgrade("factory", 7),
	autoUnl: _=>hasStarTree('auto', 4),

	ctn: [
		{
			max: Infinity,

			title: "Shiny Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "plat",
			icon: ["Curr/Star"],

			cost: i => E(1.5).pow(i).mul(300),
			bulk: i => E(i).div(300).log(1.5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Industrial Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "steel",
			icon: ["Curr/Star"],

			cost: i => E(5).pow(i).mul(1e35),
			bulk: i => E(i).div(1e35).log(5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Launch Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,

			res: "rf",
			icon: ["Curr/Star"],

			cost: i => E(2).pow(i**0.8).mul(200),
			bulk: i => E(i).div(200).log(2).root(0.8).floor().toNumber() + 1,
		
			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Accumulated Stars",
			desc: `Increase star gain by <b class="green">20%</b> compounding per level.`,
		
			res: "moonstone",
			icon: ["Curr/Star"],

			cost: i => E(1.5).pow(i),
			bulk: i => E(i).log(1.5).floor().toNumber() + 1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		}
	],
}