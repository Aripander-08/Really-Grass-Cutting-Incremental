function setupPlanetoid() {
	return {
		grass: E(0),
		level: 0,
		xp: E(0),

		time: 0,
		tSpent: 0,
		combo: 0,
		form: "no",

		astro: E(0),
		aTimes: 0,
		measure: E(0),
		qTimes: 0,

		obs: E(0),
		res: E(0),
		ring: E(0),

		trial: {
			gain: 0,
			best: 0,
			lvl: 0
		}
	}
}
REALMS.planetoid = {
	on: r => r == 3,
	grass() {
		let x = E(0.01)
		x = x.mul(upgEffect('planetarium', 0))
		x = x.mul(upgEffect('obs', 0))
		x = x.mul(upgEffect("astro", 0))
		x = x.mul(upgEffect("ring", 1))
		x = x.mul(getAstralEff("pl"))
		if (hasGJMilestone(4)) x = x.mul(getGJEffect(4))

		if (inFormation("sp")) x = x.mul(3)
		if (inFormation("cm")) x = x.mul(Math.log10(player.planetoid.combo + 10))
		return x
	},
	xp() {
		let x = E(0.01)
		x = x.mul(upgEffect('planetarium', 1))
		x = x.mul(upgEffect('measure', 0))
		x = x.mul(upgEffect('obs', 1))
		x = x.mul(upgEffect("ring", 0))
		x = x.mul(upgEffect("astro", 1))
		x = x.mul(lunarEff(3))
		if (hasGJMilestone(5)) x = x.mul(getGJEffect(5))

		if (inFormation("sp")) x = x.mul(3)
		if (inFormation("gd")) x = player.planetoid.xp.max(1).div(5).min(x.pow(1.1))
		if (inFormation("cm")) x = x.mul(Math.log10(player.planetoid.combo + 10))
		if (inFormation("xp")) x = x.mul(player.planetoid.xp.div(x).pow(.1).max(1))
		return x
	},
	tp: _ => E(0),

	ring() {
		let cosmic = player.planetoid.level
		if (cosmic < 10) return E(0)

		let x = E(1.1).pow(cosmic - 5)
		x = x.mul(upgEffect("cloud", 4))
		x = x.mul(upgEffect('planetarium', 2))
		x = x.mul(upgEffect("astro", 2))
		x = x.mul(upgEffect('measure', 2))
		x = x.mul(getAstralEff("rg"))
		x = x.mul(lunarEff(4))
		return x.floor()
	}
}
MAIN.planetoid = plMAIN = {}

RESET.planetoid = {
	unl: _=>hasAGHMilestone(8),

	req: _=>hasAGHMilestone(13),
	reqDesc: _=>"Get 45 Negative Energy.",

	resetDesc: `Travel to the hazardous Planetoid, and leave resources behind until return.`,
	resetGain: _=> ``,
	hotkey: `N`,

	title: `The Planetoid`,
	resetBtn: `Enter the Planetoid`,

	reset(force=false) {
		if (!hasAGHMilestone(11)) return
		if (!player.planetoid) player.planetoid = setupPlanetoid()

		player.ch.speed = 1
		switchDim("planetoid")
	},
}
RESET.planetoid_earth = RESET.planetoid
RESET.planetoid_exit = {
	unl: _=>inPlanetoid(),

	req: _=>!player.planetoid.started||CHEAT||hasUpgrade('res', 22),
	reqDesc: _=>"You can't return during the trial!",

	resetDesc: `Traverse back to the Earth. You'll gain reaccess to Earth and Space content.`,
	resetGain: _=> ``,
	hotkey: `N`,

	title: `Landing Site`,
	resetBtn: `Return to Earth`,

	reset(force=false) {
		if (!this.req()) return
		player.planetoid.pause = true
		switchDim("earth")
	},
}
function inPlanetoid() {
	return player.decel == 3
}
function canGoAnywhere() {
	return mapPos.dim != "planetoid" || hasUpgrade('res', 22) || CHEAT || !player.planetoid.started
}

