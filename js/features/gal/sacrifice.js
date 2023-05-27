MAIN.sac = {
	dmGain() {
		let x = player.gal.stars.div(1e6).pow(.25).floor()

		x = x.mul(upgEffect('momentum', 11))
		x = x.mul(upgEffect('moonstone', 7))
		x = x.mul(upgEffect('np', 2))
		x = x.pow(upgEffect("ring", 7))
		return x
	},
	did() {
		return player?.gal?.sacTimes
	}
}

RESET.sac = {
	unl: _ => hasAGHMilestone(7),

	req: _ => player.gal.stars.gte(1e9),
	reqDesc: _ => `Reach ${format(1e9)} stars.`,

	resetDesc: `Reset everything Galactic does, and so Stars, Astral, Grass-Skips, and Funify.`,
	resetGain: _ => `<b>+${tmp.gal.dmGain.format(0)}</b> Dark Matters`,

	title: `Dark Matter Plant`,
	resetBtn: `Sacrifice!`,

	reset(force=false) {
		if (this.req()||force) {
			if (!force) {
				player.gal.dm = player.gal.dm.add(tmp.gal.dmGain)
				player.gal.sacTimes++

				mapPos.earth = [1, 1]
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="sac") {
		player.gal.sacTime = 0

		resetUpgrades('fundry')
		resetUpgrades('sfrgt')

		player.rocket.amt = 0
		player.gal.sp = E(0)
		player.gal.astral = 0
		player.gal.stars = E(0)
		player.aRes.grassskip = E(0)
		player.aRes.fun = E(0)
		player.aRes.sfrgt = E(0)

		RESET.gal.doReset(order)
	},
}

UPGS.dm = {
	unl: _ => hasAGHMilestone(7),
	autoUnl: _ => hasStarTree("auto", 12),
	noSpend: _ => hasStarTree("auto", 12),

	title: "Dark Matter Manipulator",

	req: _ => MAIN.sac.did(),
	reqDesc: _ => `Sacrifice once to unlock.`,

	underDesc: _ => getUpgResTitle("dm"),

	ctn: [
		{
			title: "Astral Supertier",
			desc: `Astral TP effect is <b class='green'>better</b>.`,

			res: "ring",
			icon: ['Icons/TP', 'Icons/StarProgression'],

			cost: i => E(25),
			bulk: i => 1,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Self-Charge",
			desc: `Anti-Realm <b class="green">doesn't reduce</b> Charge. Charge bonuses start <b class="green">10x</b> later.`,
		
			res: "dm",
			icon: ["Curr/Charge", "Icons/StarProgression"],

			cost: i => Decimal.pow(10,i).ceil(),
			bulk: i => i.log(10).floor().toNumber()+1,
			max: Infinity,

			effect: i => i,
			effDesc: x => format(E(10).pow(x))+"x",
		}, {
			title: "Dark Momentum",
			desc: `<b class="green">Double</b> Momentum.`,
		
			res: "dm",
			icon: ["Curr/Momentum"],

			unl: _ => tmp.rocket_upgraded,
			cost: i => Decimal.pow(25,i**1.25+5).ceil(),
			bulk: i => i.log(25).sub(5).root(1.25).floor().toNumber()+1,
			max: Infinity,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			title: "Dark Stars",
			desc: `<b class="green">Double</b> Stars.`,
		
			res: "dm",
			icon: ["Curr/Star"],

			cost: i => Decimal.pow(10,i).mul(5),
			bulk: i => i.div(5).log(10).floor().toNumber()+1,
			max: Infinity,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			title: "Dark Powers",
			desc: `Raise Astral XP effect by <b class="green">^+0.1</b>.`,
		
			res: "dm",
			icon: ["Icons/SP"],

			cost: i => Decimal.pow(10,i**1.25).mul(5).ceil(),
			bulk: i => i.div(5).log(10).root(1.25).floor().toNumber()+1,
			max: 10,

			effect: i => i/10+1,
			effDesc: x => "^"+format(x, 1),
		}, {
			title: "Dark Moonstone",
			desc: `Gain <b class="green">+1x</b> more Moonstone.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,

			res: "dm",
			icon: ["Curr/Moonstone"],

			cost: i => Decimal.pow(1.3,i).mul(100).ceil(),
			bulk: i => i.div(100).log(1.3).floor().toNumber()+1,
			max: 1e4,
		
			effect: i => 2 ** Math.floor(i/25) * i,
			effDesc: x => "+"+format(x,0),
		}, {
			title: "Super Cool",
			desc: `Raise SFRGT gain by <b class="green">^+0.05</b>.`,
		
			res: "dm",
			icon: ["Curr/SuperFun"],

			cost: i => Decimal.pow(10,i**1.25).ceil(),
			bulk: i => i.log(10).root(1.25).floor().toNumber()+1,
			max: 10,

			effect: i => i/20+1,
			effDesc: x => "^"+format(x),
		}
	]
}

tmp_update.push(_=>{
	if (!tmp.gal) return
	tmp.gal.dmGain = MAIN.sac.dmGain()
	tmp.gal.dmGainP = upgEffect('res', 2, 0)
})