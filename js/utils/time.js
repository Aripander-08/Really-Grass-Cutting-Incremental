el.update.stats = _=>{
	if (mapID == 'time') {
		tmp.el.time.setHTML("Time: " + formatTime(player.time))

		let stats = player.decel == 0 && !inSpace()
		tmp.el.stats.setDisplay(stats || player.options.allStats)
		if (stats || player.options.allStats) {
			tmp.el.statsHeader.setDisplay(player.options.allStats)
			tmp.el.pTimes.setHTML(player.pTimes ? "You did " + player.pTimes + " <b style='color: #5BFAFF'>Prestige</b> resets." + (inDecel() ? "" : "<br>Time: " + formatTime(player.pTime)) : "")
			tmp.el.cTimes.setHTML(player.cTimes ? "You did " + player.cTimes + " <b style='color: #FF84F6'>Crystalize</b> resets." + (inDecel() ? "" : "<br>Time: " + formatTime(player.cTime)) : "")
			tmp.el.sTimes.setHTML(player.sTimes ? "You did " + player.sTimes + " <b style='color: #c5c5c5'>Steelie</b> resets." + (inDecel() ? "" : "<br>Time: " + formatTime(player.sTime)) : "")
		}

		let aStats = player.decel == 1 && !inSpace()
		let aStatsUnl = hasUpgrade("factory", 4) || galUnlocked()
		let aStatsShown = aStatsUnl && (aStats || player.options.allStats)
		tmp.el.aStats.setDisplay(aStatsShown)
		if (aStatsShown) {
			tmp.el.aTimes.setHTML(player.aRes.aTimes ? "You did " + player.aRes.aTimes + " <b style='color: #FF4E4E'>Anonymity</b> resets." + (inRecel() ? "" : "<br>Time: " + formatTime(player.aRes.aTime)) : "")
			tmp.el.lTimes.setHTML(player.aRes.lTimes ? "You did " + player.aRes.lTimes + " <b style='color: #2b2b2b'>Liquefy</b> resets." + (inRecel() ? "" : "<br>Time: " + formatTime(player.aRes.lTime)) : "")
			tmp.el.fTimes.setHTML(player.aRes.fTimes ? "You did " + player.aRes.fTimes + " <b style='color: #dfff79'>Funify</b> resets." + (inRecel() ? "" : "<br>Time: " + formatTime(player.aRes.fTime)) : "")
		}

		let unStats = player.decel == 2 && !inSpace()
		let unStatsUnl = hasUpgrade("funMachine", 3)
		let unStatsShown = unStatsUnl && (unStats || player.options.allStats)
		tmp.el.unStats.setDisplay(unStatsShown)
		if (unStatsShown) {
			tmp.el.unStatsHeader.setDisplay(player.options.allStats)
			tmp.el.nTimes.setHTML(player.unRes.nTimes ? "You did " + player.unRes.nTimes + " <b style='color: #bf3'>Normality</b> resets.<br>Time: " + formatTime(player.unRes.nTime) : "")
			tmp.el.vTimes.setHTML(player.unRes.vTimes ? "You did " + player.unRes.vTimes + " <b style='color: white'>Vaporize</b> resets.<br>Time: " + formatTime(player.unRes.vTime) : "")
		}

		let gStats = inSpace()
		let gStatsUnl = galUnlocked()
		let gStatsShown = gStatsUnl && (gStats || player.options.allStats)
		tmp.el.gStats.setDisplay(gStatsUnl)
		if (gStatsUnl) {
			tmp.el.gTimes.setHTML("You did " + player.gal.times + " <b style='color: #bf00ff'>Galactic</b> resets.<br>Time: " + formatTime(player.gal.time))
			tmp.el.sacTimes.setHTML(gStatsShown && player.gal.sacTimes ? "You did " + player.gal.sacTimes + " <b style='color: #ffa4d9'>Sacrifice</b> resets.<br>Time: " + formatTime(player.gal.sacTime) : "")
		}

		tmp.el.allStatsBtn.setDisplay(hasUpgrade('factory', 4) || galUnlocked())
		tmp.el.allStats.setTxt(player.options.allStats ? "All" : "This realm")
	}
}