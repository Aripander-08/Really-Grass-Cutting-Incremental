function calc(dt) {
	if (tmp.offline > 0) {
		let dt_add = Math.min(Math.max(tmp.offline / 50, dt), tmp.offline)
		tmp.offline -= dt_add
		dt += dt_add
	}
	player.time += dt

	//GALACTIC
	if (galUnlocked()) galTick(dt)
	if (player.planetoid?.started && !player.planetoid?.pause) planetoidTick(dt)

	//UNNATURAL REALM
	if (player.unRes) {
		player.unRes.nTime += dt
		player.unRes.vTime += dt

		if (RESET.np.req()) player.unRes.np = tmp.unRes.npGain.mul(dt * tmp.unRes.npGainP).add(player.unRes.np)
		if (RESET.vapor.req() && hasUpgrade('res', 8)) player.unRes.cloudProd = tmp.unRes.clGain.mul(0.01).max(player.unRes.cloudProd)
		player.unRes.cloud = player.unRes.cloudProd.mul(dt).add(player.unRes.cloud)
	}
	if (tmp.unRes.habit) unMAIN.habit.tick(dt)

	//ANTI-REALM
	if (player.aRes) {
		if (!inRecel()) {
			player.aRes.aTime += dt
			player.aRes.lTime += dt
			player.aRes.fTime += dt

			if (tmp.aRes.apGainP > 0 && player.aRes.level >= 30) player.aRes.ap = player.aRes.ap.add(tmp.aRes.apGain.mul(dt*tmp.aRes.apGainP))
			if (tmp.aRes.oilGainP > 0 && player.aRes.level >= 100) player.aRes.oil = player.aRes.oil.add(tmp.aRes.oilGain.mul(dt*tmp.aRes.oilGainP))
			if (tmp.aRes.funGainP > 0 && player.aRes.level >= 270) player.aRes.fun = player.aRes.fun.add(tmp.aRes.funGain.mul(dt*tmp.aRes.funGainP))
			//if (hasStarTree('auto', 10)) ROCKET.create()
		}
		if (tmp.m_prod > 0) player.rocket.momentum = player.rocket.momentum.add(ROCKET_PART.m_gain().mul(dt*tmp.m_prod))
		if (hasUpgrade('funMachine', 1)) player.aRes.sfrgt = player.aRes.sfrgt.add(tmp.aRes.SFRGTgain.mul(dt))
	}

	//STEELIE
	player.sTime += dt
	if (tmp.steelGainP > 0 && player.level >= 240) player.steel = player.steel.add(tmp.steelGain.mul(tmp.steelGainP*dt))

	if (MAIN.charger.unl()) {
		player.chargeRate = player.chargeRate.add(tmp.charge.gain.mul(dt))
		player.bestCharge = player.bestCharge.max(player.chargeRate)
	}
	if (hasUpgrade('res', 0) && ROCKET_PART.can()) RESET.rocket_part.reset()

	//PRESTIGE
	player.pTime += dt
	player.cTime += dt

	if (tmp.ppGainP > 0 && player.level >= 30) player.pp = player.pp.add(tmp.ppGain.mul(dt*tmp.ppGainP))
	if (tmp.crystalGainP > 0 && player.level >= 90) player.crystal = player.crystal.add(tmp.crystalGain.mul(dt*tmp.crystalGainP))

	if (inDecel()) player.chal.progress = {}
	for (var i in CHALS) {
		if (inChalCond(i) && tmp.chal.bulk[i] > (player.chal.comp[i] || 0)) player.chal.comp[i] = tmp.chal.bulk[i]
		if (player.chal.comp[i] == CHALS[i].max) delete player.chal.progress[i]
		player.chal.max[i] = Math.max(player.chal.comp[i] || 0, player.chal.max[i] || 0)
	}

	if (hasUpgrades("perk")) player.chal.c4 = false
	if (hasUpgrade("assembler", 8)) {
		player.chal.time = (player.chal.time || 0) + dt / autoChalTime()
		for (var i = 0; i < 6; i++) player.chal.comp[i] = Math.min(player.chal.comp[i] + Math.floor(player.chal.time), player.chal.max[i])
		player.chal.time -= Math.floor(player.chal.time)
	}

	//START
	tmp.spawn_time += dt
	tmp.autocutTime += dt

	let auto_spawn = Math.floor(tmp.spawn_time / tmp.grassSpawn)
	let auto_cut = Math.floor(tmp.autocutTime / tmp.autocut)

	tmp.spawn_time -= auto_spawn * tmp.grassSpawn
	tmp.autocutTime -= auto_cut * tmp.autocut
	auto_spawn *= tmp.spawnAmt
	auto_cut *= tmp.autocutAmt

	let grass = tmp.grasses
	for (let i = 0; i < Math.min(auto_spawn, 100); i++) createGrass()
	for (let i = 0; i < Math.min(auto_cut, 100); i++) {
		let r = randint(0, grass.length-1)
		let g = grass[r]
		if (g && !g.habit) removeGrass(r, Math.max(auto_cut / 100, 1))
	}

	for (const i of tmp.realm.in) MAIN.levelUp(i)
	for (let x in UPGS) if (tmp.upgs[x].autoUnl && player.autoUpg[x]) buyAllUpgrades(x,true)
	player.maxPerk = Math.max(player.maxPerk, tmp.perks)
}