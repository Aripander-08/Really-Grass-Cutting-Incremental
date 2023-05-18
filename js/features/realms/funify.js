aMAIN.fun = {
	gain() {
		let r = E(1)
		r = r.mul(getChargeEff(8))
		r = r.mul(getAstralEff('fu'))
		r = r.mul(upgEffect('moonstone', 4))
		r = r.mul(getGSEffect(8))
		r = r.mul(upgEffect('funMachine', 0))
		r = r.mul(upgEffect('fundry', 0))
		r = r.mul(upgEffect('fundry', 1))
		r = r.mul(upgEffect('fundry', 2))
		r = r.mul(upgEffect('fundry', 3))
		r = r.mul(upgEffect("unGrass", 4))

		return r
	},
	SFRGTgain() {
		let r = E(1)
		r = r.mul(getGSEffect(10))
		r = r.mul(upgEffect('funMachine', 1))
		r = r.mul(upgEffect('sfrgt', 0))
        r = r.mul(getAstralEff('sf'))

		return r
	},
}

RESET.fun = {
	unl: _=> tmp.aRes.gs.shown && (player.aRes.grassskip >= 8 || player.gal.sacTimes),

	req: _=> player.aRes.level>=270,
	reqDesc: `Reach Level 270.`,

	resetDesc: `Reset everything grass-skip does, but it benefits from the milestones for grass-skip.`,
	resetGain: _=> `<b>+${tmp.aRes.funGain.format(0)}</b> Fun`,

	title: `Funify`,
	resetBtn: `Funify!`,
	hotkey: `Shift+S`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.aRes.fun = player.aRes.fun.add(tmp.aRes.funGain)
				player.aRes.fTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="fun") {
		player.aRes.fTime = 0
		RESET.gs.doReset(order)
	},
}

tmp_update.push(_=>{
	let mf = aMAIN.fun
	
	tmp.aRes.funShown = player.decel == 1 && player.aRes?.fTimes
	tmp.aRes.SFRGTgain = mf.SFRGTgain()
	tmp.aRes.funGain = mf.gain()
})

UPGS.funMachine = {
	title: "The Funny Machine",

	unl: _=> tmp.aRes.gs.shown && (player.aRes.grassskip >= 8 || MAIN.sac.did()),

	req: _ => player.aRes?.fTimes > 0,
	reqDesc: `Funify once to unlock.`,

	underDesc: _=>getUpgResTitle('fun'),

	ctn: [
		{
			max: 50,

			title: "Fundry",
			desc: `Unlock a building where you can upgrade fun production. Each level increases fun by <b class="green">+25%</b>.`,
		
			res: "fun",
			icon: ["Icons/Fundry"],
						
			cost: i => Decimal.pow(2,i).ceil(),
			bulk: i => i.max(1).log(2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/4+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			title: "Super Fun Real Good Time Generator",
			desc: `Unlock a building where you can generate SFRGT and spend them on powerful upgrades. Each level increases SFRGT generation by <b class="green">+10%</b>.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/10+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 1,

			title: "Charger Mk.II",
			desc: `Unlock new charge milestones.`,
		
			res: "fun",
			icon: ["Icons/Charger"],
						
			cost: i => E(1e6),
			bulk: i => 1,
		},{
			max: 1,

			unl: _ => hasAGHMilestone(8),
			title: "Recelerator",
			desc: `Unlock Recelerator realm, where you can slow time further.`,
		
			res: "fun",
			icon: ["Icons/Recelerator"],
						
			cost: i => E(1e20),
			bulk: i => 1,
		}
	],
}

UPGS.fundry = {
	title: "Fundry",

	unl: _ => tmp.aRes.funShown && hasUpgrade('funMachine',0),
	autoUnl: _ => hasStarTree("qol", 9),
	noSpend: _ => hasStarTree("qol", 9),

	ctn: [
		{
			max: Infinity,

			title: "Steel Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "steel",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.4,i).mul(1e35).ceil(),
			bulk: i => i.div(1e35).max(1).log(1.4).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Star Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "star",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e4).ceil(),
			bulk: i => i.div(1e4).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasUpgrade("funMachine", 1),

			max: Infinity,

			title: "SFRGT Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "sfrgt",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.15,i).mul(50).ceil(),
			bulk: i => i.div(50).max(1).log(1.15).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Fun Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "fun",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.3,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(1.3).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.sfrgt = {
	title: "Super Fun Real Good Time Generator",

	unl: _ => tmp.aRes.funShown && hasUpgrade('funMachine', 1),
	autoUnl: _ => hasUpgrade("res", 2),

	underDesc: _=>getUpgResTitle('sfrgt')+` <span class='smallAmt'>${player.aRes.sfrgt.formatGain(tmp.aRes.SFRGTgain)}</span>`,

	ctn: [
		{
			title: "SFRGT Generation",
			desc: `<b class="green">Double</b> SFRGT gain.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],

			max: Infinity,
			cost: i => Decimal.pow(15,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(15).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Funny Stars",
			desc: `<b class="green">Double</b> Star gain.`,
		
			res: "sfrgt",
			icon: ["Curr/Star"],

			max: Infinity,
			cost: i => Decimal.pow(15,i).mul(1e4).ceil(),
			bulk: i => i.div(1e4).max(1).log(15).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Funny Astral",
			desc: `<b class="green">Double</b> Space Power gain.`,
		
			res: "sfrgt",
			icon: ["Icons/SP"],

			max: Infinity,
			cost: i => Decimal.pow(15,i).mul(500).ceil(),
			bulk: i => i.div(500).max(1).log(15).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,i)
		
				return x
			},
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Funny Charge",
			desc: `Charge bonuses start <b class="green">10x</b> earlier.`,
		
			res: "sfrgt",
			icon: ["Icons/Charge", "Icons/StarSpeed"],

			max: 20,
			cost: i => Decimal.pow(4,i).mul(300).ceil(),
			bulk: i => i.div(300).max(1).log(4).floor().toNumber()+1,

			effect(i) {
				return i
			},
			effDesc: x => format(E(10).pow(x),0)+"x",
		}, {
			max: 5,

			title: "Funny Foundry",
			desc: `<b class="green">Strengthen</b> Steel Steel upgrade.`,
		
			res: "sfrgt",
			icon: ["Icons/Foundry"],

			cost: i => Decimal.pow(4,i**1.25).mul(1e5).ceil(),
			bulk: i => i.div(1e5).max(1).log(4).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return i/10+1
			},
			effDesc: x => format(x)+"x",
		}
	],
}