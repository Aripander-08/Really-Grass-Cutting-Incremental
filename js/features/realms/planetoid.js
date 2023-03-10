function setupPlanetoid() {
	return {
		grass: E(0),
		level: 0,
		xp: E(0),

		time: 0,
		combo: 0,
		form: "no",

		astro: E(0),
		aTimes: 0,

		obs: E(0),
		res: E(0),
		ring: E(0)
	}
}
REALMS.planetoid = {
	on: r => r == 3,
	grass() {
		let x = E(1)
		x = x.mul(upgEffect('planetarium', 0))
		x = x.mul(upgEffect('obs', 0))
		x = x.pow(upgEffect('astro', 0))
		if (hasUpgrade('ring', 0)) x = x.mul(2)
		if (inFormation("sp")) x = x.mul(3)
		if (inFormation("cm")) x = x.mul(Math.log10(player.planetoid.combo + 10))
		if (inFormation("hs")) x = x.mul(10)
		return x
	},
	xp() {
		let x = E(1/20)
		x = x.mul(upgEffect('planetarium', 1))
		x = x.mul(upgEffect('obs', 1))
		x = x.pow(upgEffect('astro', 1))
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

		let x = E(1.2).pow(cosmic - 10)
		x = x.mul(upgEffect('planetarium', 2))
		x = x.mul(getAstralEff('rg'))
		return x.floor()
	}
}
MAIN.planetoid = plMAIN = {}

RESET.planetoid = {
	unl: _=>hasAGHMilestone(8),

	req: _=>hasAGHMilestone(11),
	reqDesc: _=>"Get 48 Negative Energy.",

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

	req: _=>!player.planetoid.started,
	reqDesc: _=>"You can't return unless you end the time trial!",

	resetDesc: `Traverse back to the Earth. You'll gain reaccess to Earth and Space content.`,
	resetGain: _=> ``,
	hotkey: `N`,

	title: `Landing Site`,
	resetBtn: `Return to Earth`,

	reset(force=false) {
		if (player.planetoid.started) return
		switchDim("earth")
	},
}
function inPlanetoid() {
	return player.decel == 3
}

