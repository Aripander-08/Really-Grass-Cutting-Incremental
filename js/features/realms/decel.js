function inAccel() {
	return player.decel == 0
}

function inDecel() {
	return player.decel >= 1
}

function keepAccelOnDecel() {
	return hasStarTree("qol", 12)
}

function setupDecel() {
	return {
		grass: E(0),

		level: 0,
		xp: E(0),

		tier: 0,
		tp: E(0),

		ap: E(0),
		aTimes: 0,
		aTime: 0,

		oil: E(0),
		lTimes: 0,
		lTime: 0,

		grassskip: 0,
		fun: E(0),
		fTimes: 0,
		fTime: 0,
		sfrgt: E(0)
	}
}

RESET.decel = {
	unl: _=>hasUpgrade('factory',4),

	req: _=>true,
	reqDesc: _=>"",

	resetDesc: `Nerf everything until you Accelerate. You'll be able to cut Anti-Grass for new upgrades.`,
	resetGain: _ => keepAccelOnDecel() ? `Progress will be saved.` : `This will force a Steelie.`,

	title: `Decelerator`,
	resetBtn: `Decelerate`,
	hotkey: `T`,

	reset(force=false) {
		if (inPlanetoid()) return
		if (!player.aRes) player.aRes = setupDecel()
		if (hasUpgrade("factory", 4)) switchRealm(1)
	},
}

el.update.decel = _=>{
	tmp.el.grass_div.changeStyle("background-color", ["", "#242697", "#549e00", "#30f"][player.decel])
	tmp.el.grass.changeStyle("background-color", ["", "#002D9F", "#549e00", "#30f"][player.decel])
	tmp.el.fog.changeStyle("background-color", ["", "#001c3b", "#ff03", "#f0f7"][player.decel])
	tmp.el.fog.setDisplay(player.decel && !inSpace())
	if (mapID == "dc") tmp.el.reset_btn_decel.setTxt("(T) " + (player.decel == 1 ? "Accelerate" : "Decelerate"))
}

MAIN.decel = aMAIN = {
	chargeGain() {
		let x = E(1)
		x = x.mul(upgEffect('aGrass', 0))
		x = x.mul(upgEffect('ap', 1))
		x = x.mul(upgEffect('oil', 5))
		if (player.decel == 1 && !hasUpgrade("dm", 1)) x = x.div(1e3)
		return x
	},
}

REALMS.decel = {
	on: r => r < 2,
	grass() {
		let x = E(1)
		if (!player.sTimes) return x

		x = x.mul(upgEffect('ap', 0))
		x = x.mul(upgEffect('oil', 0))
		return x
	},
	xp() {
		let x = E(1)
		if (!player.sTimes) return x

		x = x.mul(upgEffect('ap', 2))
		x = x.mul(upgEffect('oil', 1))
		return x
	},
	tp() {
		let x = E(1)
		if (!player.sTimes) return x

		x = x.mul(upgEffect('ap', 3))
		x = x.mul(upgEffect('oil', 2))
		return x
	},
}
REALMS.decelOnly = {
	on: r => r == 1,
	grass() {
		let x = E(1e-4)
		if (hasUpgrade('aGrass', 3)) x = x.mul(upgEffect('aGrass',3))
		if (hasGSMilestone(0)) x = x.mul(3)
		return x
	},
	xp() {
		let x = E(1e-5)
		if (hasUpgrade('aGrass',4)) x = x.mul(upgEffect('aGrass',4))
		if (hasGSMilestone(0)) x = x.mul(3)
		return x
	},
	tp() {
		let x = E(0.01)
		x = x.mul(getChargeEff(5))
		return x
	}
}

