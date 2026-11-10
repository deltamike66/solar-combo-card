/* Solar Combo Card 0.12.0 - https://github.com/deltamike66/solar-combo-card - MIT */
const VERSION = "0.12.0";

const ENTITA = {
  pv1_power: "sensor.{p}_{inv}_pv1_power",
  pv1_voltage: "sensor.{p}_{inv}_pv1_voltage",
  pv1_current: "sensor.{p}_{inv}_pv1_current",
  pv2_power: "sensor.{p}_{inv}_pv2_power",
  pv2_voltage: "sensor.{p}_{inv}_pv2_voltage",
  pv2_current: "sensor.{p}_{inv}_pv2_current",
  inverter_mode: "sensor.{p}_{inv}_operation_mode",
  inverter_temp: "sensor.{p}_{inv}_temperature",
  room_temp: "sensor.{p}_temperatura_locale_inverter",
  load_power: "sensor.{p}_{inv}_output_active_power",
  load_voltage: "sensor.{p}_{inv}_output_effective_voltage",
  battery_soc: "sensor.{p}_bms_state_of_charge",
  battery_power: "sensor.{p}_bms_potenza",
  battery_voltage: "sensor.{p}_bms_tensione_totale",
  battery_current: "sensor.{p}_bms_corrente",
  cell_min: "sensor.{p}_bms_cella_minima",
  cell_max: "sensor.{p}_bms_cella_massima",
  cell_delta: "sensor.{p}_bms_delta_celle",
  bms_alarms: "sensor.{p}_bms_allarmi",
  inverter_fault: "sensor.{p}_{inv}_fault",
  inverter_warning: "sensor.{p}_{inv}_warning",
  charger_power: "sensor.{p}_r4850g2_output_power",
  charger_voltage: "sensor.{p}_r4850g2_output_voltage",
  charger_current: "sensor.{p}_r4850g2_output_current",
  charger_standby: "switch.{p}_r4850g2_standby",
  charge_auto: "switch.{p}_gestione_automatica_carica",
  charge_state: "sensor.{p}_stato_gestione_carica",
  grid_power: "sensor.{p}_r4850g2_input_power",
  grid_voltage: "sensor.{p}_r4850g2_input_voltage",
  charger_temp_in: "sensor.{p}_r4850g2_input_temperature",
  charger_temp_out: "sensor.{p}_r4850g2_output_temperature",
  charge_start: "number.{p}_carica_avvio_sotto_cella_min",
  charge_stop: "number.{p}_carica_stop_sopra_cella_min",
  charge_confirm: "number.{p}_carica_conferma_avvio",
  charge_min_ah: "number.{p}_carica_ah_minimi",
  charge_voltage: "number.{p}_carica_tensione_r4850g2",
  charge_current: "number.{p}_carica_corrente_r4850g2",
  charge_margin: "number.{p}_carica_margine_sul_consumo",
  full_charge_days: "number.{p}_carica_completa_ogni_giorni",
  charged_ah: "sensor.{p}_carica_ah_caricati",
  charge_current_req: "sensor.{p}_carica_corrente_richiesta",
  cell_max_charge: "sensor.{p}_soglia_cella_max_carica",
  cell_max_protection: "sensor.{p}_soglia_cella_max_protezione",
  days_since_full: "sensor.{p}_giorni_dall_ultima_carica_completa",
  inverter_battery_power: null,
  energy_pv: "sensor.{p}_fv_giorno",
  energy_load: "sensor.{p}_casa_giorno",
  energy_grid: "sensor.{p}_rete_giorno",
  energy_battery_in: "sensor.{p}_batteria_carica_giorno",
};

const OGGI = [
  ["Prodotta FV", "energy_pv", "var(--scc-solare)"],
  ["In casa", "energy_load", "var(--scc-casa)"],
  ["Dalla rete", "energy_grid", "var(--scc-rete)"],
  ["In batteria", "energy_battery_in", "var(--scc-batteria)"],
];

const SOGLIA_W = 10;

const DUR_BASE = 1.5;
const FONDO_SCALA_W = 500;
const VELOCITA_MAX = 6;

const L = 60;
const NODI = {
  pv1: { x: 70, y: 90, disegno: "pannello" },
  pv2: { x: 190, y: 90, disegno: "pannello" },
  inverter: { x: 130, y: 200, disegno: "inverter" },
  casa: { x: 340, y: 200, disegno: "casa" },
  batteria: { x: 130, y: 310, disegno: "batteria" },
  r4850: { x: 270, y: 310, disegno: "raddrizzatore" },
  rete: { x: 390, y: 310, disegno: "traliccio" },
};

const FV_BOX = { x: 96, y: 129, w: 68, h: 22 };

const FLUSSI = {
  pv1: { d: "M 70 116 C 70 134, 80 140, 96 140", colore: "var(--scc-solare)" },
  pv2: { d: "M 190 116 C 190 134, 180 140, 164 140", colore: "var(--scc-solare)" },
  fv: { d: "M 130 151 L 130 175", colore: "var(--scc-solare)" },
  casa: { d: "M 149 200 L 318 200", colore: "var(--scc-casa)" },
  batteria: { d: "M 130 225 L 130 288", colore: "var(--scc-batteria)" },
  r4850: { d: "M 245 310 L 152 310", colore: "var(--scc-caricatore)" },
  rete: { d: "M 381 310 L 295 310", colore: "var(--scc-rete)" },
};