UPGS.planetarium = {
	title: "Planetarium Upgrades",

	unl: _=>inPlanetoid(),
	autoUnl: _=>hasUpgrade('res', 12),

	ctn: [
		{
			title: "Planetarium",
			desc: `Gain <b class="green">15%</b> more Planetarium compounding.`,

			res: "planetarium",
			icon: ['Curr/Planetarium'],

			max: Infinity,
			cost: i => Decimal.pow(1.25,i).mul(50).ceil(),
			bulk: i => i.div(50).log(1.25).floor().toNumber()+1,

			effect: i => E(1.15+upgEffect("cloud", 2, 0)).pow(i),
			effDesc: x => x.format()+"x",
		}, {
			title: "Cosmic",
			desc: `Gain <b class="green">15%</b> more Cosmic compounding.`,

			res: "planetarium",
			icon: ['Icons/Cosmic'],

			max: Infinity,
			cost: i => Decimal.pow(1.25,i).mul(100).ceil(),
			bulk: i => i.div(100).log(1.25).floor().toNumber()+1,

			effect: i => E(1.15+upgEffect("cloud", 3, 0)).pow(i),
			effDesc: x => x.format()+"x",
		}, {
			title: "Rings",
			desc: `Gain <b class="green">+1x</b> more Rings.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

			res: "planetarium",
			icon: ['Curr/Ring'],

			max: Infinity,
			cost: i => Decimal.pow(10,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).log(10).floor().toNumber()+1,

			effect: i => E(2).pow(Math.floor(i/25)).mul(i+1),
			effDesc: x => format(x,1)+"x",
		}, {
			title: "Planetoid Grow",
			desc: `Grass grows <b class="green">+0.1x</b> faster in Planetoid.`,

			res: "planetarium",
			icon: ['Icons/Speed'],

			max: 100,
			cost: i => Decimal.pow(5,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).log(5).floor().toNumber()+1,

			effect: i => i/10,
			effDesc: x => "+"+format(x,1)+"x",
		}, {
			title: "Astrolabe",
			desc: `<b class="green">Double</b> Astrolabe.`,
			unl: _ => player.planetoid?.aTimes,

			res: "planetarium",
			icon: ['Curr/Astrolabe'],

			max: Infinity,
			cost: i => Decimal.pow(200,i).mul(1e8).ceil(),
			bulk: i => i.div(1e8).log(200).floor().toNumber()+1,

			effect: i => E(2).pow(Math.floor(i/25)).mul(i+1),
			effDesc: x => x.format()+"x",
		}
	],
}

function planetoidTick(dt) {
	if (!inFormation("fz") && !CHEAT) {
		player.planetoid.time -= dt * (inFormation("sp") ? 3 : 1)
		player.planetoid.tSpent += dt * (inFormation("sp") ? 3 : 1)
	}
	player.planetoid.combo /= Math.pow(1.5, dt)

	if (RESET.astro.req()) player.planetoid.astro = tmp.plRes.aGain.mul(tmp.plRes.aGainP*dt).add(player.planetoid.astro)
	if (RESET.quadrant.req()) player.planetoid.measure = tmp.plRes.mGain.mul(tmp.plRes.mGainP*dt).add(player.planetoid.measure)
	if (player.planetoid.level >= 200) player.planetoid.trial.unl = true

	if (player.planetoid.time <= 0) endPlanetoidTrial()
}

//Trial: Rings
RESET.planetoid_trial = {
	unl: _=>inPlanetoid(),

	req: _=>true,
	reqDesc: _=>"",

	resetDesc: `You have <span id='planetoid_trial'></span> to reach Level 10 for Rings.<br>
		<b class='red'>Ending the trial will reset Planetarium, Cosmic, Observatory, and resets!</b>`,
	resetGain: _=> player.planetoid.started ? `+${format(REALMS.planetoid.ring(),0)} Rings` : ``,
	hotkey: `N`,

	title: `Hazard Warning...`,
	btns: `<button id="planetoid_pause" onclick="player.planetoid.pause = !player.planetoid.pause"></button>`,
	resetBtn: ``,

	reset(force=false) {
		if (player.planetoid.started) endPlanetoidTrial()
		else startPlanetoidTrial()
	},
}
function getPlanetoidTrialTime() {
	return CHEAT ? 1e300 : 300 + upgEffect("res", 23, 0)
}
function startPlanetoidTrial() {
	player.planetoid.started = true
	player.planetoid.pause = false
	player.planetoid.time = getPlanetoidTrialTime()
}
function endPlanetoidTrial() {
	player.planetoid.ring = player.planetoid.ring.add(REALMS.planetoid.ring())
	player.planetoid.time = 0
	player.planetoid.tSpent = 0
	player.planetoid.started = false

	player.planetoid.measure = E(0)
	resetUpgrades("measure")
	resetUpgrades("obs")

	RESET.quadrant.doReset("ring")

	let trial = player.planetoid.trial
	if (trial.unl) {
		trial.lvl = Math.max(trial.lvl, trial.gain)
		trial.best = 0
		trial.gain = 0
	}
}

UPGS.ring = {
	title: "Ring Chart",
	underDesc: _=>getUpgResTitle("ring"),

	unl: _=>inPlanetoid(),
	autoUnl: _=>false,
	noSpend: _=>false,

	ctn: [
		{
			title: "Greetings, Planetoid!",
			desc: `Gain <b class='green'>+1x</b> more Cosmic.`,

			res: "ring",
			icon: ['Curr/Fun', 'Icons/Plus'],

			max: 5,
			cost: 1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Basically Planetarium",
			desc: `Gain <b class='green'>+1x</b> more Planetarium.`,

			res: "ring",
			icon: ['Curr/Planetarium'],

			max: 5,
			cost: 2,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Habited III!",
			desc: `Habitability grows <b class='green'>+1x</b> higher. This affects speed too.`,

			res: "ring",
			icon: ['Icons/Compaction'],

			max: Infinity,
			cost: i => E(10).pow(i+1),
			bulk: i => i.log(10).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x)+"x"
		}, {
			title: "Astral Grassy",
			desc: `Boost 'Astral Grass' effects by <b class='green'>+^0.05</b>.`,

			res: "ring",
			icon: ['Curr/Grass', 'Icons/StarProgression'],

			max: 10,
			cost: i => E(3).pow(i).mul(2),
			bulk: i => i.div(2).log(3).floor().toNumber()+1,

			effect: i => i/20+1,
			effDesc: x => "^"+format(x)
		}, {
			title: "Astral Superfoundry",
			desc: `Boost 'Astral Foundry' effect by <b class='green'>+0.1x</b>.`,

			res: "ring",
			icon: ['Icons/Foundry', 'Icons/StarProgression'],

			max: 15,
			cost: i => E(4).pow(i).mul(10),
			bulk: i => i.div(10).log(4).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => format(x,1)+"x"
		}, {
			title: "Astral Supercharge",
			desc: `Raise 'Astral Charge' effect by <b class='green'>+^0.1</b>.`,

			res: "ring",
			icon: ['Icons/Charge', 'Icons/StarProgression'],

			max: 10,
			cost: i => E(5).pow(i).mul(50),
			bulk: i => i.div(50).log(5).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x,1)
		}, {
			title: "Basically Astral",
			desc: `Gain <b class='green'>+1x</b> more Space Power.`,

			res: "ring",
			icon: ['Icons/SP'],

			max: 5,
			cost: 100,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Basically Momentum",
			desc: `Gain <b class='green'>+1x</b> more Momentum.`,

			res: "ring",
			icon: ['Curr/Momentum'],

			max: 5,
			cost: 1e3,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Basically Normal",
			desc: `Gain <b class='green'>+1x</b> more Normality Points.`,

			res: "ring",
			icon: ['Curr/Normality'],

			max: 5,
			cost: 1e4,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Basically Astro",
			desc: `Gain <b class='green'>+1x</b> more Astrolabe.`,

			res: "ring",
			icon: ['Curr/Astrolabe'],

			max: 5,
			cost: 1e5,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Basically Measure",
			desc: `Gain <b class='green'>+1x</b> more Measure.`,

			unl: _ => player.planetoid?.qTimes,
			res: "ring",
			icon: ['Curr/Measure'],

			max: 5,
			cost: 1e6,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "I feel Cloudy...",
			desc: `<b class='green'>Double</b> Cloud production gain.`,
			unl: _ => player.unRes?.vTimes,

			res: "ring",
			icon: ['Curr/Cloud', 'Icons/StarProgression'],

			max: Infinity,
			cost: i => E(10).pow(i+12),
			bulk: i => i.log10().sub(12).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Master of Ring",
			desc: `<b class='green'>Raise</b> Astral XP effect.`,
			unl: _ => player.unRes?.vTimes,

			res: "ring",
			icon: ['Icons/XP', 'Icons/StarProgression'],

			max: 5,
			cost: i => E(10).pow(i+15),
			bulk: i => i.log10().sub(15).floor().toNumber()+1,

			effect: i => i/25+1,
			effDesc: x => "^"+format(x)
		}, {
			title: "Prociency of Ring",
			desc: `<b class='green'>Double</b> Momentum.`,
			unl: _ => player.unRes?.vTimes,

			res: "ring",
			icon: ['Curr/Momentum', 'Icons/StarProgression'],

			max: Infinity,
			cost: i => E(10).pow(i*1.5+16),
			bulk: i => i.log10().sub(16).div(1.5).floor().toNumber()+1,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x"
		}
	],
}

//Formations
//1: Speed       - x3 Value, but x3 Time Loss
//2: Freeze      - x0 Speed
//3: Microscopic - x2 Range, but x2 Habitability
//4: Deranged    - x2 Habitability Time, but /2 Range
//5: XP++        - Gain more XP based on itself, but divided by XP gain
//6: Self-Greed  - XP Gain is based on XP, but capped at [XP Gain]^1.5
//7: Combo       - Higher Combo, Higher Value
//8: Headstart   - x5 Planetarium
plMAIN.form = {
	no: {
		title: "Normal",
		desc: "Default formation"
	},
	fz: {
		title: "Freeze",
		desc: "Freeze time. <b class='magenta'>Gain grass freely.</b>"
	},
	sp: {
		title: "Speed",
		desc: "Be more worthy, but you must rush. <b class='magenta'>No time to walk!</b>"
	},
	dr: {
		title: "Deranged",
		desc: "Habitability grows faster, but you are descoped. <b class='magenta'>Less for more.</b>",

		req: _ => player.gal.neg >= 51,
		reqDesc: `Get 51 Negative Energy.`,
	},
	sc: {
		title: "Scoped",
		desc: "Double your range, but habitability wastes more. <b class='magenta'>Step on large fields.</b>",

		req: _ => player.gal.neg >= 54,
		reqDesc: `Get 54 Negative Energy.`,
	},
	gd: {
		title: "Greedy",
		desc: "Only XP gives XP gain. <b class='magenta'>Greedy is a flaw.</b>",

		req: _ => player.gal.neg >= 57,
		reqDesc: `Get 57 Negative Energy.`,
	},
	cm: {
		title: "Combo",
		desc: "Cutting gives more value, but dynamicly reduces. <b class='magenta'>You are dynamic.</b>",

		req: _ => player.gal.neg >= 60,
		reqDesc: `Get 60 Negative Energy.`,
	},
	xp: {
		title: "Xperience",
		desc: "Gain more XP, but divided by its gain. <b class='magenta'>Try for more.</b>",

		req: _ => player.gal.neg >= 63,
		reqDesc: `Get 63 Negative Energy.`,
	},
	hs: {
		title: "Headstart",
		desc: "Habitability starts at 50% maximized. <b class='magenta'>Back to basics.</b>",

		req: _ => player.gal.neg >= 66,
		reqDesc: `Get 66 Negative Energy.`,
	}
}
function switchFormation(x) {
	if (!compute(plMAIN.form[x].req)) return
	player.planetoid.form = x
}
function inFormation(x) {
	return inPlanetoid() && player.planetoid.form == x
}
el.setup.formation = _=>{
	let html = ``
	for (let i in plMAIN.form) html += `<span class='formation'><button id='formation_${i}' onclick='switchFormation("${i}")'></button></span>`
	new Element('formations').setHTML(html)
}

//Observatory
plMAIN.obs = {
	gain() {
		let r = E(0.01)
		r = r.add(upgEffect('measure', 1, 0))
		if (inFormation("sp")) r = r.mul(3)
		return r
	},
	chance: _ => 0.02+upgEffect("res",13,0),
	canGetRes: _ => player.planetoid?.aTimes > 0,
}
UPGS.obs = {
	title: "Observatory",
	underDesc: _=>getUpgResTitle('obs')+` (${formatPercent(plMAIN.obs.chance())} grow chance)`,

	unl: _=>inPlanetoid(),
	autoUnl: _=>hasUpgrade('res', 14),
	noSpend: _=>hasUpgrade('res', 14),

	ctn: [
		{
			title: "Observed Planetarium",
			desc: `Increase Planetarium gain by <b class="green">+1x</b>.`,

			res: "obs",
			icon: ['Curr/Planetarium'],

			max: 10,
			cost: 2,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Observed Cosmic",
			desc: `Increase Cosmic gain by <b class="green">+1x</b>.`,

			res: "obs",
			icon: ['Icons/Cosmic'],

			max: 10,
			cost: 3,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Observed Habit",
			desc: `Habitability grows <b class="green">+0.2x</b> faster.`,

			res: "obs",
			icon: ['Icons/Compaction'],

			max: 10,
			cost: 5,

			effect: i => i/5+1,
			effDesc: x => format(x,1)+"x",
		}, {
			title: "Observed Grow",
			desc: `Grass grows <b class="green">+0.2x</b> faster in Planetoid.`,

			res: "obs",
			icon: ['Icons/Speed'],

			max: 10,
			cost: 10,

			effect: i => i/5,
			effDesc: x => "+"+format(x,1)+"x",
		}, {
			title: "Observed Astro",
			desc: `Increase Astrolabe gain by <b class="green">+1x</b>.`,
			unl: _ => player.planetoid?.aTimes,

			res: "obs",
			icon: ['Curr/Astrolabe'],

			cost: 15,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Observed Grow II",
			desc: `Grass grows <b class="green">10%</b> faster in Planetoid.`,
			tier: 2,
			unl: _ => player.planetoid?.aTimes,

			res: "obs",
			icon: ['Icons/Speed'],

			max: 10,
			cost: 1e5,

			effect: i => 1.1**i,
			effDesc: x => format(x,1)+"x",
		}, {
			title: "Observed Measure",
			desc: `Gain <b class="green">+0.1x</b> more Measure.`,
			unl: _ => player.planetoid?.qTimes,

			res: "obs",
			icon: ['Curr/Measure'],

			max: 10,
			cost: 500,

			effect: i => i/10+1,
			effDesc: x => format(x)+"x",
		},
	],
}
UPGS.res = {
	title: "Reservatory",
	underDesc: _=>getUpgResTitle('res')+"<span class='smallAmt'> (+1 / Observatorium)</span>",

	unl: _=>inPlanetoid(),
	req: _=>plMAIN.obs.canGetRes(),
	reqDesc: `Use the Astrolabe to unlock.`,

	ctn: [
		{
			title: "Part Assembler",
			desc: `Automate <b class='green'>Rocket Part</b>. [soon]`,

			res: "res",
			icon: ['Curr/RocketFuel','Icons/Automation'],

			cost: Infinity
		}, {
			title: "Funspansion",
			desc: `Unlock new <b class='green'>SFRGT</b> upgrades.`,

			res: "res",
			icon: ['Curr/SuperFun','Icons/StarProgression'],

			cost: 100
		}, {
			title: "Dark Matter Generator",
			desc: `Passively generate <b class='green'>+0.1%</b> Dark Matter per second.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/DarkMatter','Icons/Plus'],

			cost: i => E(10).pow(i+2),
			bulk: i => i.log10().sub(2).floor().toNumber()+1,

			effect: i => i/1e3,
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			title: "Unnatural Automation",
			desc: `Automate <b class='green'>Unnatural Grass</b> Upgrades. They don't spend anything.`,

			res: "res",
			icon: ['Curr/UnnaturalGrass','Icons/Automation2'],

			cost: 500
		}, {
			title: "Habit II!",
			desc: `Automatically cut grass at <b class='green'>+0.5%</b> of Habitability max value per level.`,

			res: "res",
			icon: ['Icons/Compaction','Icons/Plus'],

			max: 10,
			cost: i => E(1e3).pow(i+3),
			bulk: i => i.log(1e3).sub(3).floor().toNumber()+1,

			effect: i => i/200,
			effDesc: x => formatPercent(x)
		}, {
			title: "Fast Habitability",
			desc: `Habitability takes at most <b class='green'>0.5s</b> to max.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Icons/Compaction','Icons/Plus'],

			cost: 1e6
		}, {
			title: "A Normal Generator",
			desc: `Passively generate <b class='green'>+0.1%</b> Normality Points per second.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Normality','Icons/Plus'],

			cost: 1e8,

			effect: i => i/1e3,
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			title: "A Normal Automation",
			desc: `Automate <b class='green'>Normality</b> Upgrades. They don't spend anything.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Normality','Icons/Automation2'],

			cost: 1e5
		}, {
			title: "Foggy Generator",
			desc: `Automatically increase Cloud production to <b class='green'>0.1%</b> gain.`,
			unl: _ => false,

			res: "res",
			icon: ['Curr/Cloud','Icons/Plus'],

			cost: 1e20
		}, {
			title: "Foggy Automation",
			desc: `Automate <b class='green'>Cloudy</b> Upgrades. They don't spend anything.`,
			unl: _ => false,

			res: "res",
			icon: ['Curr/Cloud','Icons/Automation2'],

			cost: 1e15
		}, {
			title: "Multi-Grassjump",
			desc: `You can bulk <b class='green'>Grass-Jump</b>.`,
			unl: _ => false,

			res: "res",
			icon: ['Icons/Placeholder','Icons/Multiply'],

			cost: 1e100
		}, {
			title: "Auto-Grassjump",
			desc: `Automate <b class='green'>Grass-Jump</b>.`,
			unl: _ => false,

			res: "res",
			icon: ['Icons/Placeholder','Icons/Automation'],

			cost: 1e100
		}, {
			title: "Planetarium Automation",
			desc: `Automate <b class='green'>Planetarium</b> Upgrades.`,

			res: "res",
			icon: ['Curr/Planetarium','Icons/Automation'],

			cost: 1e3
		}, {
			title: "Observatory Luck",
			desc: `<b class='green'>+1%</b> chance to Observatorium.`,

			res: "res",
			icon: ['Curr/Observatorium','Icons/Multiply'],

			max: 5,
			cost: i => E(2).pow(i).mul(200),
			bulk: i => E(i).div(200).log(2).floor().toNumber()+1,

			effect: i => i/100,
			effDesc: x => format(x*100,0)+"%",
		}, {
			title: "Observatory Automation",
			desc: `Automate <b class='green'>Observatory</b> Upgrades. They don't spend anything.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Observatorium','Icons/Automation2'],

			cost: 1e5
		}, {
			title: "Astro Generator",
			desc: `Passively generate <b class='green'>+0.1%</b> Astrolabe per second.`,
			unl: _ => player.planetoid?.trial.unl,

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Plus'],

			cost: 1e5,

			effect: i => i/1e3,
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			title: "Astro Automation",
			desc: `Automate <b class='green'>Astrolabe</b> Upgrades.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Automation'],

			cost: 1e6
		}, {
			title: "Astro No-Spend",
			desc: `<b class='green'>Astrolabe</b> Upgrades don't spend anything.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Automation2'],

			cost: 1e7
		}, {
			title: "Quadrant Generator",
			desc: `Passively generate <b class='green'>+0.1%</b> Measure per second.`,
			unl: _ => false,

			res: "res",
			icon: ['Curr/Measure','Icons/Plus'],

			max: 10,
			cost: 1e12,

			effect: i => i/1e3,
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			title: "Quadrant Automation",
			desc: `Automate <b class='green'>Quadrant</b> Upgrades.`,
			unl: _ => player.planetoid?.trial.unl,

			res: "res",
			icon: ['Curr/Measure','Icons/Automation'],

			cost: 1e9
		}, {
			title: "Quadrant No-Spend",
			desc: `<b class='green'>Quadrant</b> Upgrades don't spend anything.`,
			unl: _ => player.planetoid?.trial.unl,

			res: "res",
			icon: ['Curr/Measure','Icons/Automation2'],

			cost: 1e10
		}, {
			title: "Planetoid Pause",
			desc: `You can <b class='green'>pause</b> Planetoid runs.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Planetarium','Icons/Plus'],

			cost: 1e6
		}, {
			title: "Planetoid Intermission",
			desc: `You can exit the Planetoid while paused.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Planetarium','Icons/StarProgression'],

			cost: 1e9
		}, {
			title: "Planetoid Timer",
			desc: `Planetoid Timer is increased by <b class='green'>+10s</b>.`,
			unl: _ => hasAGHMilestone(20),

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Plus'],

			max: 6,
			cost: i => E(10).pow(i+8),
			bulk: i => i.log(10).sub(8).floor().toNumber()+1,

			effect: i => i * 10,
			effDesc: x => "+"+format(x,0)+" seconds"
		}, {
			title: "Planetoid Checkpoint",
			desc: `You can <b class='green'>set</b> Planetoid checkpoints.`,
			unl: _ => hasAGHMilestone(20),

			res: "res",
			icon: ['Curr/Astrolabe','Icons/StarProgression'],

			cost: 1e8
		}, {
			title: "Planetoid Headstart",
			desc: `Start with <b class='green'>+1 level</b> of "Astrolabe" upgrade.`,
			unl: _ => false,

			res: "res",
			icon: ['Curr/Measure','Icons/Plus'],

			cost: 1e100
		}, {
			title: "Planetoid Stability",
			desc: `Quadrant reduces <b class='green'>Astrolabe</b> instead.`,
			unl: _ => player.planetoid?.qTimes,

			res: "res",
			icon: ['Curr/Measure','Icons/StarProgression'],

			cost: 1e100
		}
	],
}

