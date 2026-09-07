var tooltips, hover_tooltip, tooltip_div, tt_time = 0;

const TOOLTIP_CONFING = {
    padding_x: 5,
    padding_y: 5,
    def_align: 'center',
    def_pos: 'top',
    def_text_align: 'center',
}

function updateTooltips() {
    let style = tooltip_div.style

    if (mobileInspection.enabled && document.getElementById('app').style.display === 'none') {
        toggleMobileInspection(false)
    }

    if (mobileInspection.enabled && window.innerWidth <= 700) {
        style.display = 'none'
        tt_time = 0
        return
    }

    if (hover_tooltip) {
        let attr_html = hover_tooltip.getAttribute('tooltip-html') || '';

        if (attr_html == '' || !hover_tooltip.className.includes('tooltip')) {
            style.display = 'none';
            style.top = 0;
            style.left = 0;
            tt_time = 0
        } else {
            tt_time = Math.min(1,tt_time+diff/500)
            style.display = 'block';

            let ts = Math.sin(tt_time*Math.PI/2)

            let attr_align = hover_tooltip.getAttribute('tooltip-align') || TOOLTIP_CONFING.def_align,
            attr_pos = hover_tooltip.getAttribute('tooltip-pos') || TOOLTIP_CONFING.def_pos,
            text_align = hover_tooltip.getAttribute('tooltip-text-align') || TOOLTIP_CONFING.def_text_align;

            tooltip_div.innerHTML = attr_html

            let ht_rect = hover_tooltip.getBoundingClientRect()
            let t_rect = tooltip_div.getBoundingClientRect()

            let [dx,dy] = [0,0]

            if (attr_pos == 'bottom') dy = ht_rect.bottom + 8*ts
            else if (attr_pos == 'top') dy = ht_rect.top - t_rect.height - 8*ts
            else if (attr_pos == 'left') dx = ht_rect.left - t_rect.width - 8*ts
            else if (attr_pos == 'right') dx = ht_rect.right + 8*ts

            if (attr_pos == 'left' || attr_pos == 'right') {
                if (attr_align == 'left' || attr_align == 'start') dy = ht_rect.top
                else if (attr_align == 'center') dy = ht_rect.top + (ht_rect.height - t_rect.height) / 2
                else if (attr_align == 'right' || attr_align == 'end') {
                    dy = ht_rect.bottom - t_rect.height
                }
            } else if (attr_pos == 'top' || attr_pos == 'bottom') {
                if (attr_align == 'left' || attr_align == 'start') dx = ht_rect.left
                else if (attr_align == 'center') dx = ht_rect.left + (ht_rect.width - t_rect.width) / 2
                else if (attr_align == 'right' || attr_align == 'end') {
                    dx = ht_rect.right - t_rect.width
                }
            }

            style.top = Math.max(TOOLTIP_CONFING.padding_y,Math.min(window.innerHeight-t_rect.height-TOOLTIP_CONFING.padding_y,dy)) + window.scrollY
            style.left = Math.max(TOOLTIP_CONFING.padding_x,Math.min(window.innerWidth-t_rect.width-TOOLTIP_CONFING.padding_x,dx)) + window.scrollX
            style['text-align'] = text_align
        }
    } else {
        style.display = 'none';
        style.top = 0;
        style.left = 0;
        tt_time = 0
    }

    style.opacity = tt_time;
}

function updateTooltipOnChange() {
    tooltips = document.getElementsByClassName('tooltip')
    tooltip_div = document.getElementById('tooltip-div')

    for (let i = 0; i < tooltips.length; i++) {
        let tooltip = tooltips[i];

        tooltip.onmouseenter = function() {
            hover_tooltip = tooltip

            updateTooltips()
        }

        tooltip.onmouseleave = function() {
            hover_tooltip = null

            updateTooltips()
        }
    }
}

function setupTooltips() {
    updateTooltipOnChange()
    setupMobileInspection()

    setInterval(updateTooltips,1000/30)

    // setInterval(updateTooltipOnChange,100)
}

const mobileInspection = { enabled: false, installed: false, returnFocus: null }
const MOBILE_INSPECT_SELECTOR = '.tooltip, [tooltip], .resource-action, .img_btn[id^="main_upg_"], .elements[id^="elementID_"], .img_btn[id^="glyph_upg"], .btn_tree, .img_chal'

function toggleMobileInspection(enabled = !mobileInspection.enabled) {
    mobileInspection.enabled = enabled && window.innerWidth <= 700
    document.documentElement.classList.toggle('mobile-inspecting', mobileInspection.enabled)
    let button = document.getElementById('mobile_inspect_toggle')
    button.setAttribute('aria-pressed', mobileInspection.enabled)
    button.innerHTML = mobileInspection.enabled ? 'Inspect: ON<small>Tap an item</small>' : 'Inspect<small>Tap to read</small>'
    let hint = document.getElementById('challenge_inspect_hint')
    if (!hint.dataset.defaultText) hint.dataset.defaultText = hint.textContent
    hint.textContent = mobileInspection.enabled
        ? 'Tap a challenge to inspect it. Challenges cannot be entered while Inspect is on.'
        : hint.dataset.defaultText
    hover_tooltip = null
    updateTooltips()
    if (!mobileInspection.enabled) closeMobileInspection()
}