UPGS.aGrass = {
	unl: _=> player.decel == 1,

	title: "Anti-Upgrades",
	underDesc: _=>`Some upgrades affect the Normal Realm.`,

	autoUnl: _=>hasUpgrade('aAuto', 1),
	noSpend: _=>hasStarTree("qol", 3),

	ctn: [
		{
			max: 500,

			title: "Anti-Grass Charge",
			desc: `Increase charge rate by <b class="green">+25%</b> per level.<br>This is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

			res: "aGrass",
			icon: ['Curr/Charge'],
			
			cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/4+1)

				return x
			},
			effDesc: x => x.format()+"x",
		},{
			max: 100,

			title: "Anti-Realm Grow Speed",
			desc: `Increase grass grow speed by <b class="green">+50%</b> per level in Anti-Realm.`,

			res: "aGrass",
			icon: ['Icons/Speed'],
			
			cost: i => Decimal.pow(1.5,i).mul(100).ceil(),
			bulk: i => i.div(100).max(1).log(1.5).floor().toNumber()+1,

			effect(i) {
				let x = i/2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Anti-Grass Steel",
			desc: `Increase steel gain by <b class="green">+10%</b> per level.<br>This is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

			res: "aGrass",
			icon: ['Curr/Steel'],
			
			cost: i => Decimal.pow(1.2,i).mul(200).ceil(),
			bulk: i => i.div(200).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/10+1)

				return x
			},
			effDesc: x => x.format()+"x",
		},{
			title: "Charged Grass",
			desc: `Charge Rate boosts Grass in Anti-Realm.`,

			res: "aGrass",
			icon: ['Curr/Grass', 'Icons/StarSpeed'],
			
			cost: i => E(500),
			bulk: i => 1,

			effect(i) {
				return E(player.chargeRate).div(1e3).add(1).root(4)
			},
			effDesc: x => x.format()+"x",
		},{
			title: "Charged XP",
			desc: `Charge Rate boosts XP in Anti-Realm.`,

			res: "aGrass",
			icon: ['Icons/XP', 'Icons/StarSpeed'],
			
			cost: i => E(100),
			bulk: i => 1,

			effect(i) {
				return E(player.chargeRate).div(1e3).add(1).root(4)
			},
			effDesc: x => x.format()+"x",
		},{
			unl: _ => player.aRes?.aTimes,

			max: 400,

			title: "Anti-Grass AP",
			desc: `Increase AP gain by <b class="green">+15%</b> compounding.`,

			res: "aGrass",
			icon: ['Curr/Anonymity'],
			
			cost: i => Decimal.pow(1.2,i).mul(1e7).ceil(),
			bulk: i => i.div(1e7).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				return E(1.15).pow(i)
			},
			effDesc: x => x.format()+"x",
		},{
			max: 5,
			tier: 2,

			title: "Range II",
			desc: `Increase grass cut range by <b class="green">+10</b> per level.`,

			res: "aGrass",
			icon: ['Icons/Range'],

			cost: i => Decimal.pow(15,i).mul(200).ceil(),
			bulk: i => i.div(200).max(1).log(15).floor().toNumber()+1,

			effect(i) {
				return i*10
			},
			effDesc: x => "+"+format(x,0),
		}
	],
}

