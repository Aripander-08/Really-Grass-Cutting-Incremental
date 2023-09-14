function calc(dt) {
	let trial = inPlanetoidTrial()
	if (trial) tmp.offline = 0

	if (tmp.offline > 0) {
		let dt_add = Math.min(Math.max(tmp.offline / 50, dt), tmp.offline)
		tmp.offline -= dt_add
		dt += dt_add
	}
	player.time += dt

	//SUPERNOVA
	//soon

	//GALACTIC
	if (galUnlocked()) galTick(dt)
	if (trial) planetoidTick(dt)

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
	for (const i of tmp.realm.in) MAIN.levelUp(i)
	player.maxPerk = Math.max(player.maxPerk, tmp.perks)
	for (let x in UPGS) if (tmp.upgs[x].autoUnl && player.autoUpg[x]) buyAllUpgrades(x,true)

	//GRASS
	let auto_spawn = 0
	if (tmp.grassSpawn) {
		tmp.spawn_time += dt
		auto_spawn = Math.floor(tmp.spawn_time / tmp.grassSpawn)
		tmp.spawn_time -= auto_spawn * tmp.grassSpawn
		auto_spawn *= tmp.spawnAmt
	}

	let auto_cut = 0
	if (tmp.autocut) {
		tmp.autocutTime += dt
		auto_cut = Math.floor(tmp.autocutTime / tmp.autocut)
		tmp.autocutTime -= auto_cut * tmp.autocut
		auto_cut *= tmp.autocutAmt
	}

	let grass = tmp.grasses
	for (let i = 0; i < Math.min(auto_spawn, 100); i++) createGrass()
	for (let i = 0; i < Math.min(auto_cut, 100); i++) {
		let r = randint(0, grass.length-1)
		let g = grass[r]
		if (g && !g.habit) removeGrass(r, Math.max(auto_cut / 100, 1))
	}

    player.maxPerk = Math.max(player.maxPerk, tmp.perks)

    /*if (tmp.ringGen > 0) player.planetoid.ring = player.planetoid.ring.add(tmp.ringGain.mul(dt*tmp.ringGen))

    if (tmp.aGen > 0) {
        player.planetoid.astro = player.planetoid.astro.add(tmp.astroGain.mul(dt*tmp.aGen))
        player.planetoid.bestAstro = player.planetoid.bestAstro.max(player.planetoid.astro)
    }

    if (tmp.measureGen > 0) {
        player.planetoid.measure = player.planetoid.measure.add(tmp.measureGain.mul(dt*tmp.measureGen))
        player.planetoid.bestMeasure = player.planetoid.bestMeasure.max(player.planetoid.measure)
    }

    if (tmp.planetGen > 0) {
        player.planetoid.planet = player.planetoid.planet.add(tmp.planetGain.mul(dt*tmp.planetGen))
        player.planetoid.bestPlanet = player.planetoid.bestPlanet.max(player.planetoid.planet)
    }

    if (tmp.dmGen > 0) player.dm = player.dm.add(tmp.dmGain.mul(dt*tmp.dmGen))

    for (let i = 0; i < LUNAR_OB.length; i++) {
        if (player.lunar.active.includes(i) || hasSolarUpgrade(2,4)) player.lunar.lp[i] = player.lunar.lp[i].add(tmp.LPgain.mul(dt))
        if (player.lunar.lp[i].gte(tmp.lunar_next[i])) player.lunar.level[i] = Math.max(player.lunar.level[i],getLPLevel(i))
    }

    if (player.constellation.unl) {
        player.constellation.line = player.constellation.line.add(tmp.lineGain.mul(dt))
        player.constellation.arc = player.constellation.arc.add(tmp.arcGain.mul(dt))

        player.constellation.arcUnl = player.constellation.arcUnl || player.constellation.arc.gt(0)
    }

    if (player.grassjump>=16) {
        player.darkCharge = player.darkCharge.add(tmp.darkChargeRate.mul(dt))
    }

    if (player.grassjump>=30) {
        player.stardust = player.stardust.add(tmp.stardustGain.mul(dt))
        player.stargrowth = player.stargrowth.add(tmp.growSpeed.mul(dt))
    }

    player.planetoid.bestPm = player.planetoid.bestPm.max(player.planetoid.pm)

    if (hasSolarUpgrade(0,4)) {
       if (recel) player.grassjump = Math.max(player.grassjump,MAIN.gj.bulk())
    }
    calcSupernova(dt)*/
}