const DISEGNI = {
  pannello: `
    <g class="sole">
      <circle cx="51" cy="9" r="5" fill="#ffc107"/>
      <path d="M51 1v2.5M51 15v2.5M43 9h2.5M56.5 9H59M45.3 3.3l1.8 1.8M54.9 12.9l1.8 1.8M45.3 14.7l1.8-1.8M54.9 5.1l1.8-1.8"
            stroke="#ffc107" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <path d="M30 44v11M21 56h18" stroke="#78909c" stroke-width="3" stroke-linecap="round"/>
    <polygon points="9,16 47,16 55,44 3,44" fill="#1e5aa8" stroke="#0d3b75" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M18.5 16L16 44M28 16L29 44M37.5 16L42 44M6 25.3h44.7M4.5 34.7h47.8"
          stroke="#8fb8ec" stroke-width="0.9"/>
    <polygon points="11,18 22,18 12,30 7,30" fill="#fff" opacity=".18"/>`,
  inverter: `
    <rect x="11" y="5" width="38" height="50" rx="4" fill="#eceff1" stroke="#607d8b" stroke-width="1.8"/>
    <rect x="16" y="11" width="28" height="17" rx="2" fill="#263238"/>
    <path d="M18 19.5c2.5-7 5-7 7.5 0s5 7 7.5 0 5-7 7.5 0" fill="none" stroke="#4fc3f7" stroke-width="1.6"/>
    <circle cx="20" cy="35" r="2.2" fill="#66bb6a"/>
    <circle cx="27" cy="35" r="2.2" fill="#ffca28"/>
    <circle cx="34" cy="35" r="2.2" fill="#ef5350"/>
    <path d="M17 44h26M17 48h26" stroke="#b0bec5" stroke-width="1.6" stroke-linecap="round"/>`,
  casa: `
    <g class="sole-casa">
      <path d="M47 1.5v3.5M47 25v3.5M33.5 15H37M57 15h2.5M37.5 5.5l2.5 2.5M54 22l2.5 2.5M37.5 24.5L40 22M54 8l2.5-2.5"
            stroke="#ffb300" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="47" cy="15" r="8" fill="#ffc107"/>
      <circle cx="44.6" cy="12.6" r="3.2" fill="#ffe082" opacity=".7"/>
    </g>
    <g class="rete-casa">
      <path d="M6.5 0.8L1.8 27M6.5 0.8L11.2 27M0.8 5.2h11.4M1.8 10.4h9.4M3.6 5.2l5.8 5.2M9.4 5.2l-5.8 5.2M2.9 17h7.2M2.4 17l7.6 8M10.6 17l-7.6 8"
            fill="none" stroke="#607d8b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0.9" cy="6.3" r="0.9" fill="#78909c"/><circle cx="12.1" cy="6.3" r="0.9" fill="#78909c"/>
    </g>
    <g class="batt-casa">
      <rect x="6.5" y="4" width="5" height="2.6" rx="0.8" fill="#2e7d32"/>
      <rect x="3" y="6.3" width="12" height="19" rx="2.2" fill="#43a047" stroke="#2e7d32" stroke-width="1.2"/>
      <rect x="5.2" y="8.6" width="7.6" height="3.4" rx="0.8" fill="#a5d6a7"/>
      <rect x="5.2" y="13.2" width="7.6" height="3.4" rx="0.8" fill="#a5d6a7"/>
      <path d="M10 17.6l-3 4.4h2.4l-0.8 3.2 3.2-4.6h-2.4z" fill="#fff"/>
    </g>
    <path d="M3 55.5h54" stroke="#90a4ae" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="38" y="35" width="16" height="20.5" fill="#dfe4e7" stroke="#607d8b" stroke-width="1.3"/>
    <rect x="36" y="31.5" width="20" height="4" rx="0.8" fill="#455a64"/>
    <rect x="41" y="40" width="10" height="15.5" fill="#b0bec5" stroke="#78909c" stroke-width="0.8"/>
    <path d="M41 43.8h10M41 47.6h10M41 51.4h10" stroke="#90a4ae" stroke-width="0.8"/>
    <rect x="8" y="24" width="30" height="31.5" fill="#eceff1" stroke="#607d8b" stroke-width="1.5"/>
    <polygon points="4.5,26 23,10.5 41.5,26" fill="#455a64" stroke="#37474f" stroke-width="1" stroke-linejoin="round"/>
    <rect class="finestra" x="12" y="31" width="9" height="8" stroke="#546e7a" stroke-width="1"/>
    <rect class="finestra" x="25" y="31" width="9" height="8" stroke="#546e7a" stroke-width="1"/>
    <rect class="finestra" x="12" y="44" width="9" height="7" stroke="#546e7a" stroke-width="1"/>
    <rect x="26" y="43" width="7" height="12.5" fill="#607d8b"/>
    <circle cx="31.4" cy="49.5" r="0.7" fill="#cfd8dc"/>
    <g fill="#558b2f">
      <circle cx="3.6" cy="52.2" r="3.6"/><circle cx="8.2" cy="50.8" r="4.6"/><circle cx="12.8" cy="53" r="3"/>
      <circle cx="56.2" cy="52.6" r="3.2"/><circle cx="53.4" cy="54" r="2.2"/>
    </g>
    <g fill="#7cb342">
      <circle cx="2.8" cy="50.8" r="1.6"/><circle cx="7" cy="48.6" r="2"/><circle cx="55.4" cy="51.2" r="1.4"/>
    </g>`,
  batteria: `
    <rect x="16" y="8" width="8" height="6" rx="1" fill="#455a64"/>
    <rect x="36" y="8" width="8" height="6" rx="1" fill="#455a64"/>
    <rect x="8" y="13" width="44" height="42" rx="4" fill="#eceff1" stroke="#455a64" stroke-width="2"/>
    <rect class="livello" x="12" y="17" width="36" height="34" rx="2" fill="#66bb6a"/>
    <path d="M17 21h6M20 18v6M37 21h6" stroke="#455a64" stroke-width="1.6" stroke-linecap="round"/>
    <path class="fulmine" d="M32 24l-8 12h6l-2 10 8-12h-6z" fill="#fff" stroke="#37474f" stroke-width="1.2" stroke-linejoin="round"/>`,
  raddrizzatore: `
    <rect x="5" y="15" width="50" height="32" rx="3" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.8"/>
    <circle cx="19" cy="31" r="10" fill="#90a4ae" stroke="#546e7a" stroke-width="1.2"/>
    <path d="M19 21.5v19M9.5 31h19M12.3 24.3l13.4 13.4M12.3 37.7l13.4-13.4" stroke="#546e7a" stroke-width="1"/>
    <circle cx="19" cy="31" r="2.5" fill="#546e7a"/>
    <circle class="alone" cx="37" cy="22" r="6.5"/>
    <circle class="led" cx="37" cy="22" r="3.4" stroke="#37474f" stroke-width="0.8"/>
    <circle cx="45" cy="22" r="2" fill="#90a4ae"/>
    <path d="M33 30h17M33 34h17M33 38h17" stroke="#90a4ae" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M49 21l-3 5h2.5l-1 4 3.5-5.5h-2.5z" fill="#ffca28"/>
    <!-- corrente d'aria sotto il R4850G2: entra fredda a sinistra, esce calda a destra -->
    <defs>
      <linearGradient id="scc-aria" gradientUnits="userSpaceOnUse" x1="2" y1="0" x2="58" y2="0">
        <stop offset="0" stop-color="#29b6f6"/><stop offset="1" stop-color="#ff7043"/>
      </linearGradient>
    </defs>
    <g class="aria" fill="none" stroke="url(#scc-aria)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path class="soffio" d="M2 51.5q3.5-2.2 7 0t7 0t7 0t7 0t7 0t7 0t6 0"/>
      <path class="soffio" d="M6 56.5q3.5-2.2 7 0t7 0t7 0t7 0t7 0t6 0"/>
      <path d="M53.5 48.5l4 3-4 3"/>
    </g>`,
  traliccio: `
    <g class="scintilla"><path d="M53 3l-4 7h3l-1.5 6 5-8h-3z" fill="#ffc107"/></g>
    <path d="M30 4L17 56M30 4l13 52M10 15h40M14 27h32M23 15l14 12M37 15L23 27M21.5 37h17M20 37l19 12M40 37L19 49M15 56h30"
          fill="none" stroke="#78909c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="17" r="1.8" fill="#78909c"/><circle cx="50" cy="17" r="1.8" fill="#78909c"/>
    <circle cx="14" cy="29" r="1.8" fill="#78909c"/><circle cx="46" cy="29" r="1.8" fill="#78909c"/>`,
};

const CLIC = {
  pv1: "pv1_power", pv2: "pv2_power", inverter: "inverter_mode", casa: "load_power",
  batteria: "battery_soc", r4850: "charger_power", rete: "grid_power",
};

