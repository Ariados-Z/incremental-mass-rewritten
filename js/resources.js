const RESOURCES_DIS = {
    mass: {
        unl: ()=>true,
        icon: "mass",

        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
    },
    rp: {
        unl: ()=>true,
        icon: "rp",
        class: "red",

        desc: (gs)=>format(player.rp.points,0)+"<br>"+(player.mainUpg.bh.includes(6)||player.mainUpg.atom.includes(6)?formatGain(player.rp.points, tmp.rp.gain.mul(gs)):"(+"+format(tmp.rp.gain,0)+")"),
    
        resetBtn() { FORMS.rp.reset() },
    },
    dm: {
        unl: ()=>FORMS.bh.see(),
        icon: "dm",
        class: "yellow",

        desc: (gs)=>format(player.bh.dm,0)+"<br>"+(player.mainUpg.atom.includes(6)?formatGain(player.bh.dm, tmp.bh.dm_gain.mul(gs)):"(+"+format(tmp.bh.dm_gain,0)+")"),
    
        resetBtn() { FORMS.bh.reset() },
    },
    bh: {
        unl: ()=>player.bh.unl,
        icon: "bh",
        class: "yellow",

        desc: (gs)=>formatMass(player.bh.mass)+"<br>"+formatGain(player.bh.mass, tmp.bh.mass_gain.mul(gs), true),
    },
    atom: {
        unl: ()=>player.bh.unl,
        icon: "atom",

        desc: (gs)=>format(player.atom.points,0)+"<br>"+(hasElement(24)?formatGain(player.atom.points,tmp.atom.gain.mul(gs)):"(+"+format(tmp.atom.gain,0)+")"),

        resetBtn() { ATOM.reset() },
    },
    quarks: {
        unl: ()=>player.atom.unl,
        icon: "quark",
        class: "quark_color",

        desc: (gs)=>format(player.atom.quarks,0)+"<br>"+(hasElement(14)?formatGain(player.atom.quarks,tmp.atom?tmp.atom.quarkGain.mul(tmp.atom.quarkGainSec).mul(gs):0):"(+"+format(tmp.atom.quarkGain,0)+")"),
    },
    md: {
        unl: ()=>MASS_DILATION.unlocked(),
        icon: "md",
        class: "green",

        desc: (gs)=>format(player.md.particles,0)+"<br>"+(player.md.active?"(+"+format(tmp.md.rp_gain,0)+")":(hasTree("qol3")?formatGain(player.md.particles,tmp.md.passive_rp_gain.mul(gs)):"(inactive)")),

        resetBtn() { MASS_DILATION.onactive() },
    },
    sn: {
        unl: ()=>player.supernova.post_10 || player.supernova.times.gt(0),
        icon: "sn",
        class: "magenta",

        desc: (gs)=>{
            let g = tmp.SN_passive ? tmp.supernova.passive.div(FPS) : tmp.supernova.bulk.sub(player.supernova.times).max(0)
            let h = tmp.inf_unl?format(g.mul(FPS),0)+"/sec":format(g,0)
            return format(player.supernova.times,0)+(player.supernova.post_10?"<br>(+"+h+")":"")
        },

        resetBtn() { if (player.supernova.post_10) SUPERNOVA.reset(false,false,true) },
    },
    qu: {
        unl: ()=>quUnl() || player.chal.comps[12].gte(1),
        icon: "qu",
        class: "light_green",

        desc: (gs)=>format(player.qu.points,0)+"<br>"+(hasUpgrade('br',8)?player.qu.points.formatGain(tmp.qu.gain.div(10).mul(gs)):"(+"+format(tmp.qu.gain,0)+")"),

        resetBtn() { QUANTUM.enter() },
    },
    br: {
        unl: ()=>hasTree("unl4"),
        icon: "br",
        class: "light_red",

        desc: (gs)=>player.qu.rip.amt.format(0)+"<br>"+(player.qu.rip.active||hasElement(147)?hasUpgrade('br',8)?player.qu.rip.amt.formatGain(tmp.rip.gain.div(10).mul(gs)):`(+${tmp.rip.gain.format(0)})`:"(inactive)"),

        resetBtn() { BIG_RIP.rip() },
    },
    dark: {
        unl: ()=>hasElement(118)||player.dark.unl,
        icon: "dark",
        class: "gray",

        desc: (gs)=>player.dark.rays.format(0)+"<br>"+(hasElement(118)?tmp.dark.rayEff.passive?player.dark.rays.formatGain(tmp.dark.gain.mul(tmp.dark.rayEff.passive).mul(gs)):"(+"+tmp.dark.gain.format(0)+")":"(require Og-118)"),

        resetBtn() { DARK.reset() },
    },
    fss: {
        unl: ()=>player.dark.matters.final.gt(0) || tmp.inf_unl&&hasElement(188),
        icon: "fss",

        desc: (gs)=>format(player.dark.matters.final,0)+"<br>(+"+(tmp.matters.FSS_base.gte(tmp.matters.FSS_req)?1:0)+")",

        resetBtn() { MATTERS.final_star_shard.reset() },
    },
    corrupt: {
        unl: ()=>player.dark.c16.first,
        icon: "corrupted",
        class: "corrupted_text",

        desc: (gs)=>format(player.dark.c16.shard,0)+"<br>"+(hasElement(232)?player.dark.c16.shard.formatGain(tmp.c16.shardGain):"(+"+tmp.c16.shardGain.format(0)+")"),

        resetBtn() { startC16() },
    },
    speed: {
        unl: ()=>quUnl(),
        icon: "preQGSpeed",
        class: "orange",

        desc: (gs)=>formatMult(tmp.preQUGlobalSpeed)+(tmp.inf_unl?"<br><span class='yellow'>"+formatMult(tmp.preInfGlobalSpeed)+"</span>":""),
    },
    inf: {
        unl: ()=>tmp.inf_unl,
        icon: "inf",
        class: "yellow",

        desc: (gs)=>player.inf.points.format(0)+"<br>(+"+tmp.IP_gain.format(0)+")"+"<br>("+formatPercent(infinityProgress())+(tmp.brokenInf?" to next infinity)":" to infinity)"),

        resetBtn() { INF.goInf() },
    },

    /*
    mass: {
        unl: ()=>true,
        icon: "mass",

        desc: (gs)=>formatMass(player.mass)+"<br>"+formatGain(player.mass, tmp.massGain.mul(gs), true),
    },
    */
}

