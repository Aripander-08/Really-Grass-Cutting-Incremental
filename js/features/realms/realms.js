let REALMS = {
	accel: {
		on: r => r == 0,
		grass() {
			let x = E(1)
			x = x.mul(upgEffect('grass',0))
			x = x.mul(upgEffect('perk',0))
			x = x.mul(upgEffect('pp',0))
			x = x.mul(upgEffect('crystal',0))
			x = x.mul(upgEffect('plat',2))
			return x
		},
		xp() {
			let x = E(1)
			x = x.mul(upgEffect('grass',3))
			x = x.mul(upgEffect('perk',3))
			x = x.mul(upgEffect('pp',1))
			x = x.mul(upgEffect('crystal',1))
			x = x.mul(upgEffect('plat',1))
			return x
		},
		tp() {
			let x = E(1)
			x = x.mul(upgEffect('pp',2))
			x = x.mul(upgEffect('pp',4))
			x = x.mul(upgEffect('crystal',2))
			x = x.mul(upgEffect('plat',4))
			x = x.mul(upgEffect('perk',7))
			return x
		}
	},
	earth: {
		on: r => r < 3,
		grass() {
			let x = E(1)
			x = x.mul(chalEff(0))
			x = x.mul(upgEffect('rocket',0))
			x = x.mul(upgEffect('rocket',17))
			if (hasUpgrade('momentum', 0)) x = x.mul(3)
			x = x.mul(getAstralEff("gr"))
			return x
		},
		xp() {
			let x = E(1)
			if (player.grasshop >= 7) x = x.mul(2)
			x = x.mul(chalEff(1))
			x = x.mul(upgEffect('rocket',1))
			x = x.mul(upgEffect('rocket',10))
			if (hasUpgrade('momentum', 2)) x = x.mul(3)
			x = x.mul(getAstralEff('xp'))
			x = x.mul(upgEffect("dm", 4))
			return x
		},
		tp() {
			if (!player.pTimes) return E(0)
			if (inChal(2)) return E(0)

			let x = E(1)
			if (player.grasshop >= 1) x = x.mul(2)
			x = x.mul(chalEff(2))
			x = x.mul(upgEffect('rocket',2))
			if (hasUpgrade('momentum', 3)) x = x.mul(3)
			x = x.mul(getAstralEff('tp'))
			x = x.mul(upgEffect("dm",0))
			x = x.mul(lunarEff(0))
			return x
		}
	},
}

function updateRealmTemp() {
	const data = {}
	for (const [id, realm] of Object.entries(REALMS)) {
		data[id] = {
			grass: realm.grass(),
			xp: realm.xp(),
			tp: realm.tp()
		}
	}

	//Tmp
	tmp.realm.src = getRealmSrc(player.decel)
	tmp.realm.in = getRealmGrasses()

	const data_gain = {}
	tmp.realm.gain = data_gain
	for (const i of getRealmGrasses()) {
		const realmData = {
			grass: E(1),
			xp: E(1),
			tp: E(1)
		}
		data_gain[i] = realmData

		for (const [id, realm] of Object.entries(REALMS)) {
			if (!realm.on(i)) continue
			const subData = data[id]
			realmData.grass = realmData.grass.mul(subData.grass)
			realmData.xp = realmData.xp.mul(subData.xp)
			realmData.tp = realmData.tp.mul(subData.tp)
		}

		if (i != 3) {
			const tv = MAIN.tier.mult(getRealmSrc(i).tier, i)
			realmData.grass = realmData.grass.mul(tv)
			realmData.xp = realmData.xp.mul(tv)
		}
	}
}

function getRealmSrc(type) {
	if (type === undefined) return tmp.realm.src
	return [player, player.aRes, player.unRes, player.planetoid][type]
}

function getRealmGrasses() {
	let r = [player.decel]
	if (hasUpgrade('factory', 4) && hasStarTree("qol", 13) && !inRecel()) r = [0,1]
	return r
}

function whatRealm() {
	if (player.decel === true) return 1
	return player.decel || 0
}

function cutRealmGrass(type, v, tv) {
	let src = getRealmSrc(type)
	let gain = tmp.realm.gain[type]

	src.grass = src.grass.add(gain.grass.mul(tv))
	src.xp = src.xp.add(gain.xp.mul(tv))
	if (src.tp) src.tp = src.tp.add(gain.tp.mul(v))
}

function switchRealm(x) {
	player.decel = player.decel == x ? 0 : x
	if (keepAccelOnDecel()) {
		player.chargeRate = E(0)
		updateTemp()
	} else RESET.steel.doReset(true)
}