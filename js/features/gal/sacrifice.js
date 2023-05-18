MAIN.sac = {
	dmGain() {
		let x = player.gal.stars.div(1e8).cbrt().floor()

		x = x.mul(upgEffect('momentum', 11))
		x = x.mul(upgEffect('moonstone', 7))
		x = x.mul(upgEffect('np', 2))
		x = x.mul(upgEffect("ring", 5))
		x = x.pow(upgEffect('momentum', 14))
		return x
	},
	did() {
		return player?.gal?.sacTimes
	}
}

RESET.sac = {
	unl: _ => hasAGHMilestone(7),

	req: _ => player.gal.stars.gte(1e10),
	reqDesc: _ => `Reach ${format(1e10)} stars.`,

	resetDesc: `Reset everything Galactic does, and so Rocket Fuel, Stars, Astral, Grass-Skips, and Funify (except Fun Machine).`,
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
		player.rocket.amount = 0

		RESET.gal.doReset(order)
	},
}

UPGS.dm = {
	unl: _ => hasAGHMilestone(7),

	title: "Dark Matter Manipulator",

	req: _ => MAIN.sac.did(),
	reqDesc: _ => `Sacrifice once to unlock.`,

	underDesc: _ => getUpgResTitle('dm'),

	ctn: [
		{
			max: Infinity,

			title: "Dark Crystal",
			desc: `Increase Crystal gain by <b class="green">30%</b> compounding per level.`,
		
			res: "dm",
			icon: ["Curr/Crystal"],

			cost: i => Decimal.pow(2,i**1.25).ceil(),
			bulk: i => i.log(2).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Dark Oil",
			desc: `Increase Oil gain by <b class="green">30%</b> compounding per level.`,
		
			res: "dm",
			icon: ["Curr/Oil"],

			cost: i => Decimal.pow(1.7,i**1.25).ceil(),
			bulk: i => i.log(1.7).root(1.25).floor().toNumber()+1,
		
			effect(i) {
				return E(1.3).pow(i)
			},
			effDesc: x => format(x)+"x",
		},{
			max: 25,

			title: "Dark Platinum",
			tier: 2,
			desc: `Increase Platinum gain by <b class="green">+1x</b> per level.`,

			res: "dm",
			icon: ["Curr/Platinum"],

			cost: i => Decimal.pow(3,i).mul(2).ceil(),
			bulk: i => i.div(2).log(3).floor().toNumber()+1,
		
			effect(i) {
				return i+1
			},
			effDesc: x => format(x,0)+"x",
		},{
			max: 1e4,

			title: "Dark Moonstone",
			desc: `Increase Moonstone gain by <b class="green">+1</b> per level.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,

			res: "dm",
			icon: ["Curr/Moonstone"],

			cost: i => Decimal.pow(9,i).mul(5).ceil(),
			bulk: i => i.div(5).log(9).floor().toNumber()+1,
		
			effect(i) {
				return 2 ** Math.floor(i/25) * i
			},
			effDesc: x => "+"+format(x,0),
		},{
			max: Infinity,

			title: "Dark Star",
			desc: `Increase Star gain by <b class="green">+1x</b> per level.<br>This is <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
		
			res: "dm",
			icon: ["Curr/Star"],

			cost: i => Decimal.pow(2,i).mul(50),
			bulk: i => i.div(50).log(2).floor().toNumber()+1,
		
			effect(i) {
				return 2 ** Math.floor(i/25) * (i + 1)
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Dark Momentum",
			desc: `<b class="green">Double</b> Momentum.`,
		
			res: "dm",
			icon: ["Curr/Momentum"],

			unl: _ => ROCKET_PART.upgraded(),
			cost: i => Decimal.pow(6,i**1.25).mul(2e4).ceil(),
			bulk: i => i.div(2e4).log(6).root(1.25).floor().toNumber()+1,

			effect(i) {
				return E(2).pow(i)
			},
			effDesc: x => format(x)+"x",
		}, {
			title: "Self-Charge",
			desc: `Anti-Realm charge penalty is <b class="green">removed</b>.`,
		
			res: "dm",
			icon: ["Curr/Charge", "Icons/StarProgression"],

			unl: _ => ROCKET_PART.upgraded(),
			cost: i => E(1e6),
			bulk: i => 1,
		}
	]
}

tmp_update.push(_=>{
	if (!tmp.gal) return
	tmp.gal.dmGain = MAIN.sac.dmGain()
})