//RESET
plMAIN.reset = {
	aGain() {
		let r = E(1.05).pow(player.planetoid.level - 10)
		r = r.mul(upgEffect('obs', 3))
		r = r.mul(upgEffect('planetarium', 4))
		r = r.mul(upgEffect('measure', 3))
		r = r.mul(upgEffect("ring", 9))
		return r.floor()
	},
	mGain() {
		let r = E(1.05).pow(player.planetoid.level - 70).mul(5)
		r = r.mul(upgEffect("astro", 3))
		r = r.mul(upgEffect("ring", 10))
		r = r.mul(upgEffect('obs', 6))
		return r.floor()
	},
}
RESET.astro = {
	unl: _=>inPlanetoid(),

	req: _=>player.planetoid.level>=30,
	reqDesc: `Reach Cosmic 30.`,

	resetDesc: `Reset your Planetariums and Cosmic.`,
	resetGain: _=> `
		<b>+${tmp.plRes.aGain.format(0)}</b> Astrolabe
		${player.planetoid?.aTimes ? '' : '<br><b class="cyan">Also unlock Reservatory!</b>'}
	`,

	title: `Astrolabe`,
	resetBtn: `Use the Astrolabe`,
	hotkey: `P`,

	reset(force=false) {
		if (!this.req()) return
		player.planetoid.astro = player.planetoid.astro.add(tmp.plRes.aGain)
		player.planetoid.aTimes++
		this.doReset()
	},

	doReset(order="astro") {
		player.planetoid.grass = E(0)
		player.planetoid.xp = E(0)
		player.planetoid.level = 0
		player.planetoid.obs = E(0)
		player.planetoid.combo = 0

		resetGrasses()
		resetUpgrades("planetarium")
	}
}
UPGS.astro = {
	title: "Astrolabe Upgrades",
	underDesc: _=>getUpgResTitle('astro'),

	unl: _=>inPlanetoid(),
	autoUnl: _=>hasUpgrade('res', 16),
	noSpend: _=>hasUpgrade('res', 17),

	req: _=>player.planetoid?.aTimes>0,
	reqDesc: `Use the Astrolabe to unlock.`,

	ctn: [
		{
			title: "Astro Planetarium",
			tier: 2,
			desc: `Gain <b class="green">+1x</b> more Planetarium.`,

			res: "astro",
			icon: ['Curr/Planetarium'],

			max: Infinity,
			cost: i => Decimal.pow(1.5,i).mul(3).ceil(),
			bulk: i => i.div(3).log(1.5).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Astro Cosmic",
			tier: 2,
			desc: `Gain <b class="green">+1x</b> more Cosmic.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

			res: "astro",
			icon: ['Icons/Cosmic'],

			max: Infinity,
			cost: i => Decimal.pow(1.5,i).mul(10).ceil(),
			bulk: i => i.div(10).log(1.5).floor().toNumber()+1,

			effect: i => E(2).pow(Math.floor(i/25)).mul(i+1),
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Astro Rings",
			desc: `Gain <b class="green">+1x</b> more Rings.`,

			res: "astro",
			icon: ['Curr/Ring'],

			max: Infinity,
			cost: i => Decimal.pow(4,i).mul(100).ceil(),
			bulk: i => i.div(100).log(4).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Measure",
			desc: `Gain <b class="green">+1x</b> more Measure.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,
			unl: _ => player.planetoid?.qTimes,

			res: "astro",
			icon: ['Curr/Measure'],

			max: Infinity,
			cost: i => Decimal.pow(1.3,i).mul(100).ceil(),
			bulk: i => i.div(100).log(1.3).floor().toNumber()+1,

			effect: i => E(2).pow(Math.floor(i/25)).mul(i+1),
			effDesc: x => x.format()+"x",
		}
	],
}

