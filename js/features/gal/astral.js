el.update.astral = _=>{
	//Astral
	let astral_unl = galUnlocked()
	tmp.el.astral.setDisplay(astral_unl && inSpace())
	if (astral_unl) {
		tmp.el.astral_top_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
		tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${ASTRAL.title()}</b>`)
	}
	if (mapID == 'g' && !inPlanetoid()) {
		tmp.el.astral_div.setDisplay(astral_unl)
		if (astral_unl) {
			tmp.el.astral_amt.setTxt(ASTRAL.title())
			tmp.el.astral_progress.setTxt(player.gal.sp.sub(tmp.gal.astral.prevReq).max(0).format(0)+" / "+tmp.gal.astral.curReq.format(0)+" SP")
			tmp.el.astral_bar.changeStyle("width",tmp.gal.astral.progress*100+"%")
			tmp.el.astral_cut.setTxt("+"+tmp.gal.astral.gain.format(1)+" SP/cut")
		}
	}
	if (mapID == 'at') updateEffectHTML('astral')
}

const ASTRAL = {
	spGain() {
		let r = E(1)
		r = r.mul(getChargeEff(7))
		r = r.mul(upgEffect('momentum', 12))
		if (hasStarTree("progress", 8)) r = r.mul(starTreeEff("progress", 8))
		if (hasStarTree("progress", 9)) r = r.mul(starTreeEff("progress", 9))
		r = r.mul(upgEffect('moonstone', 2))
		r = r.mul(getGSEffect(1))
		r = r.mul(upgEffect('sfrgt', 2))
		r = r.mul(upgEffect("unGrass", 3))
		r = r.mul(upgEffect("ring", 6))
		r = r.mul(lunarEff(1))
		if (hasGJMilestone(0)) r = r.mul(getGJEffect(0))
		if (hasMilestone("pt", 4)) r = r.mul(4)

		if (player.gal.astral_pres) r = r.root(tmp.gal.astral.scale).div(E(1e3).pow(player.gal.astral_pres))

		return r
	},

	req(lvl) {
		if (!galUnlocked()) return EINF
		if (lvl < 0) return 0
		return E(2).pow(lvl ?? player.gal.astral).mul(1e3)
	},
	bulk() {
		if (!galUnlocked()) return 0
		if (player.gal.sp.lt(1e3)) return 0
		return player.gal.sp.div(1e3).log(2).floor().toNumber() + 1
	},

	title() {
		let data = player.gal
		return (data.astral_pres ? data.astral_pres + "-" : "") + format(data.astral, 0)
	},
}

EFFECT.astral = {
	unl: _ => galUnlocked(),
	title: r => `Astral <b class="magenta">${ASTRAL.title()}</b>`,
	res: _ => {
		return {
			lvl: tmp.gal?.astral?.total,
			pres: player.gal.astral_pres
		}
	},
	effs: {
		gr: {
			unl: _ => hasAGHMilestone(9),
			eff: a => E(1.2).pow((a.lvl - 15) * upgEffect("ring", 3, 0)).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Grass`
		},
		xp: {
			unl: _ => hasAGHMilestone(4),
			eff: a => E(1.2).pow((a.lvl - 10) * upgEffect("ring", 12, 0)).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to XP`
		},
		tp: {
			eff: a => hasUpgrade("dm", 0) ? E(1.2).pow(a.lvl ** 0.8) : a.lvl + 1,
			desc: x => `<b class="magenta">${format(x)}x</b> to TP`
		},
		fd: {
			eff: a => (a.lvl / 50 + 1) * upgEffect("ring", 4),
			desc: x => `<b class="magenta">^${format(x)}</b> to Foundry effect`
		},
		ch: {
			unl: _ => hasAGHMilestone(3),
			eff: a => E(2).pow((a.lvl / 3 - 3) * upgEffect("ring", 5)).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Charge`
		},
		ap: {
			unl: _ => hasAGHMilestone(10),
			eff: a => 1 + Math.min(a.lvl / 200, .5),
			desc: x => `<b class="magenta">${format(x)}x</b> to some AP upgrades (per 25 levels)`
		},
		rf: {
			unl: _ => hasAGHMilestone(2),
			eff: a => a.lvl / 20,
			desc: x => `<b class="magenta">+${format(x)}x</b> to Rocket Fuel`
		},
		st: {
			unl: _ => hasAGHMilestone(1),
			eff: a => E(2).pow(a.lvl / 5 - 2).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Stars`
		},
		fu: {
			unl: _ => hasAGHMilestone(5),
			eff: a => E(1.3).pow(a.lvl - 16).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Fun`
		},
		sf: {
			unl: _ => hasAGHMilestone(6),
			eff: a => E(hasAGHMilestone(11) ? 1.3 : 1.2).pow(a.lvl - 16).max(1),
			desc: x => `<b class="magenta">${format(x)}x</b> to SFRGT`
		},
		uh: {
			unl: _ => hasAGHMilestone(8),
			eff: a => Math.floor(Math.max(a.lvl / 2 - 8, 0)),
			desc: x => `<b class="magenta">+${format(x,0)}</b> to Unnatural Healing`
		},
		rg: {
			unl: _ => hasAGHMilestone(13),
			eff: a => Math.max(a.lvl / 5 - 10, 1),
			desc: x => `<b class="magenta">${format(x)}x</b> to Rings`
		},

		//Prestiges
		ap_header: {
			unl: _ => hasAGHMilestone(20),
			eff: a => 0,
			desc: x => `<hr><h3>Prestiges</h3>`
		},
		pl: {
			unl: _ => player.gal.astral_pres >= 1,
			eff: a => E(5).pow(a.pres),
			desc: x => `<b class="cyan">${format(x)}x</b> to Planetarium`
		},
		cl: {
			unl: _ => player.gal.astral_pres >= 2,
			eff: a => E(3).pow(a.pres - 1),
			desc: x => `<b class="cyan">${format(x)}x</b> to Clouds`
		},
		lp: {
			unl: _ => player.gal.astral_pres >= 3,
			eff: a => E(2).pow(a.pres - 2),
			desc: x => `<b class="cyan">${format(x)}x</b> to Lunar Power`
		},
		tb: {
			unl: _ => player.gal.astral_pres >= 4,
			eff: a => (a.pres - 3) / 20,
			desc: x => `<b class="cyan">+${format(x)}x</b> to Tier Base`
		},
		cc: {
			unl: _ => player.gal.astral_pres >= 5,
			eff: a => a / 400,
			desc: x => `<b class='cyan'>+${formatPercent(x)}</b> to Cosmic compounding effect`
		},
	},
}

function getAstralEff(id, def) {
	return getEffect("astral", id, def)
}

function updateAstralTemp() {
	let data = {}
	tmp.gal.astral = data

	let pres = player.gal.astral_pres
	data.scale = ASTRAL_PRESTIGE.scaling(pres)
	data.total = Math.min(player.gal.astral, 100) * data.scale + ASTRAL_PRESTIGE.extra(pres)

	data.gain = ASTRAL.spGain()
	data.prevReq = ASTRAL.req(player.gal.astral - 1, pres)
	data.req = ASTRAL.req(player.gal.astral, pres)
	data.curReq = E(data.req).sub(data.prevReq)
	data.progress = player.gal.sp.sub(tmp.gal.astral.prevReq).div(data.curReq).max(0).min(1).toNumber()
}