UPGS.aAuto = {
	title: "Anti-Anti-Automation Upgrades",
	req: _=>player.aRes?.aTimes,
	reqDesc: `Anonymity once to unlock.`,

	unl: _=> player.decel,

	ctn: [
		{
			max: 4,

			title: "Anti-Autocut",
			desc: `Auto-cutting speed is <b class="green">+0.5x</b> faster in Anti-Realm.`,
		
			res: "ap",
			icon: ['Curr/AntiGrass','Icons/Automation'],
						
			cost: i => Decimal.pow(3,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(3).floor().toNumber()+1,
		
			effect(i) {
				return i/2+1
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _=>player.aRes?.lTimes,

			title: "Anti-Grass Upgrades Autobuy",
			desc: `You can now automatically buy Anti-Grass Upgrades.`,
		
			res: "oil",
			icon: ['Curr/AntiGrass','Icons/Automation'],
						
			cost: i => E(100),
			bulk: i => 1,
		},{
			unl: _=>player.rocket.part>0 || galUnlocked(),

			title: "Anonymity Upgrades Autobuy",
			desc: `You can now automatically buy Anonymity Upgrades.`,
		
			res: "rf",
			icon: ['Curr/Anonymity','Icons/Automation'],
						
			cost: i => E(50),
			bulk: i => 1,
		},{
			unl: _=>galUnlocked(),

			title: "Oil Upgrades Autobuy",
			desc: `You can now automatically buy Oil Upgrades.`,
		
			res: "rf",
			icon: ['Curr/Oil','Icons/Automation'],
						
			cost: i => E(200),
			bulk: i => 1,
		},{
			unl: _=>galUnlocked(),

			max: 10,

			title: "Anonymity Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of AP you would earn on anonymity per second.`,
		
			res: "ap",
			icon: ['Curr/Anonymity','Icons/Plus'],
						
			cost: i => Decimal.pow(3,i).mul(1e12).ceil(),
			bulk: i => i.div(1e12).max(1).log(3).floor().toNumber()+1,
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x,1)+"/s",
		},{
			unl: _=>galUnlocked(),

			max: 10,

			title: "Oil Generation",
			desc: `Passively generate <b class="green">+0.1%</b> of oil you would earn on liquefy per second.`,
		
			res: "oil",
			icon: ['Curr/Oil','Icons/Plus'],
						
			cost: i => Decimal.pow(2,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(2).floor().toNumber()+1,
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x,1)+"/s",
		}
	],
}

/* ANONYMITY */
aMAIN.ap = {
	gain() {
		if (!player.aRes) return E(1)

		let x = Decimal.pow(1.1,player.aRes.level).mul(3)

		x = x.mul(upgEffect('aGrass',5))
		x = x.mul(upgEffect('plat',8))
		x = x.mul(upgEffect('oil',3))

		x = x.mul(upgEffect('rocket',7))
		x = x.mul(upgEffect('rocket',14))
		x = x.mul(upgEffect('rocket',17))
		if (hasUpgrade('momentum', 8)) x = x.mul(3)

		return x.floor()
	},
}

RESET.ap = {
	unl: _=>player.decel==1,

	req: _=>player.aRes.level>=30,
	reqDesc: `Reach Level 30.`,

	resetDesc: `Reset your anti-grass, level, and charge.`,
	resetGain: _=> `<b>+${tmp.aRes.apGain.format(0)}</b> Anonymity Points`,

	title: `Anonymity`,
	resetBtn: `Anonymity?`,
	hotkey: `P`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.aRes.ap = player.aRes.ap.add(tmp.aRes.apGain)
				player.aRes.aTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="a") {
		player.aRes.aTime = 0
		player.aRes.grass = E(0)
		player.aRes.xp = E(0)
		player.aRes.level = 0
		player.chargeRate = E(0)

		if (!hasUpgrade('aAuto',8)) resetUpgrades('aGrass')

		resetGrasses()

		updateTemp()
	},
}

UPGS.ap = {
	unl: _=> player.decel == 1,

	title: "Anonymity Upgrades",

	req: _=>player.aRes?.aTimes,
	reqDesc: `Anonymity once to unlock.`,

	underDesc: _=>getUpgResTitle('ap')+(tmp.aRes.apGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.aRes.ap,tmp.aRes.apGain.mul(tmp.aRes.apGainP))+"</span>" : ""),

	autoUnl: _=>hasUpgrade('aAuto',2),
	noSpend: _=>hasStarTree("qol", 3),

	ctn: [
		{
			max: Infinity,

			title: "AP Value",
			tier: 2,
			desc: `Increase grass gain by <b class="green">+25%</b> per level.`,
		
			res: "ap",
			icon: ["Curr/Grass"],

			cost: i => Decimal.pow(1.2,i).mul(25).ceil(),
			bulk: i => i.div(25).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/4+1)
				r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "AP Charge",
			tier: 2,
			desc: `Increase charge rate by <b class="green">+25%</b> per level.`,
		
			res: "ap",
			icon: ['Curr/Charge'],
			
			cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let r = E(i/4+1)
				r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
				return r
			},
			effDesc: x => x.format()+"x",
		},{
			max: Infinity,

			title: "AP XP",
			tier: 2,
			desc: `Increase XP by <b class="green">+25%</b> per level.`,
		
			res: "ap",
			icon: ['Icons/XP'],
			
			cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let r = E(i/4+1)
				r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
				return r
			},
			effDesc: x => format(x,0)+"x",
		},{
			max: 50,

			title: "AP TP",
			desc: `Increase TP by <b class="green">+25%</b> per level.`,
		
			res: "ap",
			icon: ['Icons/TP'],
			
			cost: i => Decimal.pow(1.2,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let r = E(i/4+1)
				r = r.mul(E(getAstralEff('ap')).pow(Math.floor(i/25)))
				return r
			},
			effDesc: x => format(x,1)+"x",
		},{
			max: 25,

			title: "AP More Grass",
			desc: `Increase grass cap by <b class="green">+10</b> per level.`,
		
			res: "ap",
			icon: ['Icons/MoreGrass'],
			
			cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				return i*10
			},
			effDesc: x => "+"+format(x,0),
		}
	],
}