const STORICO = {
  pv1: ["pv1_power"], pv1_sub: ["pv1_voltage", "pv1_current"],
  pv2: ["pv2_power"], pv2_sub: ["pv2_voltage", "pv2_current"],
  fv_tot: ["pv1_power", "pv2_power"],
  inv_modo: ["inverter_mode"], inv_temp: ["inverter_temp"], locale_temp: ["room_temp"],
  casa: ["load_power"], casa_sub: ["load_voltage"],
  inv_batt: ["inverter_battery_power", "battery_power", "charger_power"],
  soc: ["battery_soc"], batt_p: ["battery_power"], batt_v: ["battery_voltage", "battery_current"],
  celle: ["cell_min", "cell_max", "cell_delta"],
  r48_stato: ["charger_standby", "charge_auto"], r48: ["charger_power"],
  r48_sub: ["charger_voltage", "charger_current"],
  r48_t_in: ["charger_temp_in", "charger_temp_out"], r48_t_out: ["charger_temp_in", "charger_temp_out"],
  rete: ["grid_power"], rete_sub: ["grid_voltage"],
  allarmi: ["bms_alarms"], allarmi_inv: ["inverter_fault", "inverter_warning"],
  auto: ["charge_auto"], c_stato: ["charge_state"],
  c_avvio: ["charge_start", "charge_confirm"], c_stop: ["charge_stop", "charge_min_ah"],
  c_ah: ["charged_ah", "cell_min"], c_r48: ["charge_voltage", "charge_current", "charge_margin"],
  c_rich: ["charge_current_req"], c_cmax: ["cell_max_charge", "cell_max_protection"],
  c_completa: ["full_charge_days", "days_since_full"],
  energy_pv: ["energy_pv"], energy_load: ["energy_load"], energy_grid: ["energy_grid"],
  energy_battery_in: ["energy_battery_in"],
};

function entitaDa(tabella, prefisso, inverter, sostituzioni) {
  const ent = {};
  for (const [k, v] of Object.entries(tabella)) {
    ent[k] = v ? v.replace("{p}", prefisso).replace("{inv}", inverter) : null;
  }
  return Object.assign(ent, sostituzioni || {});
}

