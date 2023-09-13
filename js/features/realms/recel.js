function inRecel() {
	return player.decel >= 2
}

function setupRecel() {
	return {
		grass: E(0),

		level: 0,
		xp: E(0),

		tier: 0,
		tp: E(0),

		np: E(0),
		nTimes: 0,
		nTime: 0,

		cloud: E(0),
		cloudProd: E(0),
		vTimes: 0,
		vTime: 0,
	}
}

REALMS.recelOnly = {
	on: r => r == 2,
	grass: _ => E(1e-6),
	xp: _ => E(1e-8).mul(getEffect("uh", "xp")),
	tp: _ => E(1e-5).mul(getEffect("uh", "tp")),
}
MAIN.recel = unMAIN = {}

RESET.recel = {
	unl: _=>MAIN.sac.did(),

	req: _=>hasUpgrade("funMachine", 3),
	reqDesc: _=>"Get 'Recelerator' upgrade in Fun Machine.",

	resetDesc: `Nullify boosts that Funify resets until you Accelerate. Charger doesn't work.`,
	resetGain: _ => keepAccelOnDecel() ? `Progress will be saved.` : `This will force a Steelie.`,

	title: `Recelerator`,
	resetBtn: `Recelerate`,
	hotkey: `Shift+T`,

	reset(force=false) {
		if (inPlanetoid()) return
		if (!hasUpgrade("funMachine", 3)) return
		if (!player.unRes) player.unRes = setupRecel()
		switchRealm(2)
	},
}

el.update.recel = _=>{
	if (mapID == 'g') tmp.el.habit.setHTML(tmp.unRes?.habit ? "(x"+format(tmp.unRes.habit.max,1)+")" : '')
	if (mapID == 'upg') {
		tmp.el.unnatural_healing.setDisplay(inRecel())
		updateEffectHTML("uh")
	}
	if (mapID == "dc") tmp.el.reset_btn_recel.setTxt("(Shift+T) " + (player.decel == 2 ? "Accelerate" : "Recelerate"))
}

UPGS.unGrass = {
	unl: _=> player.decel == 2,

	title: "Unnatural Upgrades",

	autoUnl: _=>hasUpgrade('res', 3),
	noSpend: _=>hasUpgrade('res', 3),

	ctn: [
		{
			max: Infinity,

			title: "Habitability",
			desc: `Touching instead gives a temporal boost to grass value. Left-click to cut some touched grasses.`,

			res: "unGrass",
			icon: ['Icons/Compaction'],
			
			cost: i => Decimal.pow(4,i).mul(20),
			bulk: i => i.div(20).max(1).log(4).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x value",
		}, {
			max: 100,

			title: "Naturalness",
			desc: `Raise Astral XP effect by <b class='green'>^+0.01</b> in Normal and Anti-Realms.`,

			res: "unGrass",
			icon: ['Icons/XP'],

			cost: i => Decimal.pow(1.5,i+8).ceil(),
			bulk: i => i.log(1.5).sub(8).add(1).floor().toNumber(),

			effect: i => i/100+1,
			effDesc: x => "^"+format(x),
		}, {
			max: 10,

			title: "Ranged Out",
			desc: `Increase range by <b class="green">+10</b>.`,

			res: "unGrass",
			icon: ['Icons/Range'],
			
			cost: i => Decimal.pow(10,i).mul(50),
			bulk: i => i.div(50).max(1).log10().floor().toNumber()+1,

			effect(i) {
				return i*10
			},
			effDesc: x => "+"+format(x,1),
		}, {
			max: _ => getEffect("uh", "sp", 0),

			title: "Glided Power",
			desc: `<b class="green">Double</b> Space Power.`,

			res: "unGrass",
			icon: ['Icons/SP', 'Icons/Plus'],

			cost: i => Decimal.pow(80,i+1),
			bulk: i => i.max(1).log(80).floor().toNumber(),

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			max: _ => getEffect("uh", "fun", 0),

			title: "Glided Fun",
			desc: `<b class="green">Double</b> Fun.`,

			res: "unGrass",
			icon: ['Curr/Fun', 'Icons/Plus'],

			cost: i => Decimal.pow(50,i+1),
			bulk: i => i.max(1).log(50).floor().toNumber(),

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}
	],
}