const RESOURCE_NAMES = {
    mass: "Mass",
    rp: "Rage Power",
    dm: "Dark Matter",
    bh: "Black Hole",
    atom: "Atoms",
    quarks: "Quarks",
    md: "Rel. Particles",
    sn: "Supernovas",
    qu: "Quantum Foam",
    br: "Death Shards",
    dark: "Dark Rays",
    fss: "Final Shards",
    corrupt: "Corrupted",
    speed: "Global Speed",
    inf: "Infinity Points",
}

function infinityProgress() {
    return player.mass.max(1).log10().max(1).log10().div(tmp.inf_limit.max(1).log10().max(10).log10()).max(0).min(1)
}

function compactHUDPart(text) {
    return text
        .replace(/e(\d{1,3}(?:,\d{3}){2,})/g, (_, value) => "e" + compactGroupedNumber(value, true))
        .replace(/\b(\d{1,3}(?:,\d{3}){2,})\b/g, (_, value) => compactGroupedNumber(value))
        .replace(/(\d+\.\d{2})\d+/g, "$1")
        .replace(" OoMs^2/sec", " OoM²/s")
        .replace(" OoMs/sec", " OoM/s")
        .replace(" arvs/sec", " arv/s")
        .replaceAll("/sec", "/s")
}

function compactGroupedNumber(value, exponent=false) {
    let digits = value.replaceAll(",", "")
    let suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"]
    let group = Math.floor((digits.length - 1) / 3)
    let lead = digits.length - group * 3
    let short = digits.slice(0, lead) + "." + digits.slice(lead, lead + 2)
    return short + (suffixes[group] || (exponent ? `e${group*3}` : `e${digits.length-1}`))
}

