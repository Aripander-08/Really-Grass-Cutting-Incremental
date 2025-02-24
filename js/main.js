function loop() {
    diff = Date.now() - date
    updateTemp()
    updateHTML()
    calc(diff/1000);
    date = Date.now();
}

var player = {}, date = Date.now(), diff = 0;
const MAIN = {
    grassGain() {
        let x = Decimal.mul(5,upgEffect('grass',0)).mul(tmp.tier.mult).mul(tmp.compact)

        x = x.mul(upgEffect('perk',0))
        x = x.mul(upgEffect('pp',0))
        x = x.mul(upgEffect('crystal',0))
        x = x.mul(upgEffect('plat',2))

        x = x.mul(chalEff(1))

        if (player.grasshop >= 1) {
            x = x.mul(5).mul(getGHEffect(0))
        }

        x = x.mul(upgEffect('aGrass',3))
        x = x.mul(upgEffect('ap',0))
        x = x.mul(upgEffect('oil',0))

        x = x.mul(upgEffect('rocket',0))
        x = x.mul(upgEffect('momentum',0)).mul(upgEffect('momentum',10))

        x = x.mul(tmp.chargeEff[4]||1)

        x = x.mul(starTreeEff('speed',3)*starTreeEff('speed',10)*starTreeEff('speed',15))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',0))

        x = x.mul(upgEffect('np',0))

        if (player.lowGH <= 36) x = x.mul(getAGHEffect(0))

        if (player.decel) x = x.div(1e15)

        if (player.recel) x = x.div(1e170)

        if (x.lt(1)) return x

        x = x.pow(chalEff(3)).pow(getLEffect(0))
        if (!player.recel) x = x.pow(upgEffect('unGrass',5))
        if (inChal(3) || inChal(5)) x = x.root(2)
        if (player.recel) x = x.root(2)

        return x
    },
    grassCap() {
        let x = 10+upgEffect('grass',1,0)+upgEffect('perk',1,0)+upgEffect('ap',4,0)+starTreeEff('progress',0,0)
        if (player.options.lowGrass) x = Math.min(x, 250)

        x *= upgEffect('unGrass',1,1)

        x *= starTreeEff('ring',7,1)

        return Math.min(Math.max(10,Math.floor(x/tmp.compact)),4000)
    },
    grassSpawn() {
        let x = 2.5

        if (!player.planetoid.active) {
            x /= upgEffect('grass',2,1)
            x /= upgEffect('perk',2,1)
            x /= upgEffect('aGrass',1,1)
            x /= upgEffect('momentum',1)
            x /= upgEffect('unGrass',0,1)
        }

        x /= upgEffect('planetarium',0,1)
        x /= upgEffect('observ',3,1)
        x /= upgEffect('astro',2,1)

        tmp.gsBeforeCompact = 2/x

        if (player.grassjump>=2) x /= 10

        x = Math.min(Math.max(x*tmp.compact,2e-4),10)

        return x
    },
    compact() {
        if (!hasUpgrade('unGrass',3)) {
            tmp.compact = 1
            return
        }

        let c = upgEffect('unGrass',3,1)
        c *= upgEffect('astro',4,1)
        if (player.grassjump>=2) c **= 2

        tmp.compact = Math.max(Math.min(c,tmp.gsBeforeCompact/100), 1)
    },
    xpGain() {
        let x = Decimal.mul(3,upgEffect('grass',3)).mul(tmp.tier.mult).mul(tmp.compact)

        x = x.mul(upgEffect('perk',3))
        x = x.mul(upgEffect('pp',1))
        x = x.mul(upgEffect('crystal',1))
        x = x.mul(upgEffect('plat',1))

        x = x.mul(chalEff(0))

        x = x.mul(tmp.chargeEff[1]||1)

        if (player.grasshop >= 2) {
            x = x.mul(5).mul(getGHEffect(1))
        }

        x = x.mul(upgEffect('aGrass',4))
        x = x.mul(upgEffect('ap',2))
        x = x.mul(upgEffect('oil',1))
        x = x.mul(upgEffect('momentum',2)).mul(upgEffect('momentum',11))

        x = x.mul(upgEffect('rocket',1))

        x = x.mul(starTreeEff('speed',4)*starTreeEff('speed',11)*starTreeEff('speed',16))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',1))
        
        if (player.lowGH <= 28) x = x.mul(getAGHEffect(1))

        x = x.mul(upgEffect('dm',2))

        x = x.mul(starTreeEff('ring',2))

        x = x.mul(upgEffect('astro',3))

        if (player.planetoid.planetTier>=6) x = x.mul(getPTEffect(3))

        if (player.decel) x = x.div(1e16)

        if (player.recel) x = x.div(1e165)

        if (x.lt(1)) return x

        if (!player.recel) x = x.pow(upgEffect('unGrass',5))
        if (inChal(3) || inChal(5)) x = x.root(2)
        if (player.recel) x = x.pow(player.lowGH<=-36?.75:.5)

        if (!player.decel && hasUpgrade('plat',10)) x = x.pow(upgEffect('plat',10,1))
        x = x.pow(upgEffect('moonstone',6)).pow(upgEffect('measure',3)).pow(getLEffect(1))

        return x
    },
    tpGain() {
        if (inChal(2) || inChal(7)) return E(0)

        let x = upgEffect('pp',2).mul(tmp.compact)

        x = x.mul(upgEffect('crystal',2))
        x = x.mul(upgEffect('perk',6))

        x = x.mul(chalEff(2))

        x = x.mul(tmp.chargeEff[3]||1)

        if (player.grasshop >= 3) {
            x = x.mul(5).mul(getGHEffect(2))
        }

        x = x.mul(upgEffect('ap',3))
        x = x.mul(upgEffect('oil',2))

        x = x.mul(upgEffect('rocket',2))
        x = x.mul(upgEffect('momentum',3))

        x = x.mul(starTreeEff('speed',5)*starTreeEff('speed',12)*starTreeEff('speed',17))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',2))

        if (player.lowGH <= 20) x = x.mul(getAGHEffect(2))

        x = x.mul(upgEffect('dm',0))

        x = x.mul(starTreeEff('ring',3))

        if (player.decel) x = x.div(1e16)

        if (player.recel) x = x.div(1e114)

        if (x.lt(1)) return x

        if (player.grasshop >= 7 || player.lowGH <= 4) x = x.pow(1.25)

        if (inChal(5)) x = x.root(2)
        if (player.recel) x = x.root(2)

        x = x.pow(getLEffect(2))

        return x
    },
    rangeCut: _=>50+upgEffect('grass',4,0)+upgEffect('perk',4,0)+upgEffect('planetarium',3,0),
    autoCut: _=>hasStarTree('reserv',2)?0.01:5-(player.planetoid.active?0:upgEffect('auto',0,0)+upgEffect('plat',0,0)+starTreeEff('progress',3,0)),
    level: {
        req(i) {
            i = E(i).scale(1e5,1.00010,1).scale(tmp.level.scale2,2,0).scale(tmp.level.scale1,2,0)

            if (inChal(0) || inChal(7)) i = i.mul(3)
            
            let x = Decimal.pow(tmp.level.threshold,i.pow(0.75)).mul(50)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(50)
            if (x.lt(1)) return 0
            x = x.log(tmp.level.threshold).root(0.75)

            if (inChal(0) || inChal(7)) x = x.div(3)

            return Math.floor(x.scale(tmp.level.scale1,2,0,true).scale(tmp.level.scale2,2,0,true).scale(1e5,1.00010,1,true).toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        perk() {
            let x = player.level

            return x
        },
    },
    tier: {
        req(i) {
            let pow = player.lowGH <= 12 ? 1.15 : 1.2
            if (player.recel) pow *= 1.1
            let x = Decimal.pow(tmp.level.tier,i**pow).mul(100)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(100)
            if (x.lt(1)) return 0
            let pow = player.lowGH <= 12 ? 1.15 : 1.2
            if (player.recel) pow *= 1.1
            x = x.log(tmp.level.tier).root(pow)

            return Math.floor(x.toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        mult(i) {
            let base = 2 + upgEffect('crystal',5,0) + (tmp.chargeEff[5]||0)

            //if (player.recel) base **= 0.75

            let x = Decimal.pow(base,i)

            return x
        },
    },
    astral: {
        req(i) {
            let ap = player.astralPrestige
            let b = Decimal.pow(10,ap*20+2)

            i += ap*50

            i = E(i).scale(65,2+ap/5,0)

            let x = Decimal.pow(3+ap/5,i).mul(b)

            return x.ceil()
        },
        bulk(i) {
            let ap = player.astralPrestige
            let b = Decimal.pow(10,ap*20+2)

            let x = i.div(b)
            if (x.lt(1)) return 0
            x = x.log(3+ap/5)

            return Math.floor(x.scale(65,2+ap/5,0,true).toNumber()-ap*50+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
    },
    spGain() {
        let x = E(tmp.compact)

        if (player.grassskip>=2) x = x.add(getGSEffect(1,0))

        x = x.mul(starTreeEff('progress',2)*starTreeEff('progress',5)*starTreeEff('progress',8)*starTreeEff('progress',10))

        x = x.mul(upgEffect('sfrgt',1)).mul(upgEffect('sfrgt',6))

        if (player.lowGH <= 4) x = x.mul(10)
        if (player.lowGH <= -8) x = x.mul(getAGHEffect(9,1))
        x = x.mul(upgEffect('dm',3))

        x = x.mul(starTreeEff('progress',12))

        x = x.mul(upgEffect('unGrass',2))

        x = x.mul(upgEffect('np',1)).mul(upgEffect('cloud',1))

        x = x.mul(starTreeEff('ring',6)).mul(starTreeEff('ring',16)).mul(starTreeEff('ring',23))

        if (player.grassjump>=3) x = x.mul(getGJEffect(2))
        
        if (player.lowGH <= -16) x = x.pow(1.25)
        if (player.grassjump >= 1) x = x.pow(1.25)

        x = x.pow(starTreeEff('ring',31))

        return x
    },
    checkCutting() {
        if (player.xp.gte(tmp.level.next)) {
            player.level = Math.max(player.level, tmp.level.bulk)
        }
        if (player.tp.gte(tmp.tier.next)) {
            player.tier = Math.max(player.tier, tmp.tier.bulk)
        }
        if (player.sp.gte(tmp.astral.next)) {
            player.astral = Math.max(player.astral, tmp.astral.bulk)
        }

        if (player.planetoid.xp.gte(tmp.cosmicLevel.next)) {
            player.planetoid.level = Math.max(player.planetoid.level, tmp.cosmicLevel.bulk)
        }
    }, 
}

el.update.main = _=>{
    let pa = player.planetoid.active
    let g = pa ? player.planetoid.pm : player.recel ? player.unGrass : player.decel ? player.aGrass : player.grass

    tmp.el.grassAmt.setHTML(g.format(0))
    tmp.el.grassGain.setHTML(tmp.autoCutUnlocked ? formatGain(g,(pa?tmp.planetiumGain:tmp.grassGain).div(tmp.autocut).mul(tmp.autocutBonus).mul(tmp.autocutAmt)) : "")

    let level_unl = !inSpace()
    tmp.el.level.setDisplay(level_unl)
    if (level_unl) {
        tmp.el.level_top_bar.changeStyle("width",tmp.level.percent*100+"%")
        tmp.el.level_top_info.setHTML(`Level <b class="cyan">${format(pa?player.planetoid.level:player.level,0)}</b>`+(player.level>=10000?"":` (${formatPercent(pa ? tmp.cosmicLevel.percent : tmp.level.percent)})`))
    }

    tmp.el.level.setHTML(`Level <b class="cyan">${format(pa?player.planetoid.level:player.level,0)}</b>`+(player.level>=10000?"":` (${formatPercent(pa ? tmp.cosmicLevel.percent : tmp.level.percent)})`))

    let tier_unl = player.pTimes > 0 && !inSpace()
    tmp.el.tier.setDisplay(tier_unl)
    if (tier_unl) {
        tmp.el.tier_top_bar.changeStyle("width",tmp.tier.percent*100+"%")
        tmp.el.tier_top_info.setHTML(`Tier <b class="yellow">${format(player.tier,0)}</b> (${formatPercent(tmp.tier.percent)})`)
    }

    let astr_unl = player.gTimes > 0 && inSpace()
    tmp.el.astral.setDisplay(astr_unl)
    if (astr_unl) {
        tmp.el.astral_top_bar.changeStyle("width",tmp.astral.percent*100+"%")
        tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${(player.astralPrestige>0?format(player.astralPrestige,0)+"-":"")+format(player.astral,0)}</b> (${formatPercent(tmp.astral.percent)})`)
    }

    if (mapID == 'g') {
        let xpID = pa ? 'Cosmic' : 'XP'

        let tmp_lvl = pa ? tmp.cosmicLevel : tmp.level

        tmp.el.level_amt.setTxt(format(pa?player.planetoid.level:player.level,0))
        tmp.el.level_progress.setTxt(tmp_lvl.progress.format(0)+" / "+tmp_lvl.next.sub(tmp_lvl.cur).format(0)+" "+xpID)
        tmp.el.level_bar.changeStyle("width",tmp_lvl.percent*100+"%")
        tmp.el.level_cut.setTxt("+"+tmp[pa?"cosmicGain":"XPGain"].format(1)+" "+xpID+"/cut")

        tmp.el.tier_div.setDisplay(tier_unl)
        if (tier_unl) {
            tmp.el.tier_amt.setTxt(format(player.tier,0))
            tmp.el.tier_progress.setTxt(tmp.tier.progress.format(0)+" / "+tmp.tier.next.sub(tmp.tier.cur).format(0)+" TP")
            tmp.el.tier_bar.changeStyle("width",tmp.tier.percent*100+"%")
            tmp.el.tier_cut.setTxt("+"+tmp.TPGain.format(1)+" TP/cut")
            tmp.el.tier_mult.setTxt(formatMult(tmp.tier.mult,0)+" → "+formatMult(MAIN.tier.mult(player.tier+1),0)+" multiplier")
        }

        astr_unl = player.gTimes > 0
        tmp.el.astral_div.setDisplay(astr_unl)
        if (astr_unl) {
            tmp.el.astral_amt.setTxt((player.astralPrestige>0?format(player.astralPrestige,0)+"-":"")+format(player.astral,0))

            tmp.el.astral_progress.setTxt(tmp.astral.progress.format(0)+" / "+tmp.astral.next.sub(tmp.astral.cur).format(0)+" SP")
            tmp.el.astral_bar.changeStyle("width",tmp.astral.percent*100+"%")
            tmp.el.astral_cut.setTxt("+"+tmp.SPGain.format(1)+" SP/cut")
        }
    }

    tmp.el.main_app.changeStyle('background-color',inSpace() ? "#fff1" : "#fff2")
    document.body.style.backgroundColor = inSpace() ? "#0A001E" : player.planetoid.active ? "#24002C" : "#0052af"
    document.body.className = player.planetoid.active ? 'planetoid' : ''
    tmp.el.grass_cap_div.changeStyle('background-color',player.planetoid.active ? "#D000FF" : "#29b146")
}

tmp_update.push(_=>{
    tmp.outsideNormal = player.decel || player.recel || player.planetoid.active

    tmp.platCutAmt = hasStarTree('auto',3)
    tmp.moonstoneCutAmt = hasStarTree('auto',5)

    tmp.grassCap = MAIN.grassCap()
    tmp.grassSpawn = MAIN.grassSpawn()

    MAIN.compact()

    tmp.rangeCut = MAIN.rangeCut()
    tmp.autocut = MAIN.autoCut()

    tmp.autoCutUnlocked = hasUpgrade('auto',0)

    tmp.autocutBonus = upgEffect('auto',1)
    tmp.autocutAmt = 1+upgEffect('auto',2,0)+starTreeEff('progress',1,0)
    tmp.spawnAmt = 1+upgEffect('perk',5,0)+upgEffect('crystal',4,0)

    tmp.grassGain = MAIN.grassGain()
    tmp.XPGain = MAIN.xpGain()
    tmp.TPGain = MAIN.tpGain()
    tmp.SPGain = MAIN.spGain()

    tmp.perks = MAIN.level.perk()
    tmp.perkUnspent = Math.max(player.maxPerk-player.spentPerk,0)

    let lvl = player.level

    let th = 1/starTreeEff('progress',13,1)

    tmp.level.threshold = 2.7**th

    tmp.level.scale1 = tmp.outsideNormal?2:200
    tmp.level.scale1 += upgEffect('aGrass',5,0)+upgEffect('ap',5,0)
    tmp.level.scale1 *= (tmp.chargeEff[2]||1) * starTreeEff('progress',4)

    tmp.level.scale2 = player.recel?5:player.decel?300:700
    tmp.level.scale2 *= starTreeEff('progress',7,1)

    tmp.level.next = MAIN.level.req(lvl)
    tmp.level.bulk = MAIN.level.bulk(player.xp)
    tmp.level.cur = MAIN.level.cur(lvl)
    tmp.level.progress = player.xp.sub(tmp.level.cur).max(0).min(tmp.level.next)
    tmp.level.percent = tmp.level.progress.div(tmp.level.next.sub(tmp.level.cur)).max(0).min(1).toNumber()

    let t = player.tier

    th = 1/starTreeEff('progress',14,1)

    tmp.level.tier = 3**th

    tmp.tier.next = MAIN.tier.req(t)
    tmp.tier.bulk = MAIN.tier.bulk(player.tp)
    tmp.tier.cur = MAIN.tier.cur(t)
    tmp.tier.progress = player.tp.sub(tmp.tier.cur).max(0).min(tmp.tier.next)
    tmp.tier.percent = tmp.tier.progress.div(tmp.tier.next.sub(tmp.tier.cur)).max(0).min(1).toNumber()
    tmp.tier.mult = MAIN.tier.mult(t)

    let a = player.astral

    tmp.astral.next = MAIN.astral.req(a)
    tmp.astral.bulk = MAIN.astral.bulk(player.sp)
    tmp.astral.cur = MAIN.astral.cur(a)
    tmp.astral.progress = player.sp.sub(tmp.astral.cur).max(0).min(tmp.astral.next)
    tmp.astral.percent = tmp.astral.progress.div(tmp.astral.next.sub(tmp.astral.cur)).max(0).min(1).toNumber()

    tmp.platGain = 1
    if (player.grasshop >= 4) tmp.platGain += getGHEffect(3)

    tmp.platGain *= upgEffect('oil',4,1) * getASEff('plat') * upgEffect('moonstone',3)
    if (player.lowGH <= 4) tmp.platGain *= 10

    tmp.platGain = Math.ceil(tmp.platGain*tmp.compact)

    tmp.moonstoneGain = 1
    tmp.moonstoneChance = 0.005
    if (player.grassskip >= 8) tmp.moonstoneGain += getGSEffect(2,0)
    if (player.grassskip >= 21) {
        tmp.moonstoneChance *= 2
        tmp.moonstoneGain *= 2
    }

    tmp.moonstoneGain = Math.ceil(tmp.moonstoneGain*tmp.compact)

    tmp.platChance = 0.005
    if (player.grasshop >= 6 || player.lowGH <= 4) tmp.platChance *= 2
})

let shiftDown = false
window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) shiftDown = true;
	switch (event.key.toLowerCase()) {
		case "p":
			if (shiftDown) RESET.rocket_part.reset();
			else if (player.decel) RESET.ap.reset();
			else RESET.pp.reset();
			break;
		case "c":
			if (player.decel) RESET.oil.reset();
			else RESET.crystal.reset();
			break;
		case "g":
			if (shiftDown) RESET.gal.reset();
			else if (player.decel) RESET.gs.reset();
			else RESET.gh.reset();
			break;
		case "s":
			if (shiftDown && player.decel) RESET.fun.reset();
			else if (shiftDown) RESET.steel.reset();
			break;
		case "f":
			ROCKET.create()
			break;
	}
}, false);

window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) {
		shiftDown = false;
	}
}, false);