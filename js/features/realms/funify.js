aMAIN.fun = {
	gain() {
		let r = E(1)
		r = r.mul(getChargeEff(8))
		r = r.mul(getAstralEff('fu'))
		r = r.mul(upgEffect('moonstone', 4))
		r = r.mul(getGSEffect(8))
		r = r.mul(upgEffect('funMachine', 0))
		r = r.mul(upgEffect("unGrass", 4))

		r = r.mul(upgEffect('fundry', 0))
		r = r.mul(upgEffect('fundry', 1))
		r = r.mul(upgEffect('fundry', 2))
		r = r.mul(upgEffect('fundry', 3))

		return r
	},
	SFRGTgain() {
		let r = E(1)
		r = r.mul(getGSEffect(10))
		r = r.mul(upgEffect('funMachine', 1))
		r = r.mul(upgEffect('sfrgt', 0))
		r = r.mul(upgEffect('moonstone', 5))
		r = r.mul(getAstralEff('sf'))

		r = r.pow(upgEffect("dm", 6))

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
	tmp.aRes.funGain = mf.gain()
	tmp.aRes.funGainP = starTreeEff("qol", 15, 0)

	tmp.aRes.SFRGTgain = mf.SFRGTgain()
})

UPGS.funMachine = {
	title: "The Funny Machine",

	unl: _=> tmp.aRes.gs.shown && (player.aRes.grassskip >= 8 || MAIN.sac.did()),

	req: _ => player.aRes?.fTimes > 0,
	reqDesc: `Funify once to unlock.`,

	underDesc: _=>getUpgResTitle('fun') + gainHTML(tmp.aRes.funGainP, tmp.aRes.funGain),

	ctn: [
		{
			title: "Fundry",
			desc: `Unlock a building where you can upgrade fun production. Each level increases fun by <b class="green">+50%</b>.`,
		
			res: "fun",
			icon: ["Icons/Fundry"],

			max: Infinity,
			cost: i => Decimal.pow(2,i).ceil(),
			bulk: i => i.max(1).log(2).floor().toNumber()+1,

			effect: i => i/2+1,
			effDesc: x => format(x)+"x",
		},{
			title: "Super Fun Real Good Time Generator",
			desc: `Unlock a building where you can generate SFRGT and spend them on powerful upgrades. Each level increases SFRGT generation by <b class="green">+20%</b>.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],

			max: Infinity,	
			cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,

			effect: i => i/5+1,
			effDesc: x => format(x)+"x",
		},{
			max: 1,

			title: "Charger Mk.II",
			desc: `Unlock new charge milestones.`,
		
			res: "fun",
			icon: ["Icons/Charger"],

			cost: 1e6,
		},{
			unl: _ => MAIN.sac.did(),
			title: "Recelerator",
			desc: `Unlock Recelerator realm, where you can slow time further.`,
		
			res: "fun",
			icon: ["Icons/Recelerator"],
						
			cost: 1e13,
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
						
			cost: i => Decimal.pow(1.4,i).mul(1e45).ceil(),
			bulk: i => i.div(1e45).max(1).log(1.4).floor().toNumber()+1,

			effect: i => E(1.25).pow(Math.floor(i / 25)).mul(i / 2 + 1),
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Star Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "star",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(1.2).floor().toNumber()+1,

			effect: i => E(1.25).pow(Math.floor(i / 25)).mul(i / 2 + 1),
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasUpgrade("funMachine", 1),

			max: Infinity,

			title: "SFRGT Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,

			res: "sfrgt",
			icon: ["Curr/Fun"],
				
			cost: i => Decimal.pow(1.2,i).mul(50).ceil(),
			bulk: i => i.div(50).max(1).log(1.2).floor().toNumber()+1,

			effect: i => E(1.25).pow(Math.floor(i / 25)).mul(i / 2 + 1),
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Fun Fun",
			desc: `Increase fun gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "fun",
			icon: ["Curr/Fun"],
						
			cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

			effect: i => E(1.25).pow(Math.floor(i / 25)).mul(i / 2 + 1),
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.sfrgt = {
	title: "Super Fun Real Good Time Generator",

	unl: _ => tmp.aRes.funShown && hasUpgrade('funMachine', 1),
	autoUnl: _ => hasStarTree("auto", 11),
	noSpend: _ => hasStarTree("auto", 11),

	underDesc: _=>getUpgResTitle('sfrgt') + gainHTML(1, tmp.aRes.SFRGTgain),

	ctn: [
		{
			title: "SFRGT Generation",
			desc: `<b class="green">Double</b> SFRGT gain.`,
		
			res: "fun",
			icon: ["Curr/SuperFun"],

			max: Infinity,
			cost: i => Decimal.pow(3,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).log(3).floor().toNumber()+1,
		
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
			cost: i => Decimal.pow(10,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(10).floor().toNumber()+1,
		
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
			cost: i => Decimal.pow(100,i).mul(500).ceil(),
			bulk: i => i.div(500).max(1).log(100).floor().toNumber()+1,
		
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

			max: 50,
			cost: i => Decimal.pow(5,i).mul(100).ceil(),
			bulk: i => i.div(100).max(1).log(5).floor().toNumber()+1,

			effect(i) {
				return i
			},
			effDesc: x => format(E(10).pow(x),0)+"x",
		}, {
			title: "Funny Foundry",
			desc: `Raise first Charger effect by <b class="green">^+0.1</b>.`,
		
			res: "sfrgt",
			icon: ["Icons/Foundry"],

			max: 10,
			cost: i => Decimal.pow(2,i**1.25).mul(1e4).ceil(),
			bulk: i => i.div(1e4).max(1).log(2).root(1.25).floor().toNumber()+1,
		
			effect: i => i/10,
			effDesc: x => "^"+format(x,1),
		}, {
			title: "Funny Healing",
			desc: `<b class='green'>+1</b> Unnatural Healing.`,

			unl: _ => hasUpgrade('res', 1),
			res: "sfrgt",
			icon: ["Curr/UnnaturalGrass"],

			max: Infinity,
			cost: i => Decimal.pow(20,i).mul(1e35).ceil(),
			bulk: i => i.div(1e35).max(1).log(20).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}, {
			title: "Funny Blastoff",
			desc: `<b class='green'>+1x</b> Momentum.`,

			unl: _ => hasUpgrade('res', 1),
			res: "sfrgt",
			icon: ["Curr/Momentum"],

			max: Infinity,
			cost: i => Decimal.pow(20,i).mul(1e35).ceil(),
			bulk: i => i.div(1e35).max(1).log(20).floor().toNumber()+1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x",
		}
	],
}