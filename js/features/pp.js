MAIN.pp = {
	gain() {
		let x = Decimal.pow(1.15,player.level)

		x = x.mul(upgEffect('grass',5))
		x = x.mul(upgEffect('plat',3))
		x = x.mul(upgEffect('perk',6))
		x = x.mul(chalEff(4))

		x = x.mul(E(getChargeEff(1)).pow(player.tier))

		x = x.mul(upgEffect('rocket',3))
		x = x.mul(upgEffect('rocket',11))
		if (hasUpgrade('momentum', 4)) x = x.mul(3)

		return x.floor()
	},
}

RESET.pp = {
	unl: _=> player.decel == 0,

	req: _=>player.level>=20,
	reqDesc: `Reach Level 20.`,

	resetDesc: `Reset your grass, upgrades, level, and perks.`,
	resetGain: _=> `
		<b>+${tmp.ppGain.format(0)}</b> Prestige Points
		${player.pTimes ? '' : '<br><b class="cyan">Also unlock Tiers, which boosts value on tier up!</b>'}
	`,

	title: `Prestige`,
	resetBtn: `Prestige`,
	hotkey: `P`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.pp = player.pp.add(tmp.ppGain)
				player.pTimes++
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="p") {
		player.pTime = 0
		player.grass = E(0)
		player.xp = E(0)
		player.level = 0

		let keep_perk = ((order == "p" && hasUpgrade('auto',4)) ||
			(order == "c" && !inChal(3) && hasUpgrade('auto',6)) ||
			(order == "gh" && !inChal(7) && hasUpgrade('assembler',4))) &&
			!player.options.losePerks
		if (!keep_perk) {
			resetUpgrades('perk')
			player.maxPerk = 0
			player.spentPerk = 0
		}

		resetUpgrades('grass')
		resetGrasses()
		updateTemp()
	},
}

UPGS.pp = {
	unl: _=> player.decel == 0,

	title: "Prestige Upgrades",

	cannotBuy: _=>inChal(4) || inChal(5),

	autoUnl: _=>hasUpgrade('auto',5),
	noSpend: _=>hasUpgrade('assembler',1),

	req: _=>player.pTimes > 0,
	reqDesc: `Prestige once to unlock.`,

	underDesc: _ => getUpgResTitle('pp') + (tmp.ppGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.pp,tmp.ppGain.mul(tmp.ppGainP))+"</span>" : ""),

	ctn: [
		{
			max: Infinity,

			title: "Grass Value II",
			tier: 2,
			desc: `Increase grass gain by <b class="green">+25%</b> per level.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
		
			res: "pp",
			icon: ["Curr/Grass"],
						
			cost: i => Decimal.pow(1.2,i).mul(3).ceil(),
			bulk: i => i.div(3).max(1).log(1.2).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(2,Math.floor(i/25)).mul(i/4+1)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "XP II",
			tier: 2,
			desc: `Increase XP gain by <b class="green">+25%</b> per level.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
		
			res: "pp",
			icon: ["Icons/XP"],
						
			cost: i => Decimal.pow(1.2,i).mul(5).ceil(),
			bulk: i => i.div(5).max(1).log(1.2).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(2,Math.floor(i/25)).mul(i/4+1)
				if (inChal(1)) x = E(1)
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: _ => 125 + starTreeEff("progress", 5, 0),

			title: "TP",
			desc: `Increase Tier Points (TP) gain by <b class="green">20%</b> compounding per level.`,

			res: "pp",
			icon: ["Icons/TP"],
						
			cost: i => Decimal.pow(1.2,i**1.25).mul(20).ceil(),
			bulk: i => i.div(20).max(1).log(1.2).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.2,i)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 1000,

			unl: _=>player.cTimes>0,

			title: "Crystal",
			tier: 2,
			desc: `Increase Crystal gain by <b class="green">+50%</b> per level.<br>This is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,

			res: "pp",
			icon: ["Curr/Crystal"],

			cost: i => Decimal.pow(2,i).mul(1e9).ceil(),
			bulk: i => i.div(1e9).max(1).log(2).floor().toNumber()+1,

			effect(i) {
				let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/2+1)
				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			unl: _=>hasStarTree("progress", 2),

			title: "Weak TP",
			desc: `Increase Tier Points (TP) gain by <b class="green">20%</b> compounding per level.`,

			res: "pp",
			icon: ["Icons/TP"],

			cost: i => Decimal.pow(50,i**1.25).mul(1e80).ceil(),
			bulk: i => i.div(1e80).max(1).log(50).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				let x = Decimal.pow(1.2,i)
		
				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

tmp_update.push(_=>{
	tmp.ppGain = MAIN.pp.gain()
	tmp.ppGainP = (upgEffect('auto',8,0)+upgEffect('gen',0,0)+starTreeEff("qol",0,0))*upgEffect('factory',1,1)
})