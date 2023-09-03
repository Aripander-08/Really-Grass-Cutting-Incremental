MAIN.sac = {
	dmGain() {
		let x = player.gal.stars.div(1e10).pow(1/4)

		x = x.mul(upgEffect('momentum', 11))
		x = x.mul(upgEffect('moonstone', 7))
		x = x.mul(upgEffect('np', 2))
		return x.floor()
	},
	did() {
		return player?.gal?.sacTimes
	}
}

RESET.sac = {
	unl: _ => hasAGHMilestone(7),
	req: _ => player.gal.stars.gte(1e11),
	reqDesc: _ => `Reach ${format(1e11)} stars.`,

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

			res: "dm",
			icon: ['Icons/TP', 'Icons/StarProgression'],

			cost: 10,

			effect: i => i+1,
			effDesc: x => format(x,0)+"x"
		}, {
			title: "Self-Charge",
			desc: `Anti-Realm <b class="green">doesn't reduce</b> Charge. Bonuses start <b class="green">10x</b> earlier.`,
		
			res: "dm",
			icon: ["Curr/Charge", "Icons/StarProgression"],

			max: Infinity,
			cost: i => Decimal.pow(2,i+2).ceil(),
			bulk: i => i.log(2).sub(2).floor().toNumber()+1,

			effect: i => i,
			effDesc: x => format(E(10).pow(x))+"x",
		}, {
			title: "Dark Momentum",
			desc: `<b class="green">Double</b> Momentum.`,
		
			res: "dm",
			icon: ["Curr/Momentum"],

			unl: _ => tmp.rocket_upgraded,
			cost: i => Decimal.pow(5,(i+3)**1.25).ceil(),
			bulk: i => i.log(5).root(1.25).sub(3).floor().toNumber()+1,
			max: Infinity,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			title: "Dark Stars",
			desc: `<b class="green">Double</b> Stars.`,
		
			res: "dm",
			icon: ["Curr/Star"],

			max: Infinity,
			cost: i => Decimal.pow(5,i+2),
			bulk: i => i.log(5).sub(2).floor().toNumber()+1,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			title: "Dark Powers",
			desc: `<b class='green'>Double</b> XP.`,
		
			res: "dm",
			icon: ["Icons/XP"],

			max: Infinity,
			cost: i => Decimal.pow(10,i+2).ceil(),
			bulk: i => i.log(10).sub(2).floor().toNumber()+1,

			effect: i => E(2).pow(i),
			effDesc: x => format(x)+"x",
		}, {
			title: "Dark Moonstone",
			desc: `Gain <b class="green">+1x</b> more Moonstone.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,

			res: "dm",
			icon: ["Curr/Moonstone"],

			max: Infinity,
			cost: i => Decimal.pow(1.5,i).mul(100).ceil(),
			bulk: i => i.div(100).log(1.5).floor().toNumber()+1,
		
			effect: i => E(2).pow(Math.floor(i/25)).mul(i),
			effDesc: x => "+"+format(x,0),
		}, {
			title: "Super Cool",
			desc: `Raise SFRGT gain by <b class="green">^+0.05</b>.`,
		
			res: "dm",
			icon: ["Curr/SuperFun"],

			cost: i => Decimal.pow(15,(i+1)**1.25).ceil(),
			bulk: i => i.log(15).root(1.25).floor().toNumber(),
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