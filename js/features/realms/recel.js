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
	}
}

REALMS.recelOnly = {
	on: r => r == 2,
	grass: _ => 1e-6,
	xp: _ => 1e-7,
	tp: _ => 1e-6 * getEffect("uh", "tp"),
}
MAIN.recel = unMAIN = {}

RESET.recel = {
	unl: _=>hasAGHMilestone(7),

	req: _=>hasUpgrade("funMachine", 3),
	reqDesc: _=>"Get 33 Negative Energy and a new Upgrade in SFRGT.",

	resetDesc: `Nullify boosts that Funify resets until you Accelerate.`,
	resetGain: _ => keepAccelOnDecel() ? `Progress will be saved.` : `This will force a Steelie.`,

	title: `Recelerator`,
	resetBtn: `Recelerate`,
	hotkey: `Shift+T`,

	reset(force=false) {
		if (inPlanetoid()) return
		if (!player.unRes) player.unRes = setupRecel()
		if (hasUpgrade("funMachine", 3)) switchRealm(2)
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

	autoUnl: _=>false,

	noSpend: _=>false,

	ctn: [
		{
			max: Infinity,

			title: "Habitability",
			desc: `Touching protects cutting and gives a passive growth to their values. Left-click to cut immediately!`,

			res: "unGrass",
			icon: ['Icons/Compaction'],
			
			cost: i => Decimal.pow(4,i).mul(1e3),
			bulk: i => i.div(1e3).max(1).log(4).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x value cap",
		}, {
			max: 100,

			title: "Naturalness",
			desc: `<b>Raise</b> Astral's XP effect in Normal Realm.`,

			res: "unGrass",
			icon: ['Icons/XP'],
			
			cost: i => Decimal.pow(1.3,(i+5)**1.25).ceil(),
			bulk: i => i.log(1.3).root(1.25).sub(5).add(1).floor().toNumber(),

			effect(i) {
				return i/100+1
			},
			effDesc: x => "^"+x,
		}, {
			max: 10,

			title: "Ranged Out",
			desc: `Increase range by <b class="green">+10</b>.`,

			res: "unGrass",
			icon: ['Icons/Range'],
			
			cost: i => Decimal.pow(10,i).mul(1e3),
			bulk: i => i.div(1e3).max(1).log10().floor().toNumber()+1,

			effect(i) {
				return i*10
			},
			effDesc: x => "+"+format(x,1),
		}, {
			max: _ => getEffect("uh", "sp", 0),

			title: "Glided Power",
			desc: `Gain <b class="green">20%</b> more Space Power compounding.`,

			res: "unGrass",
			icon: ['Icons/SP', 'Icons/Plus'],
			
			cost: i => Decimal.pow(5,i).mul(1e3),
			bulk: i => i.div(1e3).max(1).log(5).floor().toNumber()+1,

			effect(i) {
				return E(1.2).pow(i)
			},
			effDesc: x => format(x)+"x",
		}, {
			max: _ => getEffect("uh", "fun", 0),

			title: "Glided Fun",
			desc: `Gain <b class="green">30%</b> more Fun compounding.`,

			res: "unGrass",
			icon: ['Curr/Fun', 'Icons/Plus'],
			
			cost: i => Decimal.pow(5,i).mul(1e3),
			bulk: i => i.div(1e3).max(1).log(5).floor().toNumber()+1,

			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => format(x)+"x",
		}
	],
}

EFFECT.uh = {
	unl: _ => player.unRes,
	title: r => `<b style="color: #bf7">Unnatural Healing: </b> ${format(r, 0)}<br>
		<span class="smallAmt">Gain more Unnatural Healing by proceeding outside of Unnatural Realm.</span><br>`,

	res: _ => upgEffect('momentum', 10, 0) + getAstralEff("uh", 0) + getGSEffect(11, 0),
	effs: {
		sp: {
			eff: x => Math.ceil(x / 3),
			desc: x => `<b style="color: #bf7">${format(x, 0)}</b> max levels for "Gilded Power"`,
		},
		fun: {
			eff: x => Math.ceil(x / 3),
			desc: x => `<b style="color: #bf7">${format(x, 0)}</b> max levels for "Gilded Fun"`,
		},
		hb: {
			eff: x => Math.cbrt(x / 2 + 1),
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Habitability growth speed`,
		},
		hm: {
			unl: _ => player.unRes.nTimes,
			eff: x => Math.sqrt(x / 2 + 1),
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Habitability starting value`,
		},
		tp: {
			unl: _ => player.unRes.nTimes,
			eff: x => x/2+1,
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Tier Points in Unnatural Realm`,
		},
		np: {
			unl: _ => player.unRes.nTimes,
			eff: x => E(3).pow(x/10),
			desc: x => `<b style="color: #bf7">${format(x)}x</b> to Normality Points`,
		}
	}
}

/* HABITABILITY */
unMAIN.habit = {
	grow(i, dt) {
		let g = tmp.grasses[i]
		if (!g) return

		g.habit = Math.min(g.habit + dt * tmp.unRes.habit.speed, tmp.unRes.habit.max)
		if (g.habit == tmp.unRes.habit.max) removeGrass(i)
	},
	speed() {
		let r = 5
		r *= getEffect("uh", "hb")
		r *= upgEffect("np", 1)
		r *= upgEffect("obs", 2)
		if (inFormation("dr")) r *= 4
		if (inFormation("sc")) r /= 4
		return r
	},
	startingMult() {
		let r = getEffect("uh", "hm")
		if (inFormation("hs")) r = Math.max(r, tmp.unRes.habit.max / 2)
		return r
	},

	max() {
		let r = upgEffect("unGrass", 0)
		r *= upgEffect("np", 0)
		return r
	},
	progress(g) {
		return (g.habit - 1) / (tmp.unRes.habit.max - 1)
	},

	tick(dt) {
		let grass = tmp.grasses
		for (var [i, g] of Object.entries(grass)) if (g.habit) unMAIN.habit.grow(i, dt)
	},
	destroy() {
		let grass = tmp.grasses
		for (var [i, g] of Object.entries(grass)) if (g.habit) removeGrass(i)
	}
}

tmp_update.push(_=>{
	if (!player.unRes) return

	let data = tmp.unRes
	data.habit = {
		on: unMAIN.habit.max() > 1,
		start: unMAIN.habit.startingMult(),
		speed: unMAIN.habit.max(),
		max: unMAIN.habit.max(),
	}
})

/* NORMALITY */
unMAIN.np = {
	gain() {
		if (!player.unRes) return E(0)

		let r = E(2).pow(player.unRes.level / 20 - 2).max(1)
		r = r.mul(E(1.08).pow(player.gal.astral - 30).max(1))
		r = r.mul(getEffect("uh", "np"))
		r = r.mul(upgEffect('momentum', 13))
		r = r.mul(upgEffect("ring", 4))
		return r.floor()
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
		if (this.req()||force) {
			if (!force) {
				player.unRes.np = player.unRes.np.add(tmp.unRes.npGain)
				player.unRes.nTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="n") {
		player.unRes.nTime = 0

		player.unRes.grass = E(0)
		player.unRes.xp = E(0)
		player.unRes.level = 0
		player.gal.sp = E(0)
		player.gal.astral = 0

		resetUpgrades('unGrass')
		updateTemp()
	},
}
UPGS.np = {
	unl: _=>player.decel==2,

	title: "Normality Upgrades",

	req: _=>player.unRes?.nTimes > 0,
	reqDesc: `Normality once to unlock.`,

	underDesc: _=>getUpgResTitle('np'),

	autoUnl: _=>false,
	noSpend: _=>false,

	ctn: [
		{
			max: Infinity,

			title: "Habited",
			tier: 2,
			desc: `Habitability grows higher.`,

			res: "np",
			icon: ['Icons/Compaction', "Icons/Plus"],
			
			cost: i => Decimal.pow(3,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(3).floor().toNumber()+1,

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
			
			cost: i => Decimal.pow(3,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(3).floor().toNumber()+1,

			effect(i) {
				return i+1
			},
			effDesc: x => format(x,1)+"x",
		}, {
			max: 5,

			title: "NP Dark Matter",
			desc: `<b class="green">Double</b> Dark Matter.`,

			res: "np",
			icon: ['Curr/DarkMatter'],
			
			cost: i => Decimal.pow(4,i).mul(50).ceil(),
			bulk: i => i.div(50).max(1).log(4).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}, {
			max: Infinity,

			title: "NP Momentum",
			desc: `<b class="green">Double</b> Momentum.`,

			unl: _ => ROCKET_PART.upgraded(),
			res: "np",
			icon: ["Curr/Momentum"],
			
			cost: i => Decimal.pow(3,i**1.25).mul(150).ceil(),
			bulk: i => i.div(150).max(1).log(3).root(1.25).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x,0)+"x",
		}
	],
}

tmp_update.push(_=>{
	tmp.unRes.npGain = unMAIN.np.gain()
})

//Vaporize
RESET.vapor = {
	unl: _=>player.decel==2,

	req: _=>player.unRes.level>=100,
	reqDesc: `Reach Level 100.`,

	resetDesc: `<b class="red">Coming soon! Wait until this comes out in RGCI or I got Lethal's permission.</b>`,
	resetGain: _=>``,

	title: `Vaporize`,
	resetBtn: `...`,

	reset(force=false) {
		return
	},
}

//FULL RESET
function resetUnnaturalRealm() {
	player.unRes.grass = E(0)
	resetUpgrades("unGrass")

	player.unRes.xp = E(0)
	player.unRes.level = 0
	player.unRes.tp = E(0)
	player.unRes.tier = 0

	player.unRes.np = E(0)
	player.unRes.nTime = 0
	resetUpgrades("np")

	//post-Vaporize goes here.
}