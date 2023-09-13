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
		Reset Astral to power Astral bonuses, but also scale Astral.<br><br>
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

const AP_BONUS = ["Planetarium", "Clouds", "Lunar Power", "Tier Base", "Cosmic compounding"]

const LUNAR_OB = [
	['Tier Points','Icons/TP'],
	['Space Points','Icons/SP'],
	['Clouds','Curr/Cloud'],
	['Cosmic','Icons/Cosmic'],
	['Rings','Curr/Ring'],
]

tmp_update.push(_=>{
	if (!lunarUnl()) return

	let lt = tmp.gal.lp = {}
	lt.gain = E(1e-3).mul(getAstralEff("lp"))
	if (hasMilestone("pt", 6)) lt.gain = lt.gain.mul(2)

	lt.max = 3
	if (hasMilestone("pt", 7)) lt.max++
	
	lt.eff = []
	for (let i = 0; i < LUNAR_OB.length; i++) lt.eff.push(player.gal.lunar.power[i].add(1).sqrt())
})

function lunarUnl() { return hasMilestone("pt", 5) }

function calcLunar(dt) {
	for (let i of player.gal.lunar.active) player.gal.lunar.power[i] = player.gal.lunar.power[i].add(tmp.gal.lp.gain.mul(dt))
}

function lunarEff(i) { return tmp.gal?.lp?.eff[i] || 1 }

function chooseLA(i) {
	let lsa = player.gal.lunar.active
	if (lsa.includes(i)) lsa.splice(lsa.indexOf(i),1)
	else {
		if (lsa.length >= tmp.gal.lp.max) lsa.splice(randint(0,lsa.length-1),1)
		lsa.push(i)
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
				<div id='lop${i}_lp'></div>
			</div>
		</div>
		`
	}

	el.setHTML(h)
}

el.update.obelisk = _ => {
	if (mapID == 'ap') {
		let bonus = AP_BONUS[player.gal.astral_pres]
		tmp.el.nextAPBonus.setHTML(bonus ? `You'll unlock ${bonus} bonus.` : ``)
		updateResetHTML("astral_pres")
		tmp.el.reset_btn_astral_pres.setClasses({locked: player.gal.astral < 100})

		let unl = lunarUnl()
		tmp.el.lunar_obelisk_div.setDisplay(unl)

		if (unl) {
			let ls = player.gal.lunar, lt = tmp.gal.lp

			tmp.el.lp_gain.setHTML(format(lt.gain,3)+"/s")
			tmp.el.lp_active.setHTML(ls.active.length+" / "+lt.max)

			for (let i = 0; i < LUNAR_OB.length; i++) {
				let id = 'lop'+i+'_', l = LUNAR_OB[i]

				tmp.el[id+'lp'].setHTML(`
				<div class='cyan'>${l[0]}</div>
				<div class='yellow'>${format(ls.power[i])} Power</div>
				<div class='green'>${formatMult(lt.eff[i])}</div>
				`)

				tmp.el[id+'btn'].changeStyle('border-color',ls.active.includes(i)?'lime':'white')
			}
		}
	}
}