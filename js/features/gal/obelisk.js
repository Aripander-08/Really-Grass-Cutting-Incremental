const ASTRAL_PRESTIGE = {
	req: 100,
	extra(p) {
		return p * 5
	},
	scaling(p) {
		return 1 + p ** 1.25 / 2
	}
}

RESET.astral_pres = {
	unl: _ => hasAGHMilestone(20),
	req: _ => true,
	reqDesc: _ => ``,

	resetDesc: `
		Reset your astral to power your Astral bonuses, but also scale Astral.<br><br>
		<span id='nextAPBonus' class='green'></span>
	`,
	resetGain: _=> `Astral: ${format(player.gal.astral, 0)} / ${ASTRAL_PRESTIGE.req}`,

	title: `Astral Prestige`,
	resetBtn: `Do Astral Prestige`,

	reset(force=false) {
		if (player.gal.astral<100) return

		let pres = player.gal.astral_pres
		player.gal.astral_pres++
		player.gal.astral = 0
		player.gal.sp = player.gal.sp.root(ASTRAL_PRESTIGE.scaling(pres+1) / ASTRAL_PRESTIGE.scaling(pres)).div(1e3)
	},
}

const AP_BONUS = ["Planetarium", "Clouds", "Momentum", "Tier Base", "Lunar Power"]

/*
const LUNAR_OB = [
	['Grass Value','Curr/Grass',10,1.1,0.001],
]
const LUNAR_OB_MODE = ['x','^']

tmp_update.push(_=>{
	let x = 1

	tmp.LPgain = x
	tmp.lunar_max_active = 1

	for (let i = 0; i < LUNAR_OB.length; i++) {
		let l = LUNAR_OB[i]

		tmp.lunar_next[i] = Decimal.mul(l[3],player.lunar.level[i]).add(l[2])
		tmp.lunar_eff[i] = player.lunar.level[i] * l[4] + 1
	}
})

function getLPLevel(i, lp = player.lunar.lp[i]) {
	let l = LUNAR_OB[i], b = l[3], s = l[2], x = 0

	let d = lp.mul(8*b).add((2*s-b)**2)
	x = d.sqrt().sub(2*s-b).div(2*b)

	return x.floor().toNumber()
}

function getLEffect(i) { return tmp.lunar_eff[i]||1 }

function chooseLA(i) {
	if (player.lunar.active.includes(i)) player.lunar.active.splice(player.lunar.active.indexOf(i),1)
	else {
		if (player.lunar.active.length >= tmp.lunar_max_active) player.lunar.active.splice(randint(0,player.lunar.active.length-1),1)
		player.lunar.active.push(i)
	}
}

el.setup.obelisk = _ => {
	let el = new Element('lop_table')
	let h = ``

	for (let i in LUNAR_OB) {
		let l = LUNAR_OB[i]

		h += `
		<div>
			<div class="lop_btn" id='lop${i}_btn' onclick='chooseLA(${i})'>
				<img src="images/${l[1]}.png">
				<div id='lop${i}_lvl'>
					The J
				</div>
			</div><div class="lop_progress" id="lop${i}_amt">
				0 / 0
			</div>
		</div>
		`
	}

	el.setHTML(h)
}

for (let i = 0; i < LUNAR_OB.length; i++) {
	if (player.lunar.active.includes(i)) player.lunar.lp[i] = player.lunar.lp[i].add(tmp.LPgain.mul(dt))
	if (player.lunar.lp[i].gte(tmp.lunar_next[i])) player.lunar.level[i] = Math.max(player.lunar.level[i],getLPLevel(i))
}*/

el.update.obelisk = _ => {
	if (mapID == 'ap') {
		let bonus = AP_BONUS[player.gal.astral_pres]
		tmp.el.nextAPBonus.setHTML(bonus ? `You'll unlock the ${bonus} astral bonus.` : ``)
		updateResetHTML("astral_pres")
		tmp.el.reset_btn_astral_pres.setClasses({locked: player.gal.astral < 100})

		/*let unl = player.grassjump>=5
		tmp.el.lunar_obelisk_div.setDisplay(unl)

		if (unl) {
			tmp.el.lp_gain.setHTML(tmp.LPgain.format()+"/s")
			tmp.el.lp_active.setHTML(player.lunar.active.length+" / "+tmp.lunar_max_active)

			for (let i = 0; i < LUNAR_OB.length; i++) {
				let id = 'lop'+i+'_', l = LUNAR_OB[i], lvl = player.lunar.level[i]

				tmp.el[id+'lvl'].setHTML(`
				<div class='cyan'>${l[0]}</div>
				<div class='yellow'>Level ${format(lvl,0)}</div>
				<div class='green'>${LUNAR_OB_MODE[l[5]]+format(tmp.lunar_eff[i],3)} <i style='font-size: 12px; color: grey'>(+${format(l[4],3)})</i></div>
				`)

				let nl = tmp.lunar_next[i]
				let p = l[5]==0?Decimal.pow(lvl,2).sub(lvl).mul(l[3]/2).add(l[2]*lvl):Decimal.pow(l[3],lvl).sub(1).mul(l[2]/(l[3]-1))

				tmp.el[id+'amt'].setHTML(`${player.lunar.lp[i].sub(p).max(0).min(nl).format(0)} / ${nl.format(0)}`)
				tmp.el[id+'btn'].changeStyle('border-color',player.lunar.active.includes(i)?'lime':'white')
			}
		}*/
	}
}