tmp_update.push(_=>{
	tmp.aRes.apGain = aMAIN.ap.gain()
	tmp.aRes.apGainP = upgEffect('aAuto',4,0)+starTreeEff("qol",3,0)
})

/* LIQUEFY */
aMAIN.oil = {
	gain() {
		if (!player.aRes) return E(1)

		let x = Decimal.pow(2, player.aRes.tier)
		x = x.mul(upgEffect('plat',9))

		x = x.mul(getChargeEff(6))
		x = x.mul(upgEffect('rocket',8))
		x = x.mul(upgEffect('rocket',15))
		if (hasUpgrade('momentum', 9)) x = x.mul(3)

		return x.floor()
	},
}

RESET.oil = {
	unl: _=> player.decel == 1 && player.aRes?.aTimes,

	req: _=>player.aRes.level>=100,
	reqDesc: `Reach Level 100.`,

	resetDesc: `Reset everything Anonymity does, and so Anonymity and Tier.`,
	resetGain: _=> `<b>+${tmp.aRes.oilGain.format(0)}</b> Oil`,

	title: `Liquefy`,
	resetBtn: `Liquefy?`,
	hotkey: `C`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.aRes.oil = player.aRes.oil.add(tmp.aRes.oilGain)
				player.aRes.lTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="l") {
		player.aRes.lTime = 0
		player.aRes.tier = 0
		player.aRes.tp = E(0)
		player.aRes.ap = E(0)

		resetUpgrades('ap')

		RESET.ap.doReset(order)
	},
}