EFFECT.uh = {
	unl: _ => hasUpgrade("funMachine", 3),
	title: r => `<b style="color: #bf7">Unnatural Healing: </b> ${format(r, 0)}<br>
		<span class="smallAmt">Gain more Unnatural Healing by proceeding outside of this Realm.</span><br>`,
	res: _ => tmp.unRes.healing,
	effs: {
		sp: {
			eff: x => Math.ceil(x / 4),
			desc: x => `<b style="color: #bf7">${format(x, 0)}</b> max levels for "Gilded Power"`,
		},
		fun: {
			eff: x => Math.ceil(x / 4),
			desc: x => `<b style="color: #bf7">${format(x, 0)}</b> max levels for "Gilded Fun"`,
		},
		hb: {
			eff: x => x / 2 + 1,
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Habitability growth`,
		},
		hm: {
			eff: x => x / 2 + 1,
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Habitability starting value`,
		},
		tp: {
			eff: x => x / 2 + 1,
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Tier Points in Unnatural Realm`,
		},
		np: {
			unl: _ => player.unRes?.nTimes,
			eff: x => E(3).pow(x/10),
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Normality Points`,
		},
		xp: {
			unl: _ => hasMilestone("pt", 1),
			eff: x => E(1.05).pow(x),
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to XP in Unnatural Realm`,
		}
	}
}

/* HABITABILITY */
unMAIN.habit = {
	speed() {
		let r = E(2)
		r = r.mul(getEffect("uh", "hb"))
		r = r.mul(upgEffect("np", 1))
		r = r.mul(upgEffect("obs", 2))
		r = r.mul(upgEffect("cloud", 0))
		r = r.mul(upgEffect("ring", 2))
		if (hasUpgrade('res', 5)) r = r.max(tmp.unRes.habit.max.div(2))

		if (inFormation("dr")) r = r.mul(4)
		if (inFormation("sc")) r = r.div(4)
		return r
	},
	startingMult() {
		let r = E(getEffect("uh", "hm"))
		if (inFormation("hs")) r = r.max(tmp.unRes.habit.max.div(2))
		return r
	},

	max() {
		let r = E(upgEffect("unGrass", 0))
		r = r.mul(upgEffect("np", 0))
		r = r.mul(upgEffect("cloud", 0))
		r = r.mul(upgEffect("ring", 2))
		return r
	},
	progress(g) {
		return g.habit.sub(1).div(tmp.unRes.habit.max.sub(1)).min(1)
	},

	tick(dt, click) {
		let t = tmp.unRes.habit
		for (var [i, g] of Object.entries(tmp.grasses).reverse()) {
			if (!g.habit) continue

			let maxed
			g.habit = g.habit.add(t.speed.mul(dt))
			if (g.habit.gte(t.max)) {
				g.og += dt
				if (t.og == 0) g.habit = t.max
				if (g.og >= t.og) maxed = true
			}
			if (maxed || click) removeGrass(i)
		}
	},
	destroy() {
		this.tick(0, true)
	}
}

tmp_update.push(_=>{
	let data = tmp.unRes
	data.habitAuto = E(1)
	if (!player.unRes) return

	data.healing = upgEffect('momentum', 10, 0) + upgEffect("sfrgt", 5, 0) + getAstralEff("uh", 0)

	data.habit = {}
	let max = data.habit.max = unMAIN.habit.max()
	data.habit.on = unMAIN.habit.max()
	data.habit.start = unMAIN.habit.startingMult()
	data.habit.speed = unMAIN.habit.speed()
	data.habit.og = hasGJMilestone(3) ? 0.2 : 0
	data.habitAuto = E(data.habit.max).mul(starTreeEff("qol", 16, 0) + upgEffect("res", 4, 0)).max(1)

	//Resets
	data.npGain = unMAIN.np.gain()
	data.npGainP = upgEffect('res', 6, 0)

	data.clGain = unMAIN.vapor.gain()
})

/* NORMALITY */
unMAIN.np = {
	gain() {
		if (!player.unRes) return E(0)

		let r = E(1.05).pow(player.unRes.level - 20)
		r = r.mul(E(1.05).pow(player.gal.astral - 20))
		r = r.mul(getEffect("uh", "np"))
		r = r.mul(upgEffect('momentum', 13))
		r = r.mul(upgEffect("cloud", 1))
		r = r.mul(upgEffect("ring", 8))
		r = r.mul(getAstralEff("cl"))
		if (hasGJMilestone(1)) r = r.mul(getGJEffect(1))
		return r.max(1).floor()
	},
}
RESET.np = {
	unl: _=>player.decel==2,

	req: _=>player.unRes.level>=30,
	reqDesc: `Reach Level 30.`,

	resetDesc: `Reset your unnatural grass, level, and astral for Normality Points.`,
	resetGain: _=> `<b>+${tmp.unRes.npGain.format(0)}</b> Normality Points`,

	title: `Normality`,
	resetBtn: `Normality...`,
	hotkey: `P`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			player.unRes.np = player.unRes.np.add(tmp.unRes.npGain)
			player.unRes.nTimes++
		}
		this.doReset()
	},

	doReset(order="n") {
		player.unRes.nTime = 0

		player.unRes.grass = E(0)
		player.unRes.xp = E(0)
		player.unRes.level = 0
		player.gal.sp = E(0)
		player.gal.astral = 0

		resetUpgrades('unGrass')
		resetGrasses()
		updateTemp()
	},
}
UPGS.np = {
	unl: _=>player.decel==2,

	title: "Normality Upgrades",

	req: _=>player.unRes?.nTimes > 0,
	reqDesc: `Normality once to unlock.`,

	underDesc: _=>getUpgResTitle('np') + gainHTML(tmp.unRes.nGainP, tmp.unRes.nGain),

	autoUnl: _=>hasUpgrade('res', 7),
	noSpend: _=>hasUpgrade('res', 7),

	ctn: [
		{
			max: Infinity,

			title: "Habited",
			tier: 2,
			desc: `Habitability grows higher.`,

			res: "np",
			icon: ['Icons/Compaction', "Icons/Plus"],

			cost: i => Decimal.pow(3,i),
			bulk: i => i.log(3).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: Infinity,

			title: "Rapid Grow",
			desc: `Habitability grows faster.`,

			res: "np",
			icon: ['Icons/Compaction', "Icons/StarSpeed"],

			cost: i => Decimal.pow(10,i).ceil(),
			bulk: i => i.log10().floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: Infinity,

			title: "NP Dark Matter",
			desc: `<b class="green">Double</b> Dark Matter.`,

			res: "np",
			icon: ['Curr/DarkMatter'],

			cost: i => Decimal.pow(5,i*3+1).ceil(),
			bulk: i => i.max(1).log(5).sub(1).div(3).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "NP Momentum",
			desc: `<b class="green">Double</b> Momentum.`,

			unl: _ => tmp.rocket_upgraded,
			res: "np",
			icon: ["Curr/Momentum"],
			
			cost: i => Decimal.pow(5,i**1.25+2).ceil(),
			bulk: i => i.max(1).log(5).sub(2).root(1.25).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "NP Clouds",
			desc: `Gain <b class="green">+1x</b> more Clouds.`,

			unl: _ => player.unRes?.vTimes,
			res: "np",
			icon: ["Curr/Cloud"],
			
			cost: i => Decimal.pow(10,i).mul(1e7).ceil(),
			bulk: i => i.div(1e7).max(1).log(10).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}
	],
}

//Vaporize
unMAIN.vapor = {
	gain() {
		if (!player.unRes) return E(0)

		let r = E(1.5).pow(player.unRes.tier - 15).max(1)
		r = r.mul(upgEffect('np', 4))
		if (hasUpgrade("ring", 11)) r = r.mul(upgEffect("ring", 11))
		if (hasMilestone("pt", 2)) r = r.mul(2)
		r = r.mul(lunarEff(2))
		if (hasGJMilestone(2)) r = r.mul(2)
		return r.floor()
	},
}
RESET.vapor = {
	unl: _=>player.decel==2,

	req: _=>player.unRes.level>=90,
	reqDesc: `Reach Level 90.`,

	resetDesc: `Reset Normality does, and so NP and Tier for Cloud production.`,
	resetGain: _=> `<b>${tmp.unRes.clGain.format(0)}</b> Clouds/s`,

	title: `Vaporize`,
	resetBtn: `Evaporate...`,
	hotkey: `P`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			player.unRes.cloudProd = player.unRes.cloudProd.max(tmp.unRes.clGain)
			player.unRes.vTimes++
		}
		this.doReset()
	},

	doReset(order="v") {
		player.unRes.vTime = 0

		player.unRes.tp = E(0)
		player.unRes.tier = 0
		player.unRes.np = E(0)
		resetUpgrades('np')

		RESET.np.doReset(order)
	},
}
UPGS.cloud = {
	unl: _=>player.decel==2,

	title: "Cloudy Upgrades",

	req: _=>player.unRes?.vTimes > 0,
	reqDesc: `Vaporize once to unlock.`,

	underDesc: _=>getUpgResTitle('cloud') + gainHTML(1, player.unRes.cloudProd),

	autoUnl: _=>hasUpgrade('res', 9),
	noSpend: _=>hasUpgrade('res', 9),

	ctn: [
		{
			title: "Habited II",
			tier: 3,
			desc: `Habitability grows <b class='green'>+1x</b> higher. This affects speed too.`,

			res: "cloud",
			icon: ['Icons/Compaction', "Icons/Plus"],

			max: Infinity,
			cost: i => Decimal.pow(5,i).mul(100),
			bulk: i => i.div(100).max(1).log(5).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Cloudy NP",
			desc: `<b class="green">Double</b> Normality Points.`,

			res: "cloud",
			icon: ["Curr/Normality"],

			max: Infinity,
			cost: i => Decimal.pow(3,i).mul(200),
			bulk: i => i.div(200).max(1).log(3).floor().toNumber()+1,

			effect: i => E(2).pow(i),
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Planetoid Atmosphere",
			desc: `Planetarium upgrade is better.`,

			res: "cloud",
			icon: ["Curr/Planetarium", "Icons/Plus"],

			max: 8,
			cost: i => Decimal.pow(2,i).mul(1e3),
			bulk: i => i.div(1e3).max(1).log(2).floor().toNumber()+1,

			effect: i => i/400,
			effDesc: x => `15% -> ${format(x*100+15)}% compounding`
		}, {
			title: "Planetoid Atmosphere II",
			desc: `Cosmic upgrade is better.`,

			res: "cloud",
			icon: ["Icons/Cosmic", "Icons/Plus"],

			max: 7,
			cost: i => Decimal.pow(2,i).mul(2e3),
			bulk: i => i.div(2e3).max(1).log(2).floor().toNumber()+1,

			effect: i => i/200,
			effDesc: x => `15% -> ${format(x*100+15)}% compounding`
		}, {
			title: "Cloudy Rings",
			desc: `<b class="green">Double</b> Rings.`,

			res: "cloud",
			icon: ["Curr/Ring"],

			max: Infinity,
			cost: i => Decimal.pow(3,i).mul(5e3),
			bulk: i => i.div(5e3).max(1).log(3).floor().toNumber()+1,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x"
		}
	],
}

//GRASS JUMPS
unMAIN.gj = {
	req: _ => 200+player.unRes?.grassjump*10,
	bulk: _ => Math.floor((player.unRes?.level-200)/10) + 1,
}

MILESTONE.gj = {
	unl: _ => tmp.unRes.gj.shown,
	req: _ => grassJumped(),
	reqDesc: "Grass-Jump to unlock.",

	res: _ => player.unRes?.grassjump,
	title: x => `You have grass-jumped <b class='green'>${format(x, 0)}</b> times`,
	title_ms: x => x,

	milestone: [
		{
			req: 1,
			desc: `<b class='green'>Triple</b> Space Power per Grass-Jump. Unlock new Ring upgrades.`,

			eff: i => E(3).pow(i),
			effDesc: x => format(x, 0) + "x"	
		}, {
			req: 2,
			desc: `<b class='green'>Double</b> Normality Points per Grass-Jump.`,

			eff: i => E(2).pow(i),
			effDesc: x => format(x, 0) + "x"
		}, {
			req: 3,
			desc: `<b class='green'>Double</b> Cloud production gain.`
		}, {
			req: 4,
			desc: `Habitability can overgrow for 0.2s after maximum.`,	
		}, {
			req: 5,
			desc: `<b class='green'>+1x</b> Planetarium per Grass-Jump, starting at 4.`,

			eff: i => Math.max(i - 3, 0) + 1,
			effDesc: x => format(x, 0) + "x"
		}, {
			req: 6,
			desc: `<b class='green'>+0.25%</b> to Cosmic compounding effect.`
		}
	],
}

function grassJumped() {
	return player.unRes?.grassjump
}
function hasGJMilestone(x) { return hasMilestone("gj", x) }
function getGJEffect(x,def=1) { return getMilestoneEff("gj", x, def) }

RESET.gj = {
	unl: _=>tmp.unRes.gj.shown,
	req: _=>player.unRes.level>=200,
	reqDesc: `Reach Level 200.`,

	resetDesc: `Reset everything Vaporize does, and so Clouds.`,
	resetGain: _ => grassJumped() ? `Reach Level <b>${format(tmp.unRes.gj.req,0)}</b> to Grass-Jump` : ``,

	title: `Grass-Jump`,
	btns: `
		<button id="multGJBtn" onclick="player.gjMult = !player.gjMult">Multi: <span id="multGJOption">OFF</span></button>
		<button id="autoGJBtn" onclick="player.gjAuto = !player.gjAuto">Auto: <span id="autoGJOption">OFF</span></button>
	`,
	resetBtn: `Grass-Jump...`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.unRes.level < unMAIN.gj.req()) return
		}

		if (force) {
			this.gainAndReset()
		} else if (!tmp.gh.running) {
			tmp.gh.running = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.gainAndReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.unRes.gj.running = false
			},2000)
		}
	},

	gainAndReset() {
		let res = unMAIN.gj.bulk()
		if (!player.gjMult) res = Math.min(res, player.unRes.grassjump + 1)

		player.unRes.grassjump = res
		this.doReset()
	},

	doReset(order="gj") {
		player.unRes.vTime = 0
		player.unRes.cloud = E(0)
		player.unRes.cloudProd = E(0)
		resetUpgrades("cloud")

		RESET.vapor.doReset(order)
	},
}

tmp_update.push(_=>{
	tmp.unRes.gj.shown = hasMilestone("pt", 3) && player.decel == 2
	tmp.unRes.gj.req = unMAIN.gj.req()
})

el.update.gj = _=>{
	let unl = tmp.unRes.gj.shown
	if (mapID == 'gh' && unl) {
		tmp.el.reset_btn_gj.setClasses({locked: player.unRes.level < tmp.unRes.gj.req})

		tmp.el.multGJBtn.setDisplay(false)
		tmp.el.multGJOption.setTxt(player.gjMult ? "ON" : "OFF")

		tmp.el.autoGJBtn.setDisplay(false)
		tmp.el.autoGJOption.setTxt(player.gjAuto?"ON":"OFF")
	}
	updateMilestoneHTML("gj")
}

function changeGJMult() { player.gjMult = !player.gjMult }

//FULL RESET
function resetUnnaturalRealm() {
	player.unRes.vTime = 0
	player.unRes.cloud = E(0)
	player.unRes.cloudProd = E(0)
	player.unRes.grassjump = 0
	resetUpgrades("cloud")

	RESET.vapor.doReset()
}