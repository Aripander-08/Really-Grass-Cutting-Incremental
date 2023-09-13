function loop() {
	var date = Date.now()
	diff = Date.now() - player.lastTick
	updateTemp()
	updateHTML()
	calc(diff/1000);

	player.lastTick = date
}

var player = {}, date = Date.now(), diff = 0;
const MAIN = {
	level: {
		gain(realm = player.decel) {
			return tmp.realm.gain[realm].xp
		},
		req(lvl, realm = player.decel) {
			if (realm == 1) lvl /= getChargeEff(3)
			let x = Decimal.pow(1.4, lvl).mul(20)

			return x.ceil()
		},
		bulk(xp, realm = player.decel) {
			let x = xp.div(20)
			if (x.lt(1)) return 0

			x = x.log(1.4).toNumber()
			if (realm == 1) x *= getChargeEff(3)
			return Math.floor(x)+1
		},
		cur(i) {
			return i > 0 ? this.req(i-1) : E(0) 
		},
		perk() {
			let x = chalEff(3)
			if (player.grasshop >= 4) x += getGHEffect(3, 0)
			if (hasAGHMilestone(9)) x++
			if (inChal(7)) x = 1

			return Math.floor(x * player.level)
		},
	},
	tier: {
		gain(realm = player.decel) {
			return tmp.realm.gain[realm].tp
		},
		req(i) {
			let x = Decimal.pow(4,i).mul(300)
			return x
		},
		bulk(i) {
			let x = i.div(300)
			if (x.lt(1)) return 0
			x = x.log(4)
			return Math.floor(x.toNumber()+1)
		},
		cur(i) {
			return i > 0 ? this.req(i-1) : E(0) 
		},
		base(realm = player.decel) {
			let x = realm ? 2.25 : upgEffect('crystal', 3, 2.25)
			if (player.grasshop >= 5) x += 0.1
			if (realm < 2) x += getChargeEff(4, 0)
			x += getAstralEff("tb", 0)
			return x
		},
		mult(i, realm = player.decel) {
			return realm == 3 ? E(1) : Decimal.pow(MAIN.tier.base(realm), i)
		},
	},
	levelUp(realm) {
		let src = getRealmSrc(realm)
		src.level = Math.max(src.level, MAIN.level.bulk(src.xp, realm))
		if (src.tier !== undefined) src.tier = Math.max(src.tier, MAIN.tier.bulk(src.tp, realm))
	}, 
}

el.update.main = _=>{
	tmp.el.offline.setDisplay(CHEAT || tmp.offline > 0)
	tmp.el.offline.setTxt(CHEAT ? `Dev Mode` : `Offline: ${formatTime(tmp.offline)} left`)

	let g = tmp.realm.src.grass
	tmp.el.grassAmt.setHTML(g.format(0))
	tmp.el.grassGain.setHTML(tmp.autocut ? formatGain(tmp.grassGain.mul(tmp.autocutBonus * tmp.autocutAmt / tmp.autocut)) : "")

	let level_unl = player.level || player.pTimes
	tmp.el.level.setDisplay(level_unl && !inSpace())
	if (level_unl) {
		tmp.el.level_top_bar.changeStyle("width",tmp.level.percent*100+"%")
		tmp.el.level_top_info.setHTML(`Level <b class="cyan">${format(tmp.realm.src.level,0)}</b>`)
	}

	let tier_unl = player.pTimes > 0 && tmp.realm.src.tp
	tmp.el.tier.setDisplay(tier_unl && !inSpace())
	if (tier_unl) {
		tmp.el.tier_top_bar.changeStyle("width",tmp.tier.percent*100+"%")
		tmp.el.tier_top_info.setHTML(`Tier <b class="yellow">${format(tmp.realm.src.tier,0)}</b>`)
	}

	if (mapID != 'g') return

	tmp.el.levels_info.setDisplay(!inPlanetoid())
	if (inPlanetoid()) return

	tmp.el.level_amt.setTxt(format(tmp.realm.src.level,0))
	tmp.el.level_progress.setTxt(tmp.level.progress.format(0)+" / "+tmp.level.next.sub(tmp.level.cur).format(0)+" XP")
	tmp.el.level_bar.changeStyle("width",tmp.level.percent*100+"%")
	tmp.el.level_cut.setTxt("+"+tmp.level.gain.format(1)+" XP/cut")

	tmp.el.tier_div.setDisplay(tier_unl)
	if (tier_unl) {
		tmp.el.tier_amt.setTxt(format(tmp.realm.src.tier,0))
		tmp.el.tier_progress.setTxt(tmp.tier.progress.format(0)+" / "+tmp.tier.next.sub(tmp.tier.cur).format(0)+" TP")
		tmp.el.tier_bar.changeStyle("width",tmp.tier.percent*100+"%")
		tmp.el.tier_cut.setTxt("+"+tmp.tier.gain.format(1)+" TP/cut")
		tmp.el.tier_mult.setTxt(formatMult(tmp.tier.mult,0)+" → "+formatMult(MAIN.tier.mult(tmp.realm.src.tier+1),0)+" multiplier")
	}
}