UPGS.oil = {
	unl: _=> player.decel == 1 && player.aRes?.aTimes,

	title: "Oil Upgrades",

	req: _=>player.aRes?.lTimes,
	reqDesc: `Liquefy once to unlock.`,

	underDesc: _=>getUpgResTitle('oil')+(tmp.aRes.oilGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.aRes.oil,tmp.aRes.oilGain.mul(tmp.aRes.oilGainP))+"</span>" : ""),

	autoUnl: _=>hasUpgrade('aAuto',3),
	noSpend: _=>hasStarTree("qol", 3),

	ctn: [
		{
			max: 100,

			title: "Oily Grass Value",
			tier: 3,
			desc: `Increase grass gain by <b class="green">10%</b> compounding per level.`,
		
			res: "oil",
			icon: ["Curr/Grass"],
						
			cost: i => Decimal.pow(2,i**0.8).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(2).root(0.8).floor().toNumber()+1,
		
			effect(i) {
				return E(1.1).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: 100,

			title: "Oily XP",
			tier: 3,
			desc: `Increase XP gain by <b class="green">10%</b> compounding per level.`,
		
			res: "oil",
			icon: ['Icons/XP'],

			cost: i => Decimal.pow(2,i**0.8).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(2).root(0.8).floor().toNumber()+1,

			effect(i) {
				return E(1.1).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Oily TP",
			tier: 2,
			desc: `Increase TP gain by <b class="green">25%</b> compounding per level.`,
		
			res: "oil",
			icon: ['Icons/TP'],
			
			cost: i => Decimal.pow(3,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(3).floor().toNumber()+1,

			effect(i) {
				return E(1.25).pow(i)
			},
			effDesc: x => x.format()+"x",
		},{
			max: 100,

			title: "Oily AP",
			desc: `Increase AP gain by <b class="green">30%</b> compounding per level.`,

			res: "oil",
			icon: ['Curr/Anonymity'],
			
			cost: i => Decimal.pow(1.5,i).mul(200).ceil(),
			bulk: i => i.div(200).max(1).log(1.5).floor().toNumber()+1,

			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => x.format()+"x",
		},{
			max: Infinity,

			title: "Oily Steel",
			tier: 2,
			desc: `Steel gain is <b class="green">doubled</b> per level.`,
		
			res: "oil",
			icon: ['Curr/Steel'],
			
			cost: i => Decimal.pow(10,i).mul(100).ceil(),
			bulk: i => i.div(100).max(1).log(10).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(2,i)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Oily Charge",
			tier: 3,
			desc: `Charge rate is increased by <b class="green">25%</b> compounding per level.`,
		
			res: "oil",
			icon: ['Curr/Charge'],
			
			cost: i => Decimal.pow(2,i).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(2).floor().toNumber()+1,

			effect(i) {
				return E(1.25).pow(i)
			},
			effDesc: x => format(x)+"x",
		},
	],
}

tmp_update.push(_=>{
	tmp.aRes.oilGain = aMAIN.oil.gain()
	tmp.aRes.oilGainP = upgEffect('aAuto',5,0)+starTreeEff("qol",3,0)
})

function resetAntiRealm() {
	player.chargeRate = E(0)
	player.aRes.grass = E(0)
	player.aRes.xp = E(0)
	player.aRes.level = 0
	player.aRes.tp = E(0)
	player.aRes.tier = 0
	player.aRes.ap = E(0)
	player.aRes.oil = E(0)
	player.aRes.aTime = 0
	player.aRes.lTime = 0

	resetUpgrades('aGrass')
	resetUpgrades('ap')
	resetUpgrades('oil')
}

/* GRASS-SKIPS */
aMAIN.gs = {
	req: _ => 200+player.aRes?.grassskip*10,
	bulk: _ => Math.floor((player.aRes?.level-200)/10) + 1,
}

MILESTONE.gs = {
	unl: _ => tmp.aRes.gs.shown,
	req: _ => grassSkipped(),
	reqDesc: "Grass-skip to unlock.",

	res: _ => player.aRes?.grassskip,
	title: x => `You have grass-skipped <b class='green'>${format(x, 0)}</b> times`,
	title_ms: x => x + " Grass-skips",

	milestone: [
		{
			req: 1,
			desc: `Only in Anti-Realm, <b class="green">3x</b> Grass and XP. Auto-value boosts Platinum.`
		},
		{
			req: 2,
			desc: `<b class="green">1.2x</b> Space Power per Grass-Skip.`,
			eff: x => E(1.2).pow(x),
			effDesc: x => format(x) + "x"
		},
		{
			req: 3,
			desc: `<b class="green">1.4x</b> Stars per Grass-Skip.`,
			eff: x => E(1.4).pow(x),
			effDesc: x => format(x) + "x"
		},
		{
			req: 4,
			desc: `<b class="green">+0.1x</b> Rocket Fuel per Grass-Skip. (starting at 4)`,
			eff: x => Math.max(x-3,0)/10,
			effDesc: x => "+" + format(x, 1) + "x"
		},
		{
			req: 5,
			desc: `<b class="green">+0.01%</b> Moonstone luck on cutting Grass and <b class="green">+5%</b> Moonstone luck on cutting Platinum. Resets on cutting Moonstone.`,
			eff: _ => galUnlocked() ? player.gal.msLuck : 1,
			effDesc: x => formatPercent(x-1)
		},
		{
			req: 6,
			desc: `There's <b class="green">10%</b> chance that next-tier Grass spawns.`
		},
		{
			req: 7,
			desc: `In Normal Realm: <b class="green">double</b> platinum chance, but moonstone chance is 10x lower.`
		},
		{
			req: 8,
			desc: `Unlock the Funify reset.`
		},
		{
			unl: _ => player.aRes.fTimes,
			req: 9,
			desc: `<b class="green">Double</b> Fun per Grass-Skip. (starting at 9)`,
			eff: x => E(2).pow(Math.max(x - 8, 0)),
			effDesc: x => format(x, 0) + "x"
		},
		{
			unl: _ => player.aRes.fTimes,
			req: 10,
			desc: `12 GH Milestone is uncapped.`
		},
		{
			unl: _ => player.aRes.fTimes,
			req: 12,
			desc: `<b class="green">+1x</b> SRFGT per Grass-Skip. (starting at 12)`,
			eff: x => Math.max(x - 10, 1),
			effDesc: x => format(x, 0) + "x"
		},
		{
			unl: _ => player.unRes,
			req: 13,
			desc: `<b class="green">+1</b> to Unnatural Healing per Grass-Skip. (starting at 13)`,
			eff: x => Math.max(x - 12, 0),
			effDesc: x => "+" + format(x, 0)
		},
		{
			unl: _ => player.unRes,
			req: 14,
			desc: `<b class="green">Double</b> Moonstone chance.`
		},
	],
}

function grassSkipped() {
	return player.aRes?.grassskip || player.gal?.sacTimes
}
function hasGSMilestone(x) { return hasMilestone("gs", x) }
function getGSEffect(x,def=1) { return getMilestoneEff("gs", x, def) }

RESET.gs = {
	unl: _=>tmp.aRes.gs.shown,
	req: _=>player.aRes.level>=200,
	reqDesc: `Reach Level 200.`,

	resetDesc: `Reset everything Liquefy does, and so Steel, Foundry, Charger, and Liquefy.`,
	resetGain: _ => grassSkipped() ? `Reach Level <b>${format(tmp.aRes.gs.req,0)}</b> to Grass-skip` : ``,

	title: `Grass-Skip`,
	btns: `
		<button id="multGSBtn" onclick="player.gsMult = !player.gsMult">Multi: <span id="multGSOption">OFF</span></button>
		<button id="autoGSBtn" onclick="player.gsAuto = !player.gsAuto">Auto: <span id="autoGSOption">OFF</span></button>
	`,
	resetBtn: `Grass-Skip?`,
	hotkey: `G`,

	reset(force=false) {
		if (!force) {
			if (!this.req()) return
			if (player.aRes.level < aMAIN.gs.req()) return
		}

		if (force || player.gal.sacTimes) {
			this.gainAndReset()
		} else if (!tmp.gh.running) {
			tmp.gh.running = true
			document.body.style.animation = "implode 2s 1"
			setTimeout(_=>{
				this.gainAndReset()
			},1000)
			setTimeout(_=>{
				document.body.style.animation = ""
				tmp.aRes.gs.running = false
			},2000)
		}
	},

	gainAndReset() {
		let res = aMAIN.gs.bulk()
		if (!player.gsMult) res = Math.min(res, player.aRes.grassskip + 1)

		player.aRes.grassskip = res
		this.doReset()
	},

	doReset(order="gs") {
		player.steel = E(0)

		if (!hasStarTree("qol", 10)) {
			player.steel = E(0)
			player.chargeRate = E(0)
			delete player.upgs.gen[2]
			delete player.upgs.gen[3]
			delete player.upgs.gen[4]
			resetUpgrades('foundry')
		}
		resetAntiRealm()
	},
}

tmp_update.push(_=>{
	tmp.aRes.gs.shown = galUnlocked() && player.decel == 1
	tmp.aRes.gs.req = aMAIN.gs.req()
})

el.update.gs = _=>{
	let unl = tmp.aRes.gs.shown
	if (mapID == 'gh' && unl) {
		tmp.el.reset_btn_gs.setClasses({locked: player.aRes.level < tmp.aRes.gs.req})

		tmp.el.multGSBtn.setDisplay(hasStarTree("qol", 7))
		tmp.el.multGSOption.setTxt(player.gsMult ? "ON" : "OFF")

		tmp.el.autoGSBtn.setDisplay(hasStarTree("auto", 8))
		tmp.el.autoGSOption.setTxt(player.gsAuto?"ON":"OFF")
	}
	updateMilestoneHTML("gs")
}

function changeGSMult() { player.gsMult = !player.gsMult }