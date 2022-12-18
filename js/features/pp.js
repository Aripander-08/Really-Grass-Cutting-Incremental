MAIN.pp = {
    gain() {
        let x = Decimal.pow(1.15,player.level)

        x = x.mul(upgEffect('grass',5))
        x = x.mul(upgEffect('plat',3))
        x = x.mul(upgEffect('perk',6))
        x = x.mul(chalEff(4))

        x = x.mul(E(tmp.chargeEff[1]||1).pow(player.tier))

        x = x.mul(upgEffect('rocket',3))
        x = x.mul(upgEffect('rocket',11))
        x = x.mul(upgEffect('momentum',4))

        return x.floor()
    },
}

RESET.pp = {
    unl: _=> !player.decel,

    req: _=>player.level>=30,
    reqDesc: _=>`Reach Level 30 to Prestige.`,

    resetDesc: `Prestiging resets your grass, grass upgrades, level and perks for Prestige Points.`,
    resetGain: _=> `Gain <b>${tmp.ppGain.format(0)}</b> Prestige Points`,

    title: `Prestige`,
    resetBtn: `Prestige`,
    hotkey: `P`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.pp = player.pp.add(tmp.ppGain)
                player.pTimes++
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="p") {
        player.pTime = 0
        player.grass = E(0)
        player.xp = E(0)
        player.level = 0

        let keep_perk = ((order == "p" && hasUpgrade('auto',4)) ||
			(order == "c" && !inChal(3) && hasUpgrade('auto',6)) ||
			(order == "gh" && !inChal(7) && hasUpgrade('assembler',4)))
			!player.options.losePerks

        if (!keep_perk) {
            player.maxPerk = 0
            player.spentPerk = 0
            resetUpgrades('perk')
        }

        resetUpgrades('grass')

        resetGlasses()

        updateTemp()
    },
}

UPGS.pp = {
    unl: _=> !player.decel,

    title: "Prestige Upgrades",

    cannotBuy: _=>inChal(4) || inChal(5),

    autoUnl: _=>hasUpgrade('auto',5),
    noSpend: _=>hasUpgrade('assembler',1),

    req: _=>player.pTimes > 0,
    reqDesc: _=>`Prestige once to unlock.`,

    underDesc: _=>`You have ${format(player.pp,0)} Prestige Points`+(tmp.ppGainP > 0 ? " <span class='smallAmt'>"+formatGain(player.pp,tmp.ppGain.mul(tmp.ppGainP))+"</span>" : ""),

    ctn: [
        {
            max: Infinity,

            title: "Grass Value II",
            tier: 2,
            desc: `Increase grass gain by <b class="green">+25%</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Curr/Grass"],
                        
            cost: i => Decimal.pow(1.2,i).mul(30).ceil(),
            bulk: i => i.div(30).max(1).log(1.2).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/4+1)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            title: "XP II",
            tier: 2,
            desc: `Increase XP gain by <b class="green">+25%</b> per level. This effect is increased by <b class="green">doubled</b> for every <b class="yellow">25</b> levels.`,
        
            res: "pp",
            icon: ["Icons/XP"],
                        
            cost: i => Decimal.pow(1.2,i).mul(60).ceil(),
            bulk: i => i.div(60).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i/4+1)
                if (inChal(1)) x = E(1)
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: _ => 125 + hasStarTree("progress", 5),

            title: "TP",
            desc: `Increase Tier Points (TP) gain by <b class="green">25%</b> compounding per level.`,

            res: "pp",
            icon: ["Icons/TP"],
                        
            cost: i => Decimal.pow(1.2,i**1.25).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.2).root(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.2,i)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            unl: _=>player.cTimes>0,

            title: "Crystal",
            tier: 2,
            desc: `Increase Crystal gain by <b class="green">+50%</b> per level. This effect is increased by <b class="green">25%</b> for every <b class="yellow">25</b> levels.`,

            res: "pp",
            icon: ["Curr/Crystal"],

            cost: i => Decimal.pow(2,i).mul(1e9).ceil(),
            bulk: i => i.div(1e9).max(1).log(2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/2+1)
                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: Infinity,

            unl: _=>hasStarTree("progress", 2),

            title: "Weak TP",
            desc: `Increase Tier Points (TP) gain by <b class="green">15%</b> compounding per level.`,

            res: "pp",
            icon: ["Icons/TP"],

            cost: i => Decimal.pow(100,i**1.25).mul(1e80).ceil(),
            bulk: i => i.div(1e80).max(1).log(100).root(1.25).floor().toNumber()+1,
        
            effect(i) {
                let x = Decimal.pow(1.15,i)
        
                return x
            },
            effDesc: x => format(x)+"x",
        },
    ],
}

tmp_update.push(_=>{
    tmp.ppGain = MAIN.pp.gain()
    tmp.ppGainP = (upgEffect('auto',8,0)+upgEffect('gen',0,0)+starTreeEff("qol",0,0))*upgEffect('factory',1,1)
})