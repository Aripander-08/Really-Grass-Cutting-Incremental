//GRASSHOP
MAIN.gh = {
	req: _=> player.grasshop >= 10 ? 150 + player.grasshop * 10 : 200 + player.grasshop * 4,
	bulk: _=> {
		let b = (player.level - 200) / 4
		if (b >= 10) b = (player.level - 150) / 10
		b = Math.floor(b)+1

		if (inChal(8)) b = Math.min(b, tmp.chal.goal[8])
		if (inChal(9)) b = 0
		return b
	},
}

MILESTONE.gh = {
	unl: _ => player.cTimes && !tmp.aRes.gs.shown && !tmp.unRes.gj.shown,
	req: _ => grassHopped(),
	reqDesc: "Grasshop to unlock.",

	res: _ => tmp.gh.eff || player.grasshop,
	title: x => `You have grasshopped <b class='green'>${format(x, 0)}</b> times`,
	title_ms: x => x + " Grasshops",

	milestone: [
		{
			req: 1,
			desc: `<b class="green">Double</b> TP. Unlock new automation upgrades.`,
		},{
			req: 2,
			desc: `<b class="green">Double</b> Crystals.`,
		},{
			req: 3,
			desc: `<b class="green">+0.5</b> Platinum per Grasshop. (starting at 2 and ending at 10)`,

			eff: x=>Math.max(Math.min(x,10)-1,0)/2,
			effDesc: x=> "+"+format(x,1),
		},{
			req: 4,
			desc: `<b class="green">+0.1x</b> Perks per Grasshop. (starting at 3)`,

			eff: x=>Math.max(0,(x-2)/10),
			effDesc: x=> "+"+format(x,1),
		},{
			req: 5,
			desc: `<b class="green">+0.1x</b> Tier multiplier base.`,
		},{
			req: 6,
			desc: `Platinum is <b class="green">2x</b> more common.`,
		},{
			req: 8,
			desc: `<b class="green">Double</b> XP.`,
		},{
			req: 10,
			desc: `Unlock Steelie reset.`,
		},{
			unl: _=>player.sTimes,

			req: 11,
			desc: `<b class="green">Double</b> Steel per Grasshop. (starting at 11)`,
			eff: x=>E(2).pow(Math.max(0,x-10)),
			effDesc: x=> format(x,0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',2),

			req: 12,
			desc: `<b class="green">Double</b> Charge per Grasshop. (starting at 12 and ending at 30)`,
			eff: x=>E(2).pow(Math.max(0,Math.min(x,30)-11)),
			effDesc: x=> format(x,0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',3),

			req: 15,
			desc: `Unlock 'Crystal Clear' challenge.`
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',3),

			req: 16,
			desc: `Charge rate bonuses start 10x earlier per Grasshop. (starting at 16)`,
			eff: x=>Math.max(0,x-15),
			effDesc: x=> format(E(10).pow(x),0)+"x",
		},{
			unl: _=>galUnlocked()||hasUpgrade('factory',4),

			req: 18,
			desc: `Unlock 'Empower' challenge.`
		}
	],
}

function getGHEffect(x,def=1) { return getMilestoneEff("gh", x, def) }

RESET.gh = {
	unl: _=> player.cTimes > 0 && !tmp.aRes.gs.shown && !tmp.unRes.gj.shown,
	req: _=> player.level >= 200 && !player.decel && !inChal(9),
	reqDesc: _=> player.decel ? `You can't Grasshop!` : `Reach Level 200.`,

	resetDesc: `Reset everything Crystalize does, and so Crystalize and Challenges.`,
	resetGain: _ => grassHopped() ? `Reach Level <b>${format(tmp.gh.req,0)}</b> to Grasshop` : ``,

	title: `Grasshop`,
	btns: `
		<button id="multGHBtn" onclick="player.ghMult = !player.ghMult">Multi: <span id="multGHOption">OFF</span></button>
		<button id="autoGHBtn" onclick="player.ghAuto = !player.ghAuto">Auto: <span id="autoGHOption">OFF</span></button>
	`,
	resetBtn: `Grasshop!`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.level < MAIN.gh.req()) return
		}

		if (galUnlocked() || force) {
			this.gainAndReset()
		} else if (!tmp.gh.running) {
			tmp.gh.running = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.gainAndReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.gh.running = false
			},2000)
		}
	},

	gainAndReset() {
		let res = MAIN.gh.bulk()
		if (!player.ghMult) res = Math.min(res, player.grasshop + 1)

		player.grasshop = res
		this.doReset()
	},

	doReset(order="gh") {
		player.crystal = E(0)
		player.chargeRate = E(0)

		let keep = hasStarTree("qol", 11) || (hasUpgrade('assembler', 7) && order == "gh")
		if (!keep) {
			tmp.chal.bulk = []
			for (let i = 0; i < 2; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 5, 0), player.chal.comp[i])
			for (let i = 2; i < 6; i++) player.chal.comp[i] = Math.min(upgEffect('assembler', 6, 0), player.chal.comp[i])
		}

		resetUpgrades('crystal')

		RESET.crystal.doReset(order)
	},
}

function grassHopped() {
	return player.grasshop || player.sTimes
}

tmp_update.push(_=>{
	tmp.gh.req = MAIN.gh.req()
	tmp.gh.eff = player.grasshop
	if (galUnlocked()) tmp.gh.eff = Math.max(Math.min(player.gal.ghPotential, starTreeEff("progress", 13, 0)), tmp.gh.eff)
})

el.update.gh = _=>{
	if (mapID == 'gh') {
		let unl = player.cTimes > 0 && !tmp.aRes.gs.shown
		tmp.el.reset_btn_gh.setClasses({locked: player.level < tmp.gh.req})

		tmp.el.multGHBtn.setDisplay(hasStarTree("qol", 5))
		tmp.el.multGHOption.setTxt(player.ghMult?"ON":"OFF")

		tmp.el.autoGHBtn.setDisplay(hasStarTree("auto", 8))
		tmp.el.autoGHOption.setTxt(player.ghAuto?"ON":"OFF")

		updateMilestoneHTML("gh")
	}
}

function changeGHMult() { player.ghMult = !player.ghMult }