RESET.quadrant = {
	unl: _=>inPlanetoid() && player.planetoid.aTimes,

	req: _=>player.planetoid.level>=90,
	reqDesc: `Reach Cosmic 90.`,

	resetDesc: `Reset your Planetariums, Cosmic, and Astrolabe.`,
	resetGain: _=> `<b>+${tmp.plRes.mGain.format(0)}</b> Measure`,

	title: `Quadrant`,
	resetBtn: `Use the Quadrant`,
	hotkey: `C`,

	reset() {
		if (!this.req()) return
		player.planetoid.measure = player.planetoid.measure.add(tmp.plRes.mGain)
		player.planetoid.qTimes++
		this.doReset()
	},

	doReset(order="quadrant") {
		player.planetoid.astro = E(0)
		resetUpgrades("astro")

		RESET.astro.doReset(order)
	}
}
UPGS.measure = {
	title: "Quadrant Upgrades",
	underDesc: _=>getUpgResTitle('measure'),

	unl: _=>inPlanetoid() && player.planetoid.aTimes,
	autoUnl: _=>hasUpgrade('res', 19),
	noSpend: _=>hasUpgrade('res', 20),

	req: _=>player.planetoid?.qTimes>0,
	reqDesc: `Use the Quadrant to unlock.`,

	ctn: [
		{
			title: "Quad. Cosmic",
			tier: 3,
			desc: `<b class="green">Double</b> Cosmic.`,

			res: "measure",
			icon: ['Icons/Cosmic'],

			max: Infinity,
			cost: i => Decimal.pow(3,i).mul(5).ceil(),
			bulk: i => i.div(5).max(1).log(3).floor().toNumber()+1,

			effect: i => Decimal.pow(2,i),
			effDesc: x => x.format()+"x",
		}, {
			title: "Telescope",
			desc: `Gain <b class="green">+1x</b> more Observatorium.`,

			res: "measure",
			icon: ['Curr/Observatorium'],

			max: Infinity,
			cost: i => Decimal.pow(2,i).mul(3).ceil(),
			bulk: i => i.div(3).max(1).log(2).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Quad. Rings",
			tier: 2,
			desc: `Gain <b class="green">+1x</b> more Rings.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

			res: "measure",
			icon: ['Curr/Ring'],

			max: Infinity,
			cost: i => Decimal.pow(1.2,i).mul(30).ceil(),
			bulk: i => i.div(30).max(1).log(1.2).floor().toNumber()+1,

			effect: i => Decimal.pow(2,Math.floor(i/25)).mul(i+1),
			effDesc: x => x.format()+"x",
		}, {
			title: "Quad. Astro",
			tier: 2,
			desc: `<b class='green'>Double</b> Astrolabe.`,

			res: "measure",
			icon: ['Curr/Astrolabe'],

			max: Infinity,
			cost: i => Decimal.pow(5,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(5).floor().toNumber()+1,

			effect: i => Decimal.pow(2,i),
			effDesc: x => x.format()+"x",
		}
	],
}

tmp_update.push(_=>{
	if (!player.planetoid) return

	let data = tmp.plRes
	data.aGain = plMAIN.reset.aGain()
	data.aGainP = upgEffect("res", 15, 0)

	data.mGain = plMAIN.reset.mGain()
	data.mGainP = upgEffect("res", 18, 0)

	//Trial
	let i = 0
	while (player.planetoid.tSpent >= TRIAL.time.threshold[i]) i++
	data.trial_left = TRIAL.time.threshold[i]
	data.trial_gain = TRIAL.time.threshold.length - i
})

//Planetary Trials
const TRIAL = {
	step: x => x >= 200 ? Math.floor((x / 10 - 20) ** 0.8 + 1) : 0,
	next: x => Math.ceil(x ** 1.25 * 10 + 200),
	onLevel(old, lvl) {
		let ts = player.planetoid.trial
		if (lvl < ts.best) return

		old = Math.max(old, ts.best)
		ts.best = lvl

		ts.gain += (this.step(lvl) - this.step(old)) * tmp.plRes.trial_gain
	},
	time: {
		threshold: [5,10,30,60,120,180,1/0],
		set(x) {
			player.planetoid.time = Math.min(player.planetoid.time, x)
		}
	},
	checkpoint: {
		set() {
			let plSave = player.planetoid
			if (!plSave.started) return
			plSave.trial.cp = {
				time: player.planetoid.time,
				tSpent: player.planetoid.tSpent,
				obs: player.planetoid.obs,
				obs_upg: player.upgs.obs ?? [],
				m: player.planetoid.measure,
				m_upg: player.upgs.measure ?? [],
			}
		},
		go() {
			let plSave = player.planetoid
			if (!plSave.trial.cp) return
			if (!plSave.started) {
				endPlanetoidTrial()
				startPlanetoidTrial()
			}

			plSave.time = plSave.trial.cp.time
			plSave.tSpent = plSave.trial.cp.tSpent
			plSave.obs = E(plSave.trial.cp.obs)
			player.upgs.obs = plSave.trial.cp.obs_upg
			plSave.measure = E(plSave.trial.cp.m)
			player.upgs.measure = plSave.trial.cp.m_upg
		},
	}
}

MILESTONE.pt = {
	unl: _ => hasAGHMilestone(20),
	req: _ => player.planetoid?.trial.unl,
	reqDesc: "Reach Cosmic 200.",

	res: _ => player.planetoid?.trial.lvl,
	title(x) {
		let plSave = player.planetoid
		let trial = plSave.trial, started = plSave.started
		let h = format(x, 0)
		if (started) h = format(trial.gain, 0) + " / " + h
		h = `You've expeded <b class='green'>${h}</b> Planetaries.`
		if (started) h += `(Next: Cosmic ${format(TRIAL.next(TRIAL.step(plSave.level)), 0)}, +${tmp.plRes.trial_gain} for ${tmp.plRes.trial_left == 1/0 ? "forever" : formatTime(tmp.plRes.trial_left - plSave.tSpent)})`
		return h
	},
	title_ms: x => x,

	milestone: [
		{
			req: 2,
			desc: `Every 5 tiers in Unnatural Realm (at Tier 10), Tier base <b class='green'>multiplies</b> Momentum.`,

			eff(i) {
				if (player.unRes.tier < 10) return E(1)
				return E(MAIN.tier.base(2)).pow(Math.floor((player.unRes.tier - 10) / 5 + 1))
			},
			effDesc: x => format(x) + "x"			
		}, {
			req: 4,
			desc: `Unnatural Healing <b class='green'>boosts</b> XP.`
		}, {
			req: 6,
			desc: `<b class='green'>Double</b> Cloud production gain.`
		}, {
			req: 8,
			desc: `<b class='green'>Unlock</b> Grass-Jumps.`
		}, {
			req: 10,
			desc: `<b class='green'>Quadruple</b> Space Power.`,	
		}, {
			req: 12,
			desc: `<b class='green'>Unlock</b> the Lunar Obelisk.`
		}, {
			req: 14,
			desc: `<b class='green'>Double</b> Lunar Power.`,
		}, {
			req: 17,
			desc: `<b class='green'>+1</b> Lunar Power active slot.`	
		}, {
			req: 20,
			desc: `<b class='green'>Unlock</b> Constellations. [Soon!]`
		},
	],
}

//HTML
el.update.planetoid = _=>{
	let on = inPlanetoid()
	tmp.el.time_left.setDisplay(on)
	if (on) {
		tmp.el.level_top_info.setHTML(`Cosmic <b class="magenta">${format(tmp.realm.src.level,0)}</b>`)

		tmp.el.time_left_bar.changeStyle("width",player.planetoid.time/getPlanetoidTrialTime()*100+"%")
		tmp.el.time_left_info.setHTML(`Time: <b class="red">${formatTime(player.planetoid.time)}</b>`)
	}

	if (mapID == 'g') {
		tmp.el.levels_info.setDisplay(!on)
		tmp.el.formations.setDisplay(on)
		updateUpgradesHTML('planetarium')
		if (!on) return

		for (let [i, form] of Object.entries(plMAIN.form)) {
			tmp.el["formation_"+i].setHTML(compute(form.req) ? `<u>${form.title}</u><br>${form.desc}` : compute(form.reqDesc))
			tmp.el["formation_"+i].setClasses({ locked: !compute(form.req), chosen: inFormation(i) })
		}
	}
	if (mapID == 'sac') updateResetHTML('planetoid')
	if (mapID == 'dc') updateResetHTML('planetoid_earth')

	if (!on) return
	if (mapID == "ring") {
		updateResetHTML('planetoid_exit')
		updateResetHTML('planetoid_trial')
		tmp.el.reset_btn_planetoid_trial.setTxt(player.planetoid.started ? "End Early" : "Start")
		tmp.el.planetoid_pause.setDisplay(hasUpgrade("res", 21))
		tmp.el.planetoid_pause.setTxt(player.planetoid.pause ? "Resume" : "Pause")
		tmp.el.planetoid_trial.setTxt(formatTime(getPlanetoidTrialTime()))

		updateUpgradesHTML("ring")
		updateUpgradesHTML('obs')
		updateUpgradesHTML('res')
	}
	if (mapID == 'astro') {
		updateResetHTML('astro')
		updateResetHTML('quadrant')

		updateUpgradesHTML('astro')
		updateUpgradesHTML('measure')
	}
	if (mapID == 'trial') {
		let cp = player.planetoid.trial.cp
		updateMilestoneHTML('pt')
		tmp.el.trial_cp_div.setDisplay(hasUpgrade("res", 24))
		tmp.el.trial_cp_set.setClasses({ locked: !player.planetoid.started })
		tmp.el.trial_cp_go.setClasses({ locked: !cp })
		tmp.el.trial_cp.setHTML(cp ?
			`Measure: ${format(cp.m)}, Observatorium: ${format(cp.obs)}`
		: "")
	}
}

//COSMETIC CHANGES
function onPlanetoidSwitch() {
	let on = mapPos.dim == "planetoid"
	if (on != inPlanetoid()) {
		resetGrasses()
		player.decel = on ? 3 : 0
	}

	new Element("level").setClasses({ cosmic: on })
	new Element("planet_bg").setDisplay(on)
	document.getElementById("grass").setAttribute("src", on ? "images/Curr/Planetarium.png" : "images/grass.png")
	document.getElementById("grass_canvas").style.background = on ? "#50b" : ""
	document.getElementById("grass_cap_div").style.background = on ? "#70f" : ""
}