tmp_update.push(_=>{
	tmp.grassGain = MAIN.grass.gain()
	tmp.grassCap = MAIN.grass.cap()
	tmp.grassSpawn = MAIN.grass.spawn()
	tmp.rangeCut = MAIN.grass.range()
	tmp.spawnAmt = 1+upgEffect('perk',5,0)+upgEffect('crystal',5,0)

	tmp.autocut = MAIN.grass.auto()
	tmp.autocutBonus = upgEffect('auto',1)
	tmp.autocutAmt = 1+upgEffect('auto',2,0)

	let lvl = tmp.realm.src.level
	tmp.level.gain = MAIN.level.gain()
	tmp.level.next = MAIN.level.req(lvl)
	tmp.level.bulk = MAIN.level.bulk(tmp.realm.src.xp)
	tmp.level.cur = MAIN.level.cur(lvl)
	tmp.level.progress = tmp.realm.src.xp.sub(tmp.level.cur).max(0).min(tmp.level.next)
	tmp.level.percent = tmp.level.progress.div(tmp.level.next.sub(tmp.level.cur)).max(0).min(1).toNumber()
	tmp.perks = MAIN.level.perk()

	let tier = tmp.realm.src.tier
	if (tier !== undefined) {
		tmp.tier.gain = MAIN.tier.gain()
		tmp.tier.next = MAIN.tier.req(tier)
		tmp.tier.bulk = MAIN.tier.bulk(tmp.realm.src.tp)
		tmp.tier.cur = MAIN.tier.cur(tier)
		tmp.tier.progress = tmp.realm.src.tp.sub(tmp.tier.cur).max(0).min(tmp.tier.next)
		tmp.tier.percent = tmp.tier.progress.div(tmp.tier.next.sub(tmp.tier.cur)).max(0).min(1).toNumber()
		tmp.tier.mult = MAIN.tier.mult(tier)
	} else tmp.tier = {}

	tmp.platChance = 0.001
	if (player.grasshop >= 6) tmp.platChance *= 2
	if (!player.decel && hasGSMilestone(6)) tmp.platChance *= 2
	tmp.platChance += upgEffect('rocket',16,0)

	tmp.platGain = 1 + chalEff(5,0) + upgEffect('moonstone', 0)
	if (player.grasshop >= 3) tmp.platGain += getGHEffect(2, 0)
	tmp.platGain = E(tmp.platGain).mul(upgEffect('moonstone', 8))
})

let shiftDown = false
window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) shiftDown = true;
	switch (event.key.toLowerCase()) {
		case "p":
			if (shiftDown) RESET.rocket_part.reset()
			else if (inPlanetoid()) RESET.astro.reset()
			else if (inRecel()) RESET.np.reset()
			else if (inDecel()) RESET.ap.reset()
			else RESET.pp.reset()
			break;
		case "c":
			if (inPlanetoid()) RESET.quadrant.reset()
			else if (inRecel()) RESET.vapor.reset()
			else if (inDecel()) RESET.oil.reset()
			else RESET.crystal.reset()
			break;
		case "g":
			if (shiftDown) RESET.gal.reset()
			else if (inRecel()) RESET.gj.reset()
			else if (inDecel()) RESET.gs.reset()
			else RESET.gh.reset()
			break;
		case "s":
			if (shiftDown && player.decel == 1) RESET.fun.reset()
			if (shiftDown && player.decel == 0) RESET.steel.reset()
			break;
		case "f":
			ROCKET.create()
			break;
		case "t":
			if (shiftDown) RESET.recel.reset()
			else RESET.decel.reset()
			break;
		case "m":
			openMap()
			break;
		case "n":
			RESET[inPlanetoid() ? "planetoid_exit" : "planetoid"].reset()
			break;
		case "z":
			goToSpace()
			break;
	}
}, false);
window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) {
		shiftDown = false;
	}
}, false);

//CHEATING
let CHEAT = false