UPGS.planetarium = {
	title: "Planetarium Upgrades",

	unl: _=>inPlanetoid(),
	autoUnl: _=>hasUpgrade("res",3),

	ctn: [
		{
			title: "Planetarium",
			desc: `Gain <b class="green">+1x</b> more Planetarium.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

			res: "planetarium",
			icon: ['Curr/Planetarium'],

			max: Infinity,
			cost: i => Decimal.pow(1.25,i).mul(500).ceil(),
			bulk: i => i.div(500).max(1).log(1.25).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

				return x
			},
			effDesc: x => x.format()+"x",
		}, {
			title: "Cosmic",
			desc: `Gain <b class="green">+1x</b> more Cosmic.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

			res: "planetarium",
			icon: ['Icons/Cosmic'],
			
			max: Infinity,
			cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

				return x
			},
			effDesc: x => x.format()+"x",
		}, {
			max: Infinity,

			title: "Rings",
			desc: `Gain <b class="green">+1x</b> more Rings.`,

			res: "planetarium",
			icon: ['Curr/Ring'],

			max: 20,
			cost: i => Decimal.pow(2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(2).floor().toNumber()+1,

			effect(i) {
				return i/10+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			title: "Planetoid Grow",
			desc: `Grass grows <b class="green">+0.2x</b> faster in Planetoid.`,

			res: "planetarium",
			icon: ['Icons/Speed'],

			max: 20,
			cost: i => Decimal.pow(1.5,i).mul(2e3).ceil(),
			bulk: i => i.div(2e3).max(1).log(1.5).floor().toNumber()+1,

			effect(i) {
				let x = i/5

				return x
			},
			effDesc: x => "+"+format(x,1)+"x",
		}, {
			title: "Astrolabe",
			desc: `Gain <b class="green">+1x</b> more Astrolabe.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,
			unl: _ => player.planetoid?.aTimes,

			res: "planetarium",
			icon: ['Curr/Astrolabe'],

			max: Infinity,
			cost: i => Decimal.pow(1.15,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(1.15).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

				return x
			},
			effDesc: x => x.format()+"x",
		}
	],
}

function planetoidTick(dt) {
	if (!inFormation("fz")) player.planetoid.time -= dt * (inFormation("sp") ? 3 : 1)
	player.planetoid.combo /= Math.pow(1.5, dt)

	if (RESET.astro.req()) player.planetoid.astro = player.planetoid.astro.add(tmp.plRes.aGain.mul(tmp.plRes.aGainP*dt))

	if (player.planetoid.time <= 0) endPlanetoidTrial()
}

//Trial: Rings
RESET.planetoid_trial = {
	unl: _=>inPlanetoid(),

	req: _=>true,
	reqDesc: _=>"",

	resetDesc: `You have 5 minutes to reach Level 10 for Rings.<br><br>When time's up, Planetarium, Observatorium (not Observatory), and respective layers will be resetted!`,
	resetGain: _=> player.planetoid.started ? `
		Time: ${formatTime(player.planetoid.time)}<br>
		+${format(REALMS.planetoid.ring(),0)} Rings
	` : ``,
	hotkey: `N`,

	title: `Hazard Warning...`,
	resetBtn: ``,

	reset(force=false) {
		if (player.planetoid.started) endPlanetoidTrial()
		else startPlanetoidTrial()
	},
}
function startPlanetoidTrial() {
	player.planetoid.started = true
	player.planetoid.time = 300
}
function endPlanetoidTrial() {
	player.planetoid.ring = player.planetoid.ring.add(REALMS.planetoid.ring())
	player.planetoid.started = false

	player.planetoid.astro = E(0)
	resetUpgrades("astro")

	RESET.astro.doReset("ring")
}

UPGS.ring = {
	title: "Ring Chart",
	underDesc: _=>getUpgResTitle('ring'),

	unl: _=>inPlanetoid(),
	autoUnl: _=>false,
	noSpend: _=>false,

	ctn: [
		{
			title: "Greetings, Planetoid!",
			desc: `<b class='green'>Double</b> Cosmic.`,

			res: "ring",
			icon: ['Curr/Fun', 'Icons/Plus'],
			
			cost: i => E(1),
			bulk: i => 1
		}, {
			max: 10,

			title: "Cosmically XP",
			desc: `Raise 'Astral XP' effect by <b class='green'>+^0.1</b>.`,

			res: "ring",
			icon: ['Icons/XP', 'Icons/StarProgression'],

			max: 20,
			cost: i => E(2).pow(i**1.25+2),
			bulk: i => E(i).log(2).sub(2).root(1.25).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x,1)
		}, {
			max: 10,

			title: "Astral Supercharge",
			desc: `Raise 'Astral Charge' effect by <b class='green'>+^0.1</b>.`,

			res: "ring",
			icon: ['Icons/Charge', 'Icons/StarProgression'],

			max: 10,
			cost: i => E(3).pow(i**1.25+3),
			bulk: i => E(i).log(3).sub(3).root(1.25).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x,1)
		}, {
			max: 20,

			title: "Superfoundry",
			desc: `Raise 'Astral Foundry' effect by <b class='green'>+0.1x</b>.`,

			res: "ring",
			icon: ['Icons/Foundry', 'Icons/StarProgression'],

			max: 10,
			cost: i => E(5).pow(i**1.25+3),
			bulk: i => E(i).log(5).sub(3).root(1.25).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => format(x,1)+"x"
		}, {
			title: "Basically Normal",
			desc: `Gain <b class='green'>+1x</b> more Normality Points.`,

			res: "ring",
			icon: ['Curr/Normality'],

			max: 10,
			costOnce: true,
			cost: i => 100,
			bulk: i => i/100,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Dark and Darker",
			desc: `Gain <b class='green'>+1x</b> more Dark Matter.`,

			res: "ring",
			icon: ['Curr/DarkMatter'],

			max: 10,
			costOnce: true,
			cost: i => 150,
			bulk: i => i/150,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Astral Synergizer",
			desc: `Astral TP effect is <b class='green'>better</b>.`,

			res: "ring",
			icon: ['Icons/TP', 'Icons/StarProgression'],

			cost: i => 1e4,
			bulk: i => 1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Steel Purifier",
			desc: `Raise 1st Charger effect by <b class='green'>+^0.2</b>.`,

			res: "ring",
			icon: ['Curr/Steel', 'Icons/StarProgression'],

			max: 10,
			cost: i => E(10).pow(i/2.5+4.5),
			bulk: i => E(i).log(10).sub(4.5).mul(2.5).floor().toNumber()+1,

			effect: i => i/5+1,
			effDesc: x => "^"+format(x,1)
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
		desc: "Gain 10x more Planetarium. <b class='magenta'>Back to basics.</b>",

		req: _ => player.gal.neg >= 66,
		reqDesc: `Get 66 Negative Energy.`,
	}
}
function switchFormation(x) {
	if (!compute(plMAIN.form[x].req, true)) return
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
		let r = E(1)
		if (inFormation("sp")) r = r.mul(3)
		return r
	},
	chance: _ => 0.02+upgEffect("res",6,0),
	canGetRes: _ => player.planetoid?.aTimes > 0,
}
UPGS.obs = {
	title: "Observatory",
	underDesc: _=>getUpgResTitle('obs')+` (${formatPercent(plMAIN.obs.chance())} grow chance)`,

	unl: _=>inPlanetoid(),
	ctn: [
		{
			title: "Observed Planetarium",
			desc: `Increase Planetarium gain by <b class="green">+1x</b>.`,

			res: "obs",
			icon: ['Curr/Planetarium'],

			max: 5,
			costOnce: true,
			cost: i => 100,
			bulk: i => Math.floor(i/100),

			effect(i) {
				let x = i+1

				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Observed Cosmic",
			desc: `Increase Cosmic gain by <b class="green">+1x</b>.`,

			res: "obs",
			icon: ['Icons/Cosmic'],

			max: 2,
			costOnce: true,
			cost: i => 200,
			bulk: i => Math.floor(i/200),

			effect(i) {
				let x = i+1

				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Observed Habit",
			desc: `Habitability grows <b class="green">+0.2x</b> faster.`,

			res: "obs",
			icon: ['Icons/Compaction'],

			max: 5,
			costOnce: true,
			cost: i => 500,
			bulk: i => Math.floor(i/500),

			effect(i) {
				let x = i/5+1

				return x
			},
			effDesc: x => format(x,1)+"x",
		}, {
			title: "Observed Grow",
			desc: `Grass grows <b class="green">+0.2x</b> faster in Planetoid.`,

			res: "obs",
			icon: ['Icons/Speed'],

			max: 10,
			costOnce: true,
			cost: i => 1e3,
			bulk: i => Math.floor(i/1e3),

			effect(i) {
				let x = i/5

				return x
			},
			effDesc: x => "+"+format(x,1)+"x",
		}, {
			title: "Observed Astro",
			desc: `Increase Astrolabe gain by <b class="green">+1x</b>.`,
			unl: _ => player.planetoid?.aTimes,

			res: "obs",
			icon: ['Curr/Astrolabe'],

			max: 5,
			costOnce: true,
			cost: i => 1e3,
			bulk: i => Math.floor(i/1e3),

			effect(i) {
				let x = i+1

				return x
			},
			effDesc: x => format(x,0)+"x",
		},
	],
}
UPGS.res = {
	title: "Reservatory",
	underDesc: _=>getUpgResTitle('res')+"<span class='smallAmt'> (+1 Reservatorium per Observatorium)</span>",

	unl: _=>inPlanetoid(),
    req: _=>plMAIN.obs.canGetRes(),
    reqDesc: `Use the Astrolabe to unlock.`,

	ctn: [
		{
			title: "Star Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of Stars you would earn per second.`,

			res: "res",
			icon: ['Curr/Star','Icons/Plus'],

			cost: i => E(1e4),
			bulk: i => 1,

			effect: i => i/100,
			effDesc: x => format(x*100,0)+"%",
		}, {
			title: "Star Chart Autobuy",
			desc: `Automate Progression Star Chart.`,

			res: "res",
			icon: ['Curr/Star','Icons/Automation'],

			cost: i => E(2e4),
			bulk: i => 1,
		}, {
			title: "SFRGT Autobuy",
			desc: `Automate SRFGT.`,

			res: "res",
			icon: ['Curr/SuperFun','Icons/Automation'],

			cost: i => E(5e4),
			bulk: i => 1,
		}, {
			title: "Planetarium Autobuy",
			desc: `Automate Planetarium Upgrades.`,

			res: "res",
			icon: ['Curr/Planetarium','Icons/Automation'],

			cost: i => E(1e5),
			bulk: i => 1,
		}, {
			title: "Astrolabe Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of Astrolabe you would earn per second.`,

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Plus'],

			cost: i => E(1e7),
			bulk: i => 1,

			effect: i => i/100,
			effDesc: x => format(x*100,0)+"%",
		}, {
			title: "Astrolabe Autobuy",
			desc: `Automate Astrolabe Upgrades.`,

			res: "res",
			icon: ['Curr/Astrolabe','Icons/Automation'],

			cost: i => E(1e6),
			bulk: i => 1,
		}, {
			title: "Observatory Luck",
			desc: `<b class='green'>+1%</b> chance to Observatorium.`,

			res: "res",
			icon: ['Curr/Observatorium','Icons/StarProgression'],

			max: 5,
			cost: i => E(2).pow(i).mul(1e5),
			bulk: i => E(i).div(1e5).log(2).floor().toNumber()+1,

			effect: i => i/100,
			effDesc: x => format(x*100,0)+"%",
		}
	],
}

//RESET
plMAIN.reset = {
	aGain() {
		let r = E(1.2).pow(player.planetoid.level - 30).mul(10)
		r = r.mul(upgEffect('obs', 3))
		r = r.mul(upgEffect('planetarium', 4))
		return r.floor()
	},
	mGain() {
		let r = E(1.2).pow(player.planetoid.level - 90).mul(15)
		r = r.mul(upgEffect('obs', 4))
		r = r.mul(upgEffect('astro', 2))
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
	autoUnl: _=>hasUpgrade("res",5),

    req: _=>player.planetoid?.aTimes>0,
    reqDesc: `Use the Astrolabe to unlock.`,

	ctn: [
		{
			title: "Astro Planetarium",
			tier: 2,
			desc: `Raise Planetarium by <b class="green">^+0.1</b>.`,

			res: "astro",
			icon: ['Curr/Planetarium'],

			max: 20,
			cost: i => Decimal.pow(3,i**1.25).mul(5).ceil(),
			bulk: i => i.max(1).div(5).log(3).root(1.25).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x,1)
		}, {
			title: "Astro Cosmic",
			tier: 2,
			desc: `Raise Cosmic by <b class="green">^+0.1</b>.`,

			res: "astro",
			icon: ['Icons/Cosmic'],
			
			max: 20,
			cost: i => Decimal.pow(2,i**1.25).mul(3).ceil(),
			bulk: i => i.max(1).div(3).log(2).root(1.25).floor().toNumber()+1,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x,1)
		}
	],
}

RESET.quadrant = {
    unl: _=>inPlanetoid() && player.planetoid.aTimes,

    req: _=>player.planetoid.level>=60,
    reqDesc: `Reach Cosmic 60.`,

	resetDesc: `<b class="red">Coming soon! Wait until this comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=>``,

	title: `Quadrant`,
	resetBtn: `...`,

	reset(force=false) {
		return
	},
}

tmp_update.push(_=>{
	if (!player.planetoid) return

	let data = tmp.plRes
	data.aGain = plMAIN.reset.aGain()
	data.aGainP = upgEffect("res", 4, 0)
	data.mGain = plMAIN.reset.mGain()
	data.mGainP = 0
})

//HTML
el.update.planetoid = _=>{
	let on = inPlanetoid()
	if (on) tmp.el.level_top_info.setHTML(`Cosmic <b class="magenta">${format(tmp.realm.src.level,0)}</b>`)
	tmp.el.time_left.setTxt(player.planetoid?.started ? "Time left: " + formatTime(player.planetoid.time) : "")

	if (mapID == 'g') {
		tmp.el.levels_info.setDisplay(!on)
		tmp.el.formations.setDisplay(on)
		updateUpgradesHTML('planetarium')
		if (!on) return

		for (let [i, form] of Object.entries(plMAIN.form)) {
			tmp.el["formation_"+i].setHTML(compute(form.req, true) ? `<u>${form.title}</u><br>${form.desc}` : compute(form.reqDesc))
			tmp.el["formation_"+i].setClasses({ locked: !compute(form.req, true), chosen: inFormation(i) })
		}
	}
	if (mapID == 'sac') updateResetHTML('planetoid')
	if (mapID == 'dc') updateResetHTML('planetoid_earth')
	if (mapID == 'ring') {
		updateResetHTML('planetoid_exit')
		updateResetHTML('planetoid_trial')
		tmp.el.reset_btn_planetoid_trial.setTxt(player.planetoid.started ? "End Early" : "Start")

		updateUpgradesHTML('ring')
		updateUpgradesHTML('obs')
	}
	if (mapID == 'astro') {
		updateResetHTML('astro')
		updateResetHTML('quadrant')

		updateUpgradesHTML('res')
		updateUpgradesHTML('astro')
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