MAIN.steel = {
	gain() {
		let x = E(1)
		if (hasUpgrade('factory',0)) x = x.mul(tmp.foundryEff)
		x = x.mul(upgEffect('foundry',0)).mul(upgEffect('foundry',1)).mul(upgEffect('foundry',2)).mul(upgEffect('foundry',3))

		x = x.mul(upgEffect('plat',6))
		x = x.mul(getGHEffect(8, 1))
		x = x.mul(chalEff(6))
		x = x.mul(getChargeEff(0))

		x = x.mul(upgEffect('aGrass',2))
		x = x.mul(upgEffect('oil',4))

		x = x.mul(upgEffect('rocket',5))
		x = x.mul(upgEffect('rocket',12))
		x = x.mul(upgEffect('rocket',18))
		if (hasUpgrade('momentum', 6)) x = x.mul(3)

		return x.floor()
	},
	foundryEff() {
		let max = Decimal.mul(100,upgEffect('factory',0))

		let time = player.sTime / 3600
		time *= upgEffect('moonstone',6)
		time = Math.min(time, 1)

		let x = max.mul(Math.min(time,1)).max(1)
		x = x.pow(getAstralEff('fd', 1))

		return x
	}
}

RESET.steel = {
	unl: _ => (player.grasshop >= 10 || galUnlocked()) && !tmp.aRes.gs.shown && !tmp.unRes.gj.shown,

	req: _ => !inDecel() && player.level>=240,
	reqDesc: _ => inDecel() ? `You can't Steelie!` : `Reach Level 240.`,

	resetDesc: `Reset everything grasshop does, but it benefits from the milestones for grasshop.`,
	resetGain: _=> player.sTimes ? `<b>+${tmp.steelGain.format(0)}</b> Steel` : `<b class='cyan'>Also unlock Chronology and Pins!</b>`,

	title: `Steelie`,
	resetBtn: `Steelie!`,
	hotkey: `Shift+S`,

	reset(force=false) {
		if ((this.unl()&&this.req())||force) {
			if (!force) {
				player.steel = player.steel.add(tmp.steelGain)
				player.sTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="steel") {
		player.sTime = 0
		RESET.gh.doReset(order)
	},
}

UPGS.factory = {
	title: "The Factory",

	unl: _=>(player.grasshop >= 10 || player.sTimes) && !tmp.aRes.gs.shown && !tmp.unRes.gj.shown,
	autoUnl: _=>hasStarTree('auto',0),
	noSpend: _=>hasStarTree("qol", 4),

	req: _=>player.sTimes > 0,
	reqDesc: `Steelie once to unlock.`,

	underDesc: _=>getUpgResTitle('steel')+(tmp.steelGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.steel,tmp.steelGain.mul(tmp.steelGainP))+"</span>" : ""),

	ctn: [
		{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Foundry",
			desc: `Unlock a building (above Steelie) where you can upgrade steel production. Each level increases foundry's effect by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/Foundry"],
						
			cost: i => Decimal.pow(1.3,i).ceil(),
			bulk: i => i.max(1).log(1.3).floor().toNumber()+1,
		
			effect(i) {
				let x = i/10+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Generator",
			desc: `Unlock a building (in Foundry) where you can upgrade prestige/crystal generation. Each level increases generator's effect by <b class="green">+1%</b>.`,
		
			res: "steel",
			icon: ["Icons/Generator"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e3).ceil(),
			bulk: i => i.div(1e3).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/100+1
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Charger",
			desc: `Unlock a building (in Foundry) where you can boost production multipliers with charge. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/Charger"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e6).ceil(),
			bulk: i => i.div(1e6).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Assembler",
			desc: `Unlock a building (in Automation) where you can get more QoL. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/Assembler"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e7).ceil(),
			bulk: i => i.div(1e7).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Decelerator",
			desc: `Unlock a building (below Steelie) where you can slow down time. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/Decelerator"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e12).ceil(),
			bulk: i => i.div(1e12).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Refinery",
			desc: `Unlock a building (on the right of Foundry) where you can convert charge and oil into rocket fuel. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/Refinery"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e20).ceil(),
			bulk: i => i.div(1e20).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			title: "Rocket Launch Pad",
			desc: `Unlock a building (in Refinery) where you can build a rocket. Each level increases charge rate by <b class="green">+10%</b>.`,
		
			res: "steel",
			icon: ["Icons/LaunchPad"],
						
			cost: i => Decimal.pow(2,i).mul(1e21).ceil(),
			bulk: i => i.div(1e21).max(1).log(2).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 100 + starTreeEff("progress", 7, 0),

			unl: _=>galUnlocked(),

			title: "Star Accumulator",
			desc: `Unlock a building (in Galactic) where you can boost Stars. Each level increases charge rate by <b class="green">+10%</b>.`,

			res: "steel",
			icon: ["Icons/StarAccumulator"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e27).ceil(),
			bulk: i => i.div(1e27).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let r = E(i/10+1)
				return r
			},
			effDesc: x => format(x)+"x",
		}
	],
}