function closeMobileInspection() {
    document.getElementById('mobile_inspect_dialog').close()
}

// Reuse the desktop detail renderers, restoring their selection without buying or resetting.
function readMobileInspectionPanel(state, key, selection, update, panelId) {
    let previous = state[key]
    try {
        state[key] = selection
        update()
        return document.getElementById(panelId).innerHTML
    } finally {
        state[key] = previous
        update()
    }
}

function mobileInspectionHTML(target) {
    let id = target.id
    if (/^main_upg_\d+_\d+$/.test(id)) {
        let selection = id.slice(9).split('_').map(Number)
        return readMobileInspectionPanel(player, 'main_upg_msg', selection, updateMainUpgradesHTML, 'main_upg_msg')
    }
    if (/^elementID_\d+$/.test(id)) {
        return readMobileInspectionPanel(tmp.elements, 'choosed', Number(id.slice(10)), updateElementsHTML, 'elem_ch_div')
    }
    if (/^glyph_upg\d+$/.test(id)) {
        return readMobileInspectionPanel(tmp, 'mass_glyph_msg', Number(id.slice(9)), updateDarkRunHTML, 'glyph_upg_msg')
    }
    if (target.matches('.btn_tree') && id.startsWith('treeUpg_')) {
        return readMobileInspectionPanel(tmp.supernova, 'tree_choosed', id.slice(8), updateTreeHTML, 'tree_desc')
    }
    if (/^chal_btn_\d+$/.test(id)) {
        return readMobileInspectionPanel(player.chal, 'choosed', Number(id.slice(9)), updateChalHTML, 'chal_desc_div')
    }
    let tooltip = target.matches('.tooltip, [tooltip]') ? target : target.querySelector('.tooltip, [tooltip]')
    if (tooltip) {
        updateTooltipResHTML(true)
        if (tooltip.hasAttribute('tooltip')) {
            let text = document.createElement('span')
            text.textContent = tooltip.getAttribute('tooltip')
            return text.innerHTML
        }
        return tooltip.getAttribute('tooltip-html') || '<p>No additional details for this item yet.</p>'
    }
    if (target.matches('.inf_upg')) return target.innerHTML
    return `<p>This control has no hover description. Exit inspection mode to use it.</p>`
}

function showMobileInspection(target) {
    let content = document.getElementById('mobile_inspect_content')
    content.innerHTML = mobileInspectionHTML(target)
    // A detail panel may also contain an Enter/Buy button. The reading copy is never interactive.
    content.querySelectorAll('button, input, select, textarea, .tree-hint').forEach(node => node.remove())
    content.querySelectorAll('*').forEach(node => {
        for (let attribute of [...node.attributes]) {
            if (attribute.name.startsWith('on') || ['id', 'href', 'tabindex', 'contenteditable'].includes(attribute.name)) {
                node.removeAttribute(attribute.name)
            }
        }
    })
    mobileInspection.returnFocus = target
    let dialog = document.getElementById('mobile_inspect_dialog')
    if (!dialog.open) dialog.showModal()
    content.scrollTop = 0
    document.getElementById('mobile_inspect_close').focus({ preventScroll: true })
}

function handleMobileInspection(event) {
    if (!mobileInspection.enabled || window.innerWidth > 700) return
    let target = event.target
    if (!target.closest || target.closest('#mobile_inspect_toggle, #mobile_inspect_dialog, #tabs, #stabs_div, .btn_tab')) return
    let item = target.closest(MOBILE_INSPECT_SELECTOR)
    let control = item || target.closest('[onclick], button, a')
    if (!control) return
    event.preventDefault()
    event.stopImmediatePropagation()
    showMobileInspection(control)
}

function setupMobileInspection() {
    if (mobileInspection.installed) return
    mobileInspection.installed = true
    document.addEventListener('click', handleMobileInspection, true)
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') handleMobileInspection(event)
    }, true)
    document.getElementById('mobile_inspect_dialog').addEventListener('close', () => {
        let target = mobileInspection.enabled && mobileInspection.returnFocus
        let focus = (target && target.isConnected && target.closest('button, [tabindex]')) || document.getElementById('mobile_inspect_toggle')
        focus.focus({ preventScroll: true })
    })
    window.matchMedia('(max-width: 700px)').addEventListener('change', event => {
        if (!event.matches) toggleMobileInspection(false)
    })
}