function compactResourceDesc(html) {
    let parts = html.split("<br>").slice(0, 2).map(compactHUDPart)
    let amount = parts[0]
    let rate = parts[1] || ""

    if (rate.startsWith("(+")) rate = "+" + rate.slice(2, -1)

    return `<span class="resource-amount">${amount}</span>${rate ? `<span class="resource-rate">${rate}</span>` : ""}`
}

function reset_res_btn(id) { RESOURCES_DIS[id].resetBtn() }

function hide_res(id) { player.options.res_hide[id] = !player.options.res_hide[id] }

function setupResourcesHTML() {
    let h1 = "", h2 = ""

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]

        h1 += `
        <div id="${i}_res_div" ${rd.resetBtn ? `class="resource-action" role="button" tabindex="0" onclick="reset_res_btn('${i}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();reset_res_btn('${i}')}"` : ""}>
            <div ${i in TOOLTIP_RES ? `id="${i}_tooltip" class="tooltip ${rd.class||""}" tooltip-pos="left" tooltip-align="left" tooltip-text-align="left"` : `class="${rd.class||""}"`}>
                <span class="resource-copy">
                    <small class="resource-name">${RESOURCE_NAMES[i]||i}</small>
                    <span class="resource-value" id="${i}_res_desc">X</span>
                </span>
                ${rd.resetBtn ? `<small class="resource-action-mark" id="${i}_res_action_mark">${i == "br" ? "RIP" : "↻"}</small>` : ""}
                <div><img src="images/${rd.icon||"mass"}.png"></div>
            </div>
        </div>
        `

        h2 += `
        <div id="${i}_res_hide_div">
            <div><img src="images/${rd.icon||"mass"}.png"><button style="margin-left: 10px; width: 100px;" onclick="hide_res('${i}')" id="${i}_res_hide_btn" class="btn">OFF</button></div>
        </div>
        `
    }

    new Element("resources_table").setHTML(h1)
    new Element("res_hider_table").setHTML(h2)
}

const INF_GS_RES = ['qu','br','dark']

function updateResourcesHTML() {
    let qu_gs = tmp.preQUGlobalSpeed
    let inf_gs = tmp.preInfGlobalSpeed
    let visibleResources = 0
    document.documentElement.classList.toggle("big-rip-active", player.qu.rip.active)
    tmp.el.big_rip_status.setDisplay(player.qu.rip.active)

    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let unl = !player.options.res_hide[i] && rd.unl()

        tmp.el[i+"_res_div"].setDisplay(unl)

        if (unl) {
            visibleResources++
            let desc = rd.desc(INF_GS_RES.includes(i) ? inf_gs : qu_gs)
            tmp.el[i+"_res_desc"].setHTML(window.innerWidth <= 700 ? compactResourceDesc(desc) : desc)
        }
    }
    tmp.el.br_res_div.el.classList.toggle("active", player.qu.rip.active)
    tmp.el.br_res_action_mark.setTxt(player.qu.rip.active ? "RIP ON" : "RIP")
    document.documentElement.style.setProperty("--mobile-resource-rows", Math.max(1, Math.ceil(visibleResources / 5)))

    tmp.el.mobile_infinity_status.setDisplay(tmp.inf_unl)
    tmp.el.mobile_inspect_hint.setDisplay(!tmp.inf_unl)
    if (tmp.inf_unl) {
        let progress = infinityProgress()
        let label = tmp.brokenInf ? "To next Infinity" : "To Infinity"
        tmp.el.mobile_infinity_theorems.setTxt(player.inf.theorem.format(0))
        tmp.el.mobile_infinity_label.setTxt(label)
        tmp.el.mobile_infinity_percent.setTxt(formatPercent(progress))
        tmp.el.mobile_infinity_progress.el.value = progress.toNumber()
        tmp.el.mobile_infinity_progress.el.setAttribute("aria-label", label)
    }
}

function updateResourcesHiderHTML() {
    for (i in RESOURCES_DIS) {
        let rd = RESOURCES_DIS[i]
        let unl = i != "idk" && rd.unl()

        tmp.el[i+"_res_hide_div"].setDisplay(unl)

        if (unl) {
            tmp.el[i+"_res_hide_btn"].setTxt(player.options.res_hide[i] ? "ON" : "OFF")
        }
    }
}