class SccBase extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._aggiorna();
  }

  _stato(k) {
    const id = this._ent[k];
    return id && this._hass ? this._hass.states[id] : undefined;
  }

  _num(k) {
    const s = this._stato(k);
    if (!s) return NaN;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : NaN;
  }

  _fmt(v, dec = 0) {
    if (!Number.isFinite(v)) return "—";
    const lingua = (this._hass && this._hass.locale && this._hass.locale.language) || "it";
    return v.toLocaleString(lingua, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  _potenza(w) {
    if (!Number.isFinite(w)) return "— W";
    return Math.abs(w) >= 1000 ? `${this._fmt(w / 1000, 2)} kW` : `${this._fmt(w)} W`;
  }

  _piuInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _apriStorico(ids) {
    ids = [...new Set(ids.filter(Boolean))];
    if (!ids.length) return;
    history.pushState(null, "", `/history?entity_id=${encodeURIComponent(ids.join(","))}`);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  _testo(k, s) {
    const el = this.shadowRoot.querySelector(`[data-t="${k}"]`);
    if (el && el.textContent !== s) el.textContent = s;
  }
}

class SolarComboCard extends SccBase {
  static getStubConfig() {
    return { prefix: "solar_combo" };
  }

  setConfig(config) {
    if (!config) throw new Error("Configurazione mancante");
    const prefisso = config.prefix || "solar_combo";
    const inverter = config.inverter || "smg_ii";
    const ent = entitaDa(ENTITA, prefisso, inverter, config.entities);
    const soglia = Number(config.threshold);
    this._soglia = config.threshold !== undefined && Number.isFinite(soglia) && soglia >= 0 ? soglia : SOGLIA_W;
    const positivo = (v, def, min) => {
      const n = Number(v);
      return v !== undefined && Number.isFinite(n) && n >= min ? n : def;
    };
    this._fondoScala = positivo(config.flow_scale, FONDO_SCALA_W, 1);
    this._durMin = DUR_BASE / positivo(config.flow_max_speed, VELOCITA_MAX, 1);
    this._config = config;
    this._ent = ent;
    this._costruita = false;
    if (this._hass) this._aggiorna();
  }

  getCardSize() {
    return 8;
  }

  _costruisci() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const nodi = Object.entries(NODI).map(([k, n]) => `
      <g class="nodo" data-nodo="${k}" transform="translate(${n.x - L / 2} ${n.y - L / 2})">
        <rect class="area" width="${L}" height="${L}"></rect>
        ${DISEGNI[n.disegno]}
      </g>`).join("");
    const flussi = Object.entries(FLUSSI).map(([k, f]) => `
      <g data-flusso="${k}" style="--c:${f.colore}">
        <path class="linea" d="${f.d}"></path>
        <path class="punti" d="${f.d}"></path>
      </g>`).join("");
    const titolo = this._config.title
      ? `<div class="titolo">${this._config.title}</div>` : "";
    this.shadowRoot.innerHTML = `
      <style>${STILE}</style>
      <ha-card>
        ${titolo}
        <svg viewBox="0 0 440 380" role="img" aria-label="Flusso di energia solar-combo">
          ${flussi}
          <!-- totale FV: somma delle due stringhe -->
          <g class="fv-totale">
            <rect x="${FV_BOX.x}" y="${FV_BOX.y}" width="${FV_BOX.w}" height="${FV_BOX.h}" rx="6"></rect>
            <text class="tot" x="${FV_BOX.x + FV_BOX.w / 2}" y="${FV_BOX.y + 15}" data-t="fv_tot"></text>
          </g>
          ${nodi}
          <!-- stringhe FV: testi sopra i cerchi -->
          <text class="tit" x="70" y="24">PV1</text>
          <text class="val" x="70" y="42" data-t="pv1"></text>
          <text class="sub" x="70" y="56" data-t="pv1_sub"></text>
          <text class="tit" x="190" y="24">PV2</text>
          <text class="val" x="190" y="42" data-t="pv2"></text>
          <text class="sub" x="190" y="56" data-t="pv2_sub"></text>
          <!-- inverter: testi a sinistra -->
          <text class="tit fine" x="96" y="190">Inverter</text>
          <text class="sub fine" x="96" y="205" data-t="inv_modo"></text>
          <text class="sub fine" x="96" y="219" data-t="inv_temp"></text>
          <text class="sub fine" x="96" y="233" data-t="locale_temp"></text>
          <!-- casa -->
          <text class="tit" x="340" y="164">Casa</text>
          <text class="val" x="340" y="244" data-t="casa"></text>
          <text class="sub" x="340" y="258" data-t="casa_sub"></text>
          <!-- inverter <-> batteria: valore accanto alla linea -->
          <text class="sub inizio" x="140" y="259" data-t="inv_batt"></text>
          <!-- batteria: testi a sinistra e celle sotto -->
          <text class="tit fine" x="96" y="292">Batteria</text>
          <text class="val fine" x="96" y="310" data-t="soc"></text>
          <text class="sub fine" x="96" y="324" data-t="batt_p"></text>
          <text class="sub fine" x="96" y="338" data-t="batt_v"></text>
          <text class="sub" x="130" y="356" data-t="celle"></text>
          <!-- R4850G2 -->
          <text class="tit" x="270" y="266">R4850G2</text>
          <text class="stato" x="270" y="279" data-t="r48_stato"></text>
          <text class="val" x="270" y="354" data-t="r48"></text>
          <text class="sub" x="270" y="368" data-t="r48_sub"></text>
          <!-- temperature dell'aria in ingresso (a sinistra) e in uscita (a destra) -->
          <text class="sub fine aria-in" x="238" y="339" data-t="r48_t_in"></text>
          <text class="sub inizio aria-out" x="302" y="339" data-t="r48_t_out"></text>
          <!-- rete del gestore -->
          <text class="tit" x="390" y="266">Rete</text>
          <text class="val" x="390" y="354" data-t="rete"></text>
          <text class="sub" x="390" y="368" data-t="rete_sub"></text>
        </svg>
        ${this._config.show_daily === false ? "" : `
        <div class="oggi">
          <div class="oggi-tit">Oggi</div>
          ${OGGI.map(([et, k, c]) => `
          <div class="riquadro" data-req="${k}" style="--c:${c}">
            <div class="et">${et}</div><div class="kwh" data-t="${k}"></div>
          </div>`).join("")}
        </div>`}
        ${this._config.show_charge === false ? "" : PANNELLO_CARICA}
        <div class="piede">
          <div class="allarme" data-t="allarmi_inv"></div>
          <div class="allarme" data-t="allarmi"></div>
        </div>
      </ha-card>`;
    this.shadowRoot.querySelectorAll(".nodo").forEach((g) => {
      g.addEventListener("click", () => this._piuInfo(this._ent[CLIC[g.dataset.nodo]]));
    });
    this.shadowRoot.querySelectorAll("[data-t], [data-s]").forEach((el) => {
      const k = el.dataset.s || el.dataset.t;
      if (!STORICO[k]) return;
      el.classList.add("storico");
      el.addEventListener("click", (e) => { e.stopPropagation(); this._storico(STORICO[k]); });
    });
    this._costruita = true;
  }

  _storico(chiavi) {
    let k = chiavi;
    if (k[0] === "inverter_battery_power") k = this._ent.inverter_battery_power ? [k[0]] : k.slice(1);
    this._apriStorico(k.map((c) => this._ent[c]));
  }

  _flusso(k, w) {
    const g = this.shadowRoot.querySelector(`[data-flusso="${k}"]`);
    const attivo = Number.isFinite(w) && Math.abs(w) >= this._soglia;
    g.classList.toggle("attivo", attivo);
    if (!attivo) return;
    const dur = Math.max(this._durMin, DUR_BASE / (1 + Math.abs(w) / this._fondoScala));
    const durTxt = `${(Math.round(dur * 20) / 20).toFixed(2)}s`;
    const punti = g.querySelector(".punti");
    if (punti.style.animationDuration !== durTxt) punti.style.animationDuration = durTxt;
    punti.style.animationDirection = w < 0 ? "reverse" : "normal";
  }

  _nodo(k, classe, si) {
    this.shadowRoot.querySelector(`[data-nodo="${k}"]`).classList.toggle(classe, !!si);
  }

  _livelloBatteria(soc) {
    const r = this.shadowRoot.querySelector('[data-nodo="batteria"] .livello');
    const f = Number.isFinite(soc) ? Math.max(0, Math.min(100, soc)) / 100 : 0;
    const h = 34 * f;
    r.setAttribute("y", (17 + 34 - h).toFixed(1));
    r.setAttribute("height", h.toFixed(1));
    r.setAttribute("fill", soc < 20 ? "#ef5350" : soc < 40 ? "#ffa726" : "#66bb6a");
  }

  _aggiornaCarica(cmin) {
    const auto = this._stato("charge_auto");
    const badge = this.shadowRoot.querySelector(".badge");
    const attiva = auto && auto.state === "on";
    badge.classList.toggle("spenta", !attiva);
    this._testo("auto", auto ? (attiva ? "ATTIVA" : "DISATTIVATA") : "—");
    const stato = this._stato("charge_state");
    this._testo("c_stato", stato ? stato.state : "—");
    const n = (k, dec) => this._fmt(this._num(k), dec);
    const conf = this._num("charge_confirm");
    this._testo("c_avvio", `cella min < ${n("charge_start", 2)} V ` + (conf === 0 ? "subito" : `per ${n("charge_confirm")} s`));
    this._testo("c_stop", `cella min > ${n("charge_stop", 2)} V e almeno ${n("charge_min_ah")} Ah`);
    this._testo("c_ah", `${n("charged_ah", 1)} Ah · cella min ora ${this._fmt(cmin, 3)} V`);
    this._testo("c_r48", `${n("charge_voltage", 1)} V · ${n("charge_current", 1)} A (+ ${n("charge_margin", 1)} A sul consumo)`);
    this._testo("c_rich", `${n("charge_current_req", 1)} A`);
    this._testo("c_cmax", `stop ${n("cell_max_charge", 3)} V · protezione ${n("cell_max_protection", 3)} V`);
    const giorni = this._num("full_charge_days");
    this._testo("c_completa", giorni === 0 ? "disattivata"
      : `ogni ${n("full_charge_days")} giorni · ultima ${n("days_since_full", 1)} giorni fa`);
  }

  _aggiorna() {
    if (!this._config || !this._hass) return;
    if (!this._costruita) this._costruisci();

    let pvTot = 0, pvLetti = 0;
    for (const n of ["pv1", "pv2"]) {
      const p = this._num(`${n}_power`);
      this._testo(n, this._potenza(p));
      this._testo(`${n}_sub`, `${this._fmt(this._num(`${n}_voltage`))} V · ${this._fmt(this._num(`${n}_current`), 1)} A`);
      this._flusso(n, p);
      this._nodo(n, "attivo", p >= this._soglia);
      if (Number.isFinite(p)) { pvTot += p; pvLetti++; }
    }
    const fvTot = pvLetti ? pvTot : NaN;
    this._testo("fv_tot", `FV ${this._potenza(fvTot)}`);
    this._flusso("fv", fvTot);
    this.shadowRoot.querySelector(".fv-totale").classList.toggle("attivo", fvTot >= this._soglia);

    const modo = this._stato("inverter_mode");
    this._testo("inv_modo", modo ? modo.state : "—");
    this._testo("inv_temp", `${this._fmt(this._num("inverter_temp"))} °C`);
    this._testo("locale_temp", `locale ${this._fmt(this._num("room_temp"), 1)} °C`);
    const casa = this._num("load_power");
    this._testo("casa", this._potenza(casa));
    this._testo("casa_sub", `${this._fmt(this._num("load_voltage"))} V`);
    this._flusso("casa", casa);
    this._nodo("casa", "attivo", casa >= this._soglia);

    const soc = this._num("battery_soc");
    const pBatt = this._num("battery_power");
    this._testo("soc", `${this._fmt(soc)} %`);
    this._testo("batt_p", this._potenza(pBatt));
    this._testo("batt_v", `${this._fmt(this._num("battery_voltage"), 1)} V · ${this._fmt(this._num("battery_current"), 1)} A`);
    const cmin = this._num("cell_min"), cmax = this._num("cell_max"), delta = this._num("cell_delta");
    this._testo("celle", `celle ${this._fmt(cmin, 3)}–${this._fmt(cmax, 3)} V · Δ ${this._fmt(delta)} mV`);
    this._livelloBatteria(soc);
    this._nodo("batteria", "in-carica", pBatt >= this._soglia);

    let pR48 = this._num("charger_power");
    const vR48 = this._num("charger_voltage"), iR48 = this._num("charger_current");
    if (!(pR48 > 0) && Number.isFinite(vR48) && Number.isFinite(iR48) && vR48 * iR48 > 0) pR48 = vR48 * iR48;
    const standby = this._stato("charger_standby");
    const auto = this._stato("charge_auto");
    const statoR48 = standby ? (standby.state === "on" ? "STANDBY" : "ACCESO") : "—";
    const modoR48 = auto ? (auto.state === "on" ? "AUTO" : "MANUALE") : "";
    this._testo("r48_stato", modoR48 ? `${statoR48} · ${modoR48}` : statoR48);
    this._testo("r48", this._potenza(pR48));
    this._testo("r48_sub", `${this._fmt(this._num("charger_voltage"), 1)} V · ${this._fmt(this._num("charger_current"), 1)} A`);
    this._flusso("r4850", pR48);
    this._nodo("r4850", "acceso", !!standby && standby.state === "off");
    this._testo("r48_t_in", `${this._fmt(this._num("charger_temp_in"), 1)} °C`);
    this._testo("r48_t_out", `${this._fmt(this._num("charger_temp_out"), 1)} °C`);
    const pRete = this._num("grid_power");
    this._testo("rete", this._potenza(pRete));
    this._testo("rete_sub", `${this._fmt(this._num("grid_voltage"))} V`);
    this._flusso("rete", pRete);
    this._nodo("rete", "attivo", pRete >= this._soglia);

    let pInvBatt = this._num("inverter_battery_power");
    if (!Number.isFinite(pInvBatt)) pInvBatt = pBatt - (Number.isFinite(pR48) ? pR48 : 0);
    this._testo("inv_batt", Number.isFinite(pInvBatt) && Math.abs(pInvBatt) >= this._soglia
      ? `${pInvBatt > 0 ? "↓" : "↑"} ${this._potenza(Math.abs(pInvBatt))}` : "");
    this._flusso("batteria", pInvBatt);

    const consuma = casa >= this._soglia;
    this._nodo("casa", "da-solare", consuma && pvTot >= this._soglia);
    const daBatteria = consuma && pInvBatt <= -this._soglia;
    this._nodo("casa", "da-batteria", daBatteria);
    this._nodo("casa", "da-rete", daBatteria && pR48 >= this._soglia);

    if (this._config.show_daily !== false) {
      let presenti = 0;
      for (const [, k] of OGGI) {
        const c = this.shadowRoot.querySelector(`.riquadro[data-req="${k}"]`);
        const esiste = !!this._stato(k);
        c.classList.toggle("nascosto", !esiste);
        if (esiste) presenti++;
        const kwh = this._num(k);
        this._testo(k, `${this._fmt(kwh, Math.abs(kwh) < 10 ? 2 : 1)} kWh`);
      }
      this.shadowRoot.querySelector(".oggi").classList.toggle("nascosto", !presenti);
    }

    if (this._config.show_charge !== false) this._aggiornaCarica(cmin);

    const txt = (k) => {
      const e = this._stato(k);
      return e && !["", "unknown", "unavailable"].includes(e.state) ? e.state : "";
    };
    const inv = [txt("inverter_fault"), txt("inverter_warning")].filter((x) => x).join("; ");
    this._testo("allarmi_inv", inv ? `Allarmi inverter: ${inv}` : "");
    const a = txt("bms_alarms");
    this._testo("allarmi", a ? `Allarmi BMS: ${a}` : "");
  }
}

const RIGHE_CARICA = [
  ["Stato", "c_stato"],
  ["Avvio", "c_avvio"],
  ["Stop", "c_stop"],
  ["Caricati", "c_ah"],
  ["R4850G2", "c_r48"],
  ["Corrente richiesta", "c_rich"],
  ["Cella max", "c_cmax"],
  ["Carica completa", "c_completa"],
];
const PANNELLO_CARICA = `
  <div class="carica">
    <div class="testata" data-s="auto">
      <span>Gestione automatica carica</span>
      <span class="badge" data-t="auto"></span>
    </div>
    <div class="griglia">
      ${RIGHE_CARICA.map(([et, k]) =>
        `<div class="et" data-s="${k}">${et}</div><div class="v" data-t="${k}"></div>`).join("")}
    </div>
  </div>`;

const STILE = `
  :host {
    --scc-solare: var(--energy-solar-color, #ff9800);
    --scc-inverter: var(--primary-color, #03a9f4);
    --scc-casa: var(--energy-non-fossil-color, #0f9d58);
    --scc-batteria: var(--energy-battery-in-color, #f06292);
    --scc-caricatore: #26a69a;
    --scc-rete: var(--energy-grid-consumption-color, #488fc2);
  }
  ha-card { padding: 8px 12px 12px; }
  .titolo { font-size: 1.2em; font-weight: 500; padding: 4px 4px 0; color: var(--primary-text-color); }
  svg { width: 100%; height: auto; display: block; }
  text { fill: var(--primary-text-color); text-anchor: middle; font-family: inherit; }
  text.fine { text-anchor: end; }
  text.inizio { text-anchor: start; }
  .tit { font-size: 12px; font-weight: 600; }
  .val { font-size: 13px; font-weight: 700; }
  .sub { font-size: 10px; fill: var(--secondary-text-color); }
  .stato { font-size: 9px; font-weight: 600; fill: var(--scc-caricatore); letter-spacing: .04em; }
  .nodo { cursor: pointer; }
  .nodo .area { fill: transparent; }
  .nodo .sole, .nodo .scintilla, .nodo .fulmine { opacity: 0; transition: opacity .4s; }
  .nodo.attivo .sole, .nodo.attivo .scintilla, .nodo.in-carica .fulmine { opacity: 1; }
  .nodo .sole-casa, .nodo .batt-casa, .nodo .rete-casa { opacity: 0; transition: opacity .6s; }
  .nodo.da-solare .sole-casa, .nodo.da-batteria .batt-casa, .nodo.da-rete .rete-casa { opacity: 1; }
  .nodo .batt-casa { transition: opacity .6s, transform .6s; }
  .nodo.da-rete .batt-casa { transform: translateX(8px); }
  .nodo .finestra { fill: #78909c; transition: fill .4s; }
  .nodo.attivo .finestra { fill: #ffd54f; }
  .nodo .led { fill: #78909c; }
  .nodo .alone { fill: #00e676; opacity: 0; }
  .nodo.acceso .led { fill: #00e676; }
  .nodo.acceso .alone { animation: scc-led 1.6s ease-in-out infinite; }
  @keyframes scc-led { 0%, 100% { opacity: .15; } 50% { opacity: .6; } }
  .nodo .aria { opacity: .45; transition: opacity .4s; }
  .nodo .soffio { stroke-dasharray: 5 3; }
  .nodo.acceso .aria { opacity: 1; }
  .nodo.acceso .soffio { animation: scc-aria 0.8s linear infinite; }
  @keyframes scc-aria { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -8; } }
  .aria-in { fill: #29b6f6; }
  .aria-out { fill: #ff7043; }
  .nodo .livello { transition: y .6s, height .6s, fill .6s; }
  .fv-totale rect { fill: var(--card-background-color, #fff); stroke: var(--scc-solare);
                    stroke-width: 1.5; stroke-opacity: .4; transition: stroke-opacity .4s; }
  .fv-totale.attivo rect { stroke-opacity: 1; }
  .tot { font-size: 11px; font-weight: 700; }
  .linea { fill: none; stroke: var(--c); stroke-width: 2; opacity: .25; }
  .punti { fill: none; stroke: var(--c); stroke-width: 3.5; stroke-linecap: round;
           stroke-dasharray: 0.1 14; opacity: 0; }
  .attivo .linea { opacity: .55; }
  .attivo .punti { opacity: 1; animation: scc-flusso 1s linear infinite; }
  @keyframes scc-flusso { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -28.2; } }
  .oggi { display: grid; grid-template-columns: auto repeat(4, 1fr); gap: 6px; align-items: stretch;
          margin: 2px 4px 6px; }
  .oggi-tit { writing-mode: vertical-rl; transform: rotate(180deg); text-align: center;
              font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
              color: var(--secondary-text-color); }
  .riquadro { border-radius: 8px; padding: 5px 6px 6px; text-align: center;
              display: flex; flex-direction: column; justify-content: space-between;
              background: var(--secondary-background-color, #f3f3f3); border-top: 3px solid var(--c); }
  .riquadro .et { font-size: 10px; line-height: 1.2; color: var(--secondary-text-color); }
  .riquadro .kwh { font-size: 13px; font-weight: 700; color: var(--primary-text-color); margin-top: 2px;
                   white-space: nowrap; }
  .nascosto { display: none !important; }
  .carica { margin: 4px 4px 0; padding: 8px 10px; border-radius: 10px;
            background: var(--secondary-background-color, #f3f3f3); font-size: 12px; }
  .testata { display: flex; justify-content: space-between; align-items: center;
             font-weight: 600; margin-bottom: 6px; cursor: pointer; color: var(--primary-text-color); }
  .badge { font-size: 10px; letter-spacing: .05em; padding: 2px 8px; border-radius: 10px;
           background: var(--scc-caricatore); color: #fff; }
  .badge.spenta { background: var(--disabled-text-color, #9e9e9e); }
  .griglia { display: grid; grid-template-columns: max-content 1fr; gap: 3px 12px; }
  .griglia .et { color: var(--secondary-text-color); }
  .griglia .v { color: var(--primary-text-color); }
  .storico { cursor: pointer; }
  .storico:hover { text-decoration: underline; }
  .piede { font-size: 12px; color: var(--secondary-text-color); padding: 4px 4px 0; }
  .allarme { color: var(--error-color, #db4437); font-weight: 600; }
`;

const BMS_ENTITA = {
  soc: "sensor.{p}_bms_state_of_charge",
  voltage: "sensor.{p}_bms_tensione_totale",
  current: "sensor.{p}_bms_corrente",
  power: "sensor.{p}_bms_potenza",
  capacity_total: "sensor.{p}_bms_capacita_totale",
  capacity_remaining: "sensor.{p}_bms_capacita_residua",
  cell_min: "sensor.{p}_bms_cella_minima",
  cell_max: "sensor.{p}_bms_cella_massima",
  cell_avg: "sensor.{p}_bms_media_celle",
  cell_delta: "sensor.{p}_bms_delta_celle",
  temp_mos: "sensor.{p}_bms_temperatura_mos",
  temp_1: "sensor.{p}_bms_temperatura_1",
  temp_2: "sensor.{p}_bms_temperatura_2",
  temp_3: "sensor.{p}_bms_temperatura_3",
  temp_4: "sensor.{p}_bms_temperatura_4",
  balancing: "binary_sensor.{p}_bms_bilanciamento_attivo",
  balancing_current: "sensor.{p}_bms_corrente_bilanciamento",
  charge_mos: "binary_sensor.{p}_bms_mos_carica_attivo",
  discharge_mos: "binary_sensor.{p}_bms_mos_scarica_attivo",
  cycles: "sensor.{p}_bms_cicli_di_carica",
  alarms: "sensor.{p}_bms_allarmi",
  cell_count: "number.{p}_bms_numero_celle",
};
const BMS_CELLA = "sensor.{p}_bms_cella_{n}";
const BMS_CELLE_DEF = 16;
const BMS_CELLE_MAX = 32;

const BMS_SOGLIA_A = 0.5;

const BMS_STORICO = {
  v: ["voltage"], i: ["current"], soc: ["soc"],
  cap_tot: ["capacity_total"], cap_res: ["capacity_remaining"],
  cmax: ["cell_max", "cell_min", "cell_delta"], cmin: ["cell_max", "cell_min", "cell_delta"],
  delta: ["cell_delta"], temp: ["temp_1", "temp_2", "temp_3", "temp_4", "temp_mos"],
  pwr: ["power"], cicli: ["cycles"], allarme: ["alarms"],
  chg: ["charge_mos", "discharge_mos"], dch: ["charge_mos", "discharge_mos"],
  media: ["cell_avg"], bil: ["balancing", "balancing_current"],
  temps: ["temp_mos", "temp_1", "temp_2", "temp_3", "temp_4"],
  allarmi_txt: ["alarms"],
};

const BMS_VOCI = [
  ["Cella max", "cmax", "cell_max"],
  ["Temp (°C)", "temp", "temp_1,temp_2,temp_3,temp_4"],
  ["Allarmi", "allarme", "alarms"],
  ["Cella min", "cmin", "cell_min"],
  ["Potenza (kW)", "pwr", "power"],
  ["CHG", "chg", "charge_mos"],
  ["Δ celle", "delta", "cell_delta"],
  ["Cicli", "cicli", "cycles"],
  ["DCH", "dch", "discharge_mos"],
];

class SolarComboBmsCard extends SccBase {
  static getStubConfig() {
    return { prefix: "solar_combo" };
  }

  setConfig(config) {
    if (!config) throw new Error("Configurazione mancante");
    this._prefisso = config.prefix || "solar_combo";
    this._ent = entitaDa(BMS_ENTITA, this._prefisso, "", config.entities);
    const soglia = Number(config.threshold);
    this._soglia = config.threshold !== undefined && Number.isFinite(soglia) && soglia >= 0 ? soglia : BMS_SOGLIA_A;
    const colonne = Number(config.cell_columns);
    this._colonne = Number.isInteger(colonne) && colonne >= 1 && colonne <= 8 ? colonne : 4;
    this._config = config;
    this._costruita = false;
    if (this._hass) this._aggiorna();
  }

  getCardSize() {
    return 9;
  }

  _numeroCelle() {
    const n = Number(this._config.cells !== undefined ? this._config.cells : this._num("cell_count"));
    return Number.isInteger(n) && n >= 1 && n <= BMS_CELLE_MAX ? n : BMS_CELLE_DEF;
  }

  _idCella(n) {
    const sost = this._config.entities && this._config.entities[`cell_${n}`];
    return sost || BMS_CELLA.replace("{p}", this._prefisso).replace("{n}", n);
  }

  _numCella(n) {
    const s = this._hass.states[this._idCella(n)];
    const v = s ? parseFloat(s.state) : NaN;
    return Number.isFinite(v) ? v : NaN;
  }

  _esiste(chiavi) {
    return chiavi.split(",").some((k) => this._stato(k));
  }

  _costruisci(nCelle) {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const titolo = this._config.title !== undefined ? this._config.title : "JK-BMS";
    const voci = BMS_VOCI.map(([et, k, req]) => `
      <div class="voce" data-req="${req}"><span class="et">${et}:</span><span class="v" data-t="${k}"></span></div>`).join("");
    const celle = Array.from({ length: nCelle }, (_, i) => `
      <div class="cella" data-cella="${i + 1}"><span class="n">${i + 1}</span><span class="cv"></span></div>`).join("");
    this.shadowRoot.innerHTML = `
      <style>${BMS_STILE}</style>
      <ha-card>
        <div class="schermo">
          <div class="testa">
            <span class="nome">${titolo}</span>
            <span class="frecce"><i>›</i><i>›</i><i>›</i><i>›</i></span>
            <span class="verso" data-t="verso"></span>
          </div>
          <div class="misure">
            <div class="misura"><span class="icona">V</span><span class="et">Tensione</span><span class="grande" data-t="v"></span></div>
            <div class="misura"><span class="icona">A</span><span class="et">Corrente</span><span class="grande" data-t="i"></span></div>
          </div>
          <div class="centro">
            <div class="anello">
              <svg viewBox="0 0 100 100">
                <circle class="pista" cx="50" cy="50" r="40"></circle>
                <circle class="arco" cx="50" cy="50" r="40" pathLength="100" transform="rotate(-90 50 50)"></circle>
                <g class="giro"><circle cx="50" cy="50" r="40" pathLength="100" transform="rotate(-90 50 50)"></circle></g>
                <circle class="dentro" cx="50" cy="50" r="29"></circle>
              </svg>
              <span class="soc" data-t="soc"></span>
            </div>
            <div class="cap" data-req="capacity_total"><div class="num" data-t="cap_tot"></div><div class="et">Capacità totale (Ah)</div></div>
            <div class="cap" data-req="capacity_remaining"><div class="num" data-t="cap_res"></div><div class="et">Capacità residua (Ah)</div></div>
          </div>
          <div class="voci">${voci}</div>
          ${this._config.show_cells === false ? "" : `
          <div class="pannello">
            <div class="titolo-celle">Tensione celle</div>
            <div class="info">
              <span data-t="media" data-req="cell_avg"></span>
              <span data-t="bil" data-req="balancing,balancing_current"></span>
              <span data-t="temps" data-req="temp_mos,temp_1,temp_2,temp_3,temp_4"></span>
            </div>
            <div class="celle" style="grid-template-columns: repeat(${this._colonne}, 1fr)">${celle}</div>
          </div>`}
          <div class="allarmi-testo" data-t="allarmi_txt"></div>
        </div>
      </ha-card>`;
    this.shadowRoot.querySelector(".anello").addEventListener("click", () => this._piuInfo(this._ent.soc));
    this.shadowRoot.querySelectorAll("[data-t]").forEach((el) => {
      const k = el.dataset.t;
      if (!BMS_STORICO[k]) return;
      el.classList.add("storico");
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this._apriStorico(BMS_STORICO[k].map((c) => this._ent[c]));
      });
    });
    this.shadowRoot.querySelectorAll("[data-cella]").forEach((el) => {
      el.addEventListener("click", () => this._apriStorico([this._idCella(Number(el.dataset.cella))]));
    });
    this._nCelle = nCelle;
    this._costruita = true;
  }

  _aggiorna() {
    if (!this._config || !this._hass) return;
    const nCelle = this._numeroCelle();
    if (!this._costruita || nCelle !== this._nCelle) this._costruisci(nCelle);
    const r = this.shadowRoot;

    r.querySelectorAll("[data-req]").forEach((el) => {
      el.classList.toggle("nascosto", !this._esiste(el.dataset.req));
    });

    const i = this._num("current");
    this._testo("v", `${this._fmt(this._num("voltage"), 2)} V`);
    this._testo("i", `${this._fmt(i, 1)} A`);
    const verso = !Number.isFinite(i) ? "" : i >= this._soglia ? "carica" : i <= -this._soglia ? "scarica" : "riposo";
    const schermo = r.querySelector(".schermo");
    for (const v of ["carica", "scarica", "riposo"]) schermo.classList.toggle(v, verso === v);
    this._testo("verso", { carica: "IN CARICA", scarica: "IN SCARICA", riposo: "A RIPOSO" }[verso] || "");

    const soc = this._num("soc");
    const f = Number.isFinite(soc) ? Math.max(0, Math.min(100, soc)) : 0;
    const arco = r.querySelector(".arco");
    arco.style.strokeDasharray = `${f} 100`;
    arco.style.stroke = soc < 20 ? "var(--bms-rosso)" : soc < 40 ? "var(--bms-arancio)" : "var(--bms-verde)";
    this._testo("soc", `${this._fmt(soc)}%`);
    this._testo("cap_tot", this._fmt(this._num("capacity_total"), 1));
    this._testo("cap_res", this._fmt(this._num("capacity_remaining"), 1));

    const valori = [];
    for (let n = 1; n <= nCelle; n++) valori.push(this._numCella(n));
    const letti = valori.filter(Number.isFinite);
    const vMax = letti.length ? Math.max(...letti) : NaN;
    const vMin = letti.length ? Math.min(...letti) : NaN;
    const nMax = letti.length > 1 && vMax > vMin ? valori.indexOf(vMax) + 1 : 0;
    const nMin = letti.length > 1 && vMax > vMin ? valori.indexOf(vMin) + 1 : 0;
    const cmax = this._num("cell_max"), cmin = this._num("cell_min");
    this._testo("cmax", `${this._fmt(cmax, 3)} V` + (nMax ? ` (${nMax})` : ""));
    this._testo("cmin", `${this._fmt(cmin, 3)} V` + (nMin ? ` (${nMin})` : ""));
    this._testo("delta", `${this._fmt(this._num("cell_delta"))} mV`);

    const sonde = ["temp_1", "temp_2", "temp_3", "temp_4"].map((k) => this._num(k)).filter(Number.isFinite);
    this._testo("temp", sonde.length ? this._fmt(Math.max(...sonde)) : "—");
    const p = this._num("power");
    this._testo("pwr", this._fmt(p / 1000, 2));
    this._testo("cicli", this._fmt(this._num("cycles")));

    const a = this._stato("alarms");
    const allarme = !!a && !["", "unknown", "unavailable"].includes(a.state);
    this._testo("allarme", allarme ? "Allarme" : "Nessuno");
    r.querySelector('[data-t="allarme"]').classList.toggle("rosso", allarme);
    this._testo("allarmi_txt", allarme ? `Allarmi BMS: ${a.state}` : "");
    for (const [k, ent] of [["chg", "charge_mos"], ["dch", "discharge_mos"]]) {
      const s = this._stato(ent);
      const on = !!s && s.state === "on";
      this._testo(k, s ? (on ? "ON" : "OFF") : "—");
      r.querySelector(`[data-t="${k}"]`).classList.toggle("rosso", !!s && !on);
    }

    if (this._config.show_cells === false) return;

    this._testo("media", `Media ${this._fmt(this._num("cell_avg"), 3)} V`);
    const bil = this._stato("balancing");
    const bilOn = !!bil && bil.state === "on";
    const ib = this._num("balancing_current");
    this._testo("bil", `Bilanciamento ${bil ? (bilOn ? "ON" : "OFF") : "—"}` +
      (Number.isFinite(ib) && (bilOn || Math.abs(ib) > 0) ? ` ${this._fmt(ib, 2)} A` : ""));
    r.querySelector('[data-t="bil"]').classList.toggle("acceso", bilOn);
    const temps = [["temp_mos", "MOS"], ["temp_1", "T1"], ["temp_2", "T2"], ["temp_3", "T3"], ["temp_4", "T4"]]
      .filter(([k]) => this._stato(k))
      .map(([k, et]) => `${et} ${this._fmt(this._num(k))}`);
    this._testo("temps", temps.length ? `${temps.join(" · ")} °C` : "");

    r.querySelectorAll("[data-cella]").forEach((el) => {
      const n = Number(el.dataset.cella);
      const v = valori[n - 1];
      const t = `${this._fmt(v, 3)}V`;
      const cv = el.querySelector(".cv");
      if (cv.textContent !== t) cv.textContent = t;
      el.classList.toggle("max", n === nMax);
      el.classList.toggle("min", n === nMin);
      el.classList.toggle("assente", !Number.isFinite(v));
    });
  }
}

const BMS_STILE = `
  :host {
    --bms-sfondo: #0d0f12;
    --bms-riquadro: #1a1e23;
    --bms-bordo: #3a4048;
    --bms-testo: #e8eaed;
    --bms-etichetta: #c3c8ce;
    --bms-verde: #3ee65c;
    --bms-azzurro: #4fc3f7;
    --bms-rosso: #ff4d4d;
    --bms-arancio: #ffa726;
  }
  ha-card { overflow: hidden; }
  .schermo { background: var(--bms-sfondo); color: var(--bms-testo); padding: 10px 14px 12px;
             font-family: inherit; }
  .testa { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
  .nome { font-weight: 600; font-size: 1.05em; }
  .verso { justify-self: end; font-size: 11px; font-weight: 600; letter-spacing: .06em;
           color: var(--bms-etichetta); }
  .carica .verso { color: var(--bms-verde); }
  .scarica .verso { color: var(--bms-arancio); }
  .frecce { display: flex; gap: 1px; font-size: 22px; line-height: 1; font-weight: 700;
            color: var(--bms-azzurro); }
  .frecce i { font-style: normal; opacity: .25; }
  .scarica .frecce { flex-direction: row-reverse; color: var(--bms-arancio); }
  .scarica .frecce i { transform: scaleX(-1); }
  .carica .frecce i, .scarica .frecce i { animation: bms-freccia 1.2s linear infinite; }
  .frecce i:nth-child(2) { animation-delay: .3s !important; }
  .frecce i:nth-child(3) { animation-delay: .6s !important; }
  .frecce i:nth-child(4) { animation-delay: .9s !important; }
  @keyframes bms-freccia { 0%, 100% { opacity: .25; } 25% { opacity: 1; } }
  .misure { display: grid; grid-template-columns: 1fr 1fr; margin: 6px 0 2px; }
  .misura { display: flex; align-items: baseline; gap: 6px; white-space: nowrap; }
  .icona { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px;
           border: 1.5px solid var(--bms-verde); border-radius: 50%; font-size: 11px; font-weight: 700;
           color: var(--bms-verde); align-self: center; }
  .misura .et { color: var(--bms-etichetta); font-size: 14px; }
  .grande { color: var(--bms-verde); font-size: 26px; font-weight: 600; }
  .centro { display: grid; grid-template-columns: 34% 1fr 1fr; align-items: center; margin: 4px 0 6px; }
  .anello { position: relative; cursor: pointer; }
  .anello svg { width: 100%; display: block; }
  .anello circle { fill: none; stroke-width: 12; }
  .anello .pista { stroke: #2a3036; }
  .anello .arco { transition: stroke-dasharray .6s, stroke .6s; }
  .anello .dentro { fill: var(--bms-sfondo); stroke: #2f353c; stroke-width: 1.5; }
  .anello .giro { opacity: 0; transform-origin: 50px 50px; }
  .anello .giro circle { stroke: var(--bms-azzurro); stroke-dasharray: 14 86; }
  .carica .anello .giro { opacity: .9; animation: bms-giro 3s linear infinite; }
  .scarica .anello .giro { opacity: .9; animation: bms-giro 3s linear infinite reverse; }
  .scarica .anello .giro circle { stroke: var(--bms-arancio); }
  @keyframes bms-giro { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .soc { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
         font-size: 20px; font-weight: 700; }
  .cap { text-align: center; }
  .cap .num { color: var(--bms-verde); font-size: 34px; font-weight: 600; line-height: 1.1; }
  .cap .et { font-size: 11px; font-weight: 600; }
  .voci { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 4px 10px; font-size: 13px; }
  .voce { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .voce .et { color: var(--bms-etichetta); margin-right: 5px; }
  .v { color: var(--bms-verde); font-weight: 600; }
  .v.rosso { color: var(--bms-rosso); }
  .pannello { margin-top: 10px; border: 1px solid var(--bms-bordo); border-radius: 6px;
              background: var(--bms-riquadro); padding: 6px 8px 8px; }
  .titolo-celle { text-align: center; font-size: 11px; color: var(--bms-etichetta); margin-bottom: 4px; }
  .info { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 14px; font-size: 11px;
          color: var(--bms-etichetta); margin-bottom: 6px; }
  .info .acceso { color: var(--bms-azzurro); }
  .celle { display: grid; gap: 4px 10px; font-size: 13px; }
  .cella { display: flex; gap: 6px; align-items: baseline; cursor: pointer; white-space: nowrap; }
  .cella .n { color: var(--bms-etichetta); font-size: 11px; min-width: 1.4em; text-align: right; }
  .cella .cv { color: var(--bms-verde); font-weight: 600; }
  .cella.max .cv { color: var(--bms-azzurro); }
  .cella.min .cv { color: var(--bms-rosso); }
  .cella.assente .cv { color: var(--bms-etichetta); }
  .cella:hover .cv { text-decoration: underline; }
  .allarmi-testo { color: var(--bms-rosso); font-size: 12px; font-weight: 600; margin-top: 6px; }
  .allarmi-testo:empty { display: none; }
  .nascosto { display: none !important; }
  .storico { cursor: pointer; }
  .storico:hover { text-decoration: underline; }
`;

customElements.define("solar-combo-card", SolarComboCard);
customElements.define("solar-combo-bms-card", SolarComboBmsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "solar-combo-card",
  name: "Solar Combo Card",
  description: "Flusso di energia dell'impianto solar-combo: FV, inverter SMG II, JK-BMS, R4850G2, casa e rete",
  preview: true,
}, {
  type: "solar-combo-bms-card",
  name: "Solar Combo BMS Card",
  description: "Pacco batterie con JK-BMS: tensione, corrente, SOC, capacità, temperature e tensione di ogni cella",
  preview: true,
});

console.info(`%c SOLAR-COMBO-CARD %c ${VERSION} `,
  "color:#fff;background:#ff9800;font-weight:700", "color:#ff9800;background:#fff");