UPGS.foundry = {
	title: "Foundry",

	unl: _=> hasUpgrade('factory',0) && !tmp.aRes.funShown,
	autoUnl: _=> hasUpgrade('assembler',10),
	noSpend: _=>hasStarTree("qol", 4),

	underDesc: _=>`
		<b class="green">${tmp.foundryEff.format()}x</b>
		<span style="font-size:14px;">Steel gain (based on time since last Steelie)</span>
		<br>
		<span class="smallAmt" style="font-size:8px;">(Max: ${format(Decimal.mul(100,upgEffect('factory',0)).pow(getAstralEff('fd', 1)))}x)</span>
	`,

	ctn: [
		{
			max: Infinity,

			title: "Grass Steel",
			desc: `Increase steel gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "grass",
			icon: ["Curr/Steel"],
						
			cost: i => Decimal.pow(1.4,i).mul(1e38).ceil(),
			bulk: i => i.div(1e38).max(1).log(1.4).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Prestige Steel",
			desc: `Increase steel gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "pp",
			icon: ["Curr/Steel"],
						
			cost: i => Decimal.pow(1.5,i).mul(1e24).ceil(),
			bulk: i => i.div(1e24).max(1).log(1.5).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Crystal Steel",
			desc: `Increase steel gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "crystal",
			icon: ["Curr/Steel"],
						
			cost: i => Decimal.pow(1.3,i**0.8).mul(1e9).ceil(),
			bulk: i => i.div(1e9).max(1).log(1.3).root(0.8).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.25, Math.floor(i/25)).mul(i/5+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Steel Steel",
			desc: `Increase steel gain by <b class="green">+20%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "steel",
			icon: ["Curr/Steel"],
						
			cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
			bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				return Decimal.pow(1.5,Math.floor(i/25)).mul(i/5+1)
			},
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.gen = {
	title: "Generator",

	unl: _ => hasUpgrade('factory', 1) && !tmp.aRes.funShown,
	autoUnl: _ => hasStarTree('auto', 1),
	noSpend: _=>hasStarTree("qol", 4),

	underDesc: _=>`<b class="green">${format(upgEffect('factory',1))}x</b> <span style="font-size:14px;">to PP/Crystal generator multiplier from factory upgrade</span>`,

	ctn: [
		{
			max: 90,

			title: "PP Generation II",
			tier: 2,
			desc: `<b class="green">+0.1%</b> passive PP generation per level.`,
		
			res: "steel",
			icon: ["Curr/Prestige"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e3).div(starTreeEff("auto", 6)).ceil(),
			bulk: i => i.div(1e3).mul(starTreeEff("auto", 6)).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x)+"/s",
		},{
			max: 90,

			title: "Crystal Generation II",
			tier: 2,
			desc: `<b class="green">+0.1%</b> passive Crystal generation per level.`,
		
			res: "steel",
			icon: ["Curr/Crystal"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e20).div(starTreeEff("auto", 6)).ceil(),
			bulk: i => i.div(1e20).mul(starTreeEff("auto", 6)).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = i/1e3
		
				return x
			},
			effDesc: x => "+"+formatPercent(x)+"/s",
		},{
			max: Infinity,

			unl: _=>hasUpgrade("factory", 2),

			title: "Prestige Charge",
			desc: `Increase charge rate by <b class="green">+10%</b> per level.<br>This is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "pp",
			icon: ["Curr/Charge"],
						
			cost: i => Decimal.pow(1.2,i).mul(1e25).ceil(),
			bulk: i => i.div(1e25).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/10+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			unl: _=>hasUpgrade("factory", 2),

			title: "Crystal Charge",
			desc: `Increase charge rate by <b class="green">+10%</b> per level.<br>This is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "crystal",
			icon: ["Curr/Charge"],
						
			cost: i => Decimal.pow(1.15,i**0.8).mul(1e9).ceil(),
			bulk: i => i.div(1e9).max(1).log(1.15).root(0.8).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/10+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			unl: _=>hasUpgrade("factory", 2) && hasStarTree("progress", 3),

			title: "Steel Charge",
			desc: `Increase charge rate by <b class="green">+10%</b> per level.<br>This is increased by <b class="green">50%</b> for every <b class="yellow">25</b> levels.`,
		
			res: "steel",
			icon: ["Curr/Charge"],
						
			cost: i => Decimal.pow(1.15,i).mul(1e30).ceil(),
			bulk: i => i.div(1e30).max(1).log(1.15).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/10+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

UPGS.assembler = {
	title: "Assembler",

	unl: _=>hasUpgrade('factory',3),

	ctn: [
		{
			title: "Grass Upgrades EL",
			desc: `Grass Upgrades no longer spend Grass.`,
		
			res: "steel",
			icon: ["Curr/Grass","Icons/Infinite"],
						
			cost: i => E(1e8),
			bulk: i => 1,
		},{
			title: "Prestige Upgrades EL",
			desc: `Prestige Upgrades no longer spend PP.`,
		
			res: "steel",
			icon: ["Curr/Prestige","Icons/Infinite"],
						
			cost: i => E(1e10),
			bulk: i => 1,
		},{
			title: "Crystal Upgrades EL",
			desc: `Crystal Upgrades no longer spend Crystals.`,
		
			res: "steel",
			icon: ["Curr/Crystal","Icons/Infinite"],

			cost: i => E(1e12),
			bulk: i => 1,
		},{
			title: "Perk Autobuy",
			desc: `Automate Perk Upgrades.`,

			res: "steel",
			icon: ['Curr/Perks','Icons/Automation'],

			cost: i => E(1e13),
			bulk: i => 1,
		},{
			title: "Perk Save GH",
			desc: `Keep perks on Grasshop.`,

			res: "steel",
			icon: ['Curr/Perks','Icons/StarProgression'],

			cost: i => E(1e11),
			bulk: i => 1,
		},{
			max: 10,

			title: "Challenge Save P",
			desc: `Keep Prestige Challenges.`,

			res: "pp",
			icon: ['Icons/Challenge','Icons/StarProgression'],

			cost: i => E(10).pow((i/2+15)**1.5),
			bulk: i => Math.floor(E(i).log10().root(1.5).sub(15).mul(2).toNumber())+1,

			effect(i) {
				return i
			},
			effDesc: x => "Up to "+format(x,0)+" completions",
		},{
			max: 7,

			title: "Challenge Save C",
			desc: `Keep Crystalize Challenges.`,

			res: "crystal",
			icon: ['Icons/Challenge','Icons/StarProgression'],

			cost: i => E(10).pow(i/2+15),
			bulk: i => Math.floor(E(i).log10().sub(15).mul(2).toNumber())+1,

			effect(i) {
				return i
			},
			effDesc: x => "Up to "+format(x,0)+" completions",
		},{
			title: "Challenge Save G",
			desc: `Keep Challenges on Grasshop.`,

			res: "steel",
			icon: ['Icons/Challenge','Icons/StarProgression'],

			cost: i => E(1e8),
			bulk: i => 1,

		},{
			max: 5,

			title: "Challenge Auto",
			desc: `Automatically gain Prestige / Crystalize Challenges up to your best.`,

			res: "steel",
			icon: ['Icons/Challenge','Icons/Automation'],

			cost: i => E(1e10).mul(E(1e3).pow(i)),
			bulk: i => E(i).div(1e10).log(1e3).add(1).floor(),

			effect(i) {
				return 30 / i
			},
			effDesc: x => (hasUpgrade("assembler", 8) ? "+1 per "+format(x,0)+" seconds" : "Manual only"),
		},{
			title: "Challenge Bulk",
			desc: `Enter multiple challenges at once.`,

			res: "steel",
			icon: ['Icons/Challenge','Icons/Multiply'],

			cost: i => E(1e7),
			bulk: i => 1,
		},{
			unl: _ => player.rocket.part > 0 || galUnlocked(),
			title: "Quick Foundry",
			desc: `Automate Foundry.`,

			res: "steel",
			icon: ['Icons/Foundry','Icons/Automation'],

			cost: i => E(1e24),
			bulk: i => 1,
		}
	],
}

tmp_update.push(_=>{
	let ms = MAIN.steel
	
	tmp.steelGain = ms.gain()
	tmp.steelGainP = starTreeEff("qol",4,0)
	tmp.foundryEff = ms.foundryEff()
})

el.update.factory = _=>{
	if (mapID == "fd") {
		let unl = MAIN.charger.unl()

		tmp.el.charger_div.setDisplay(unl)

		if (unl) {
			tmp.el.charge_upper.setHTML("<b class='yellow'>Temp. Charge:</b> "+player.chargeRate.format(0)+" <span class='smallAmt'>"+player.chargeRate.formatGain(tmp.charge.gain)+"</span>")
			tmp.el.charge_under.setHTML("<b class='yellow'>Best Charge:</b> "+player.bestCharge.format(0))
			updateEffectHTML("charger")
		}
	}
}

MAIN.charger = {
	unl: _ => hasUpgrade("factory", 2),
	gain() {
		let x = E(1)
		if (!inRecel()) {
			x = E(upgEffect('factory',2)).mul(upgEffect('factory',3)).mul(upgEffect('factory',4))
			x = x.mul(upgEffect('gen',2)).mul(upgEffect('gen',3))
			x = x.mul(upgEffect('plat',7))
			x = x.mul(getGHEffect(9, 1))
			x = x.mul(chalEff(7))

			x = x.mul(aMAIN.chargeGain())
		}

		x = x.mul(upgEffect('rocket',6))
		x = x.mul(upgEffect('rocket',13))
		x = x.mul(upgEffect('rocket',19))
		if (hasUpgrade('momentum', 7)) x = x.mul(3)
		x = x.mul(getAstralEff('ch'))

		return x
	}
}

EFFECT.charger = {
	unl: _ => MAIN.charger.unl(),

	res: _ => player.chargeRate,
	getEff(res, data) {
		if (player.bestCharge.lt(data.req)) return E(0)

		let penalty = E(10).pow(data.offsetOoM).mul(data.req).div(tmp.charge.OoMMul)
		return res.div(penalty.max(1))
	},
	effDesc(desc, data) {
		desc = format(data.req, 0) + " - " + desc
		if (player.bestCharge.gte(data.req)) desc = `<span class='green'>` + desc + "</span>"
		return desc
	},
	
	effs: [
		{
			req: E(1),
			eff: c => player.crystal.add(1).pow(c.add(1).log10().pow(.25).div(20)).pow(upgEffect('sfrgt',4)),
			desc: x => "Crystals give "+format(x)+"x more Steel.",
		},{
			req: E(100),
			eff: c => c.add(1).log10().div(40).add(1),
			desc: x => "Each Tier gives "+format(x)+"x more PP.",
		},{
			req: E(1e6),
			eff: c => E(1).sub(E(1).div(c.add(1).log10().div(20).add(1))).toNumber(),
			desc: x => "Strengthen Grass Upgrade's 'PP' by +"+format(x)+"x.",
		},{
			unl: _ => hasUpgrade("factory", 4) || galUnlocked(),

			req: E(1e9),
			eff: c => E(2).sub(E(1).div(c.add(1).log10().div(15).add(1))).min(1.5).toNumber(),
			desc: x => "Gain " + format(x) + "x Levels in Anti-Realm.",
		},{
			unl: _ => hasUpgrade("factory", 4) || galUnlocked(),

			req: E(1e12),
			eff: c => c.add(1).log10().div(40).toNumber(),
			desc: x => "Increase Tier base by +"+format(x,3)+"x.",
		},{
			unl: _ => hasUpgrade("factory", 4) || galUnlocked(),

			req: E(1e15),
			eff: c => c.add(1).log10().root(1.25).div(10).pow10(),
			desc: x => "Gain more "+format(x,3)+"x TP in Anti-Realm.",
		},{
			unl: _ => hasUpgrade("factory", 4) || galUnlocked(),

			req: E(1e21),
			eff: c => c.add(1).log10().root(1.25).div(10).pow10(),
			desc: x => "Gain more "+format(x,3)+"x Oil.",
		},{
			unl: _ => hasStarTree("progress", 4),

			req: E(1e27),
			eff: c => c.add(1).log10().div(20).pow10(),
			desc: x => "Gain more "+format(x,3)+"x Space Power.",
		},{
			unl: _ => hasUpgrade("funMachine", 2),

			req: E(1e42),
			offsetOoM: 30,
			eff: c => c.add(1).log10().div(15).pow10(),
			desc: x => "Gain more "+format(x,3)+"x Fun.",
		},{
			unl: _ => hasUpgrade("funMachine", 2),

			req: E(1e48),
			offsetOoM: 36,
			eff: c => c.add(1).log10().div(3).pow10(),
			desc: x => "Gain more "+format(x,3)+"x Grass.",
		}
	],
}

function getChargeEff(x, def) {
	return getEffect("charger", x, def)
}

tmp_update.push(_=>{
	if (!MAIN.charger.unl()) return

	tmp.charge = {}
	tmp.charge.gain = MAIN.charger.gain()
	tmp.charge.OoM = getGHEffect(11, 0) + upgEffect('sfrgt', 3, 0)
	tmp.charge.OoMMul = Decimal.pow(10, tmp.charge.OoM)
})