(() => {
  "use strict";

  const quantities = {
    speed: {
      name: "速度", initial: "72",
      units: [["km/h", "公里／小時", 1 / 3.6], ["m/s", "米／秒", 1], ["mph", "英里／小時", 0.44704]],
    },
    length: {
      name: "長度", initial: "1",
      units: [["m", "米", 1], ["cm", "厘米", 0.01], ["mm", "毫米", 0.001], ["km", "公里", 1000], ["in", "吋", 0.0254], ["ft", "呎", 0.3048]],
    },
    pressure: {
      name: "壓力", initial: "1",
      units: [["atm", "標準大氣壓", 101325], ["kPa", "千帕", 1000], ["Pa", "帕斯卡", 1], ["MPa", "兆帕", 1000000], ["bar", "巴", 100000], ["psi", "磅力／平方吋", 6894.757293168]],
    },
    mass: {
      name: "質量", initial: "1",
      units: [["kg", "公斤", 1], ["g", "克", 0.001], ["mg", "毫克", 0.000001], ["t", "公噸", 1000], ["lb", "磅", 0.45359237]],
    },
    energy: {
      name: "能量", initial: "1",
      units: [["kWh", "千瓦時", 3600000], ["J", "焦耳", 1], ["kJ", "千焦耳", 1000], ["Wh", "瓦時", 3600]],
    },
  };

  const translations = {
    "選擇工具": "Choose a tool", "單位換算": "Unit converter", "三維向量": "3D vectors", "三維向量計算": "3D vector calculator",
    "物理量": "Physical quantity", "數值": "Value", "原單位": "From", "目標單位": "To", "⇄ 對調單位": "⇄ Swap units",
    "換算結果": "Converted value", "點積 A · B": "Dot product A · B", "夾角 θ": "Angle θ", "向量": "Vector",
    "請輸入有效數值": "Enter a valid number", "換算結果超出可顯示範圍": "Result out of range",
    "請為每個分量輸入有效數值。": "Enter a valid number for each component.",
    "超出可顯示範圍": "Result out of range", "未定義": "Undefined", "零向量沒有方向，無法計算夾角。": "The angle is undefined when either vector is zero.",
    "速度": "Speed", "長度": "Length", "壓力": "Pressure", "質量": "Mass", "能量": "Energy",
    "公里／小時": "Kilometres per hour", "米／秒": "Metres per second", "英里／小時": "Miles per hour",
    "米": "Metres", "厘米": "Centimetres", "毫米": "Millimetres", "公里": "Kilometres", "吋": "Inches", "呎": "Feet",
    "標準大氣壓": "Standard atmospheres", "千帕": "Kilopascals", "帕斯卡": "Pascals", "兆帕": "Megapascals",
    "巴": "Bar", "磅力／平方吋": "Pounds-force per square inch", "公斤": "Kilograms", "克": "Grams",
    "毫克": "Milligrams", "公噸": "Tonnes", "磅": "Pounds", "千瓦時": "Kilowatt-hours", "焦耳": "Joules",
    "千焦耳": "Kilojoules", "瓦時": "Watt-hours",
  };
  let english = false;
  let formatter;
  let refreshMounted;
  const axes = ["x", "y", "z"];

  function translate(chinese) {
    return english ? translations[chinese] : chinese;
  }

  function setLanguage(locale) {
    english = /^en(?:-|$)/i.test(locale);
    formatter = new Intl.NumberFormat(english ? "en-GB" : "zh-HK", { maximumSignificantDigits: 11 });
    if (refreshMounted) refreshMounted();
  }

  function format(value) {
    if (value === 0) return "0";
    if (Math.abs(value) < 1e-6 || Math.abs(value) >= 1e12) {
      return Number(value.toPrecision(11)).toExponential();
    }
    return formatter.format(value);
  }

  function readNumber(input) {
    const number = input.value.trim() === "" ? NaN : input.valueAsNumber;
    input.setAttribute("aria-invalid", String(!Number.isFinite(number)));
    return number;
  }

  function fillOptions(select, choices) {
    select.replaceChildren(...choices.map(([value, label]) => new Option(label, value)));
  }

  function bindUnits(form) {
    const { quantity, amount, from, to } = form.elements;
    const result = form.querySelector("[data-unit-result]");
    const relation = form.querySelector("[data-unit-relation]");

    function calculate() {
      const value = readNumber(amount);
      const units = quantities[quantity.value].units;
      const source = units.find(([symbol]) => symbol === from.value);
      const target = units.find(([symbol]) => symbol === to.value);
      const factor = source[2] / target[2];
      const answer = value * factor;
      relation.textContent = "1 " + source[0] + " = " + format(factor) + " " + target[0];
      if (!Number.isFinite(value)) {
        result.textContent = translate("請輸入有效數值");
      } else if (!Number.isFinite(answer)) {
        result.textContent = translate("換算結果超出可顯示範圍");
      } else {
        result.textContent = format(answer) + " " + target[0];
      }
    }

    function fillUnits() {
      const options = quantities[quantity.value].units.map(([symbol, name]) => [symbol, translate(name) + " (" + symbol + ")"]);
      fillOptions(from, options);
      fillOptions(to, options);
    }

    function changeQuantity() {
      fillUnits();
      to.selectedIndex = 1;
      amount.value = quantities[quantity.value].initial;
      calculate();
    }

    function localize() {
      const previous = { quantity: quantity.value, from: from.value, to: to.value };
      fillOptions(quantity, Object.entries(quantities).map(([id, item]) => [id, translate(item.name)]));
      if (!previous.quantity) {
        changeQuantity();
        return;
      }
      quantity.value = previous.quantity;
      fillUnits();
      from.value = previous.from;
      to.value = previous.to;
      calculate();
    }

    quantity.addEventListener("change", changeQuantity);
    amount.addEventListener("input", calculate);
    from.addEventListener("change", calculate);
    to.addEventListener("change", calculate);
    form.querySelector("[data-unit-swap]").addEventListener("click", () => {
      const previous = from.value;
      from.value = to.value;
      to.value = previous;
      calculate();
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      calculate();
    });
    return localize;
  }

  function vectorFields(letter, defaults) {
    const inputs = axes.map((axis, index) =>
      '<label class="field"><span>' + axis + '</span><input name="' + letter + axis +
      '" data-vector="' + letter + '" data-axis="' + axis + '" type="number" step="any" required value="' +
      defaults[index] + '"></label>'
    ).join("");
    return '<fieldset class="vector-fields"><legend data-vector-name="' + letter + '">' +
      '</legend><div class="tool-grid vector-grid">' + inputs + '</div></fieldset>';
  }

  function normalized(vector) {
    const max = Math.max(...vector.map(Math.abs));
    if (max === 0) return null;
    const scaled = vector.map(value => value / max);
    const length = Math.hypot(...scaled);
    return scaled.map(value => value / length);
  }

  function dot(a, b) {
    return a.reduce((sum, value, i) => sum + value * b[i], 0);
  }

  function bindVectors(form) {
    const dotResult = form.querySelector("[data-vector-dot]");
    const angleResult = form.querySelector("[data-vector-angle]");
    const message = form.querySelector("[data-vector-message]");

    function calculate() {
      const read = letter => axes.map(axis => readNumber(form.elements[letter + axis]));
      const a = read("A");
      const b = read("B");
      if (![...a, ...b].every(Number.isFinite)) {
        dotResult.textContent = "—";
        angleResult.textContent = "—";
        message.textContent = translate("請為每個分量輸入有效數值。");
        return;
      }
      const product = dot(a, b);
      dotResult.textContent = Number.isFinite(product) ? format(product) : translate("超出可顯示範圍");
      const u = normalized(a);
      const v = normalized(b);
      if (!u || !v) {
        angleResult.textContent = translate("未定義");
        message.textContent = translate("零向量沒有方向，無法計算夾角。");
        return;
      }
      const sine = Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
      const angle = Math.atan2(sine, dot(u, v)) * 180 / Math.PI;
      angleResult.textContent = format(angle) + "°";
      message.textContent = "";
    }

    form.addEventListener("input", calculate);
    form.addEventListener("submit", event => {
      event.preventDefault();
      calculate();
    });
    return calculate;
  }

  function mount(container, selected = "units") {
    container.innerHTML = `
      <div class="tool-tabs" role="group" aria-label="選擇工具">
        <button type="button" class="pill" data-tool-tab="units">單位換算</button>
        <button type="button" class="pill" data-tool-tab="vectors">三維向量</button>
      </div>
      <form class="tool-panel" data-tool-panel="units" aria-label="單位換算">
        <h2 class="tool-title">單位換算</h2>
        <div class="tool-grid">
          <label class="field"><span>物理量</span><select name="quantity" data-unit-quantity></select></label>
          <label class="field"><span>數值</span><input name="amount" data-unit-amount type="number" step="any" required></label>
          <label class="field"><span>原單位</span><select name="from" data-unit-from></select></label>
          <label class="field"><span>目標單位</span><select name="to" data-unit-to></select></label>
        </div>
        <button type="button" class="pill" data-unit-swap>⇄ 對調單位</button>
        <div class="tool-result" aria-live="polite" aria-atomic="true">
          <span>換算結果</span><strong data-unit-result></strong><small data-unit-relation></small>
        </div>
      </form>
      <form class="tool-panel" data-tool-panel="vectors" aria-label="三維向量計算" hidden>
        <h2 class="tool-title">三維向量</h2>
        ${vectorFields("A", [1, 0, 0])}
        ${vectorFields("B", [0, 1, 0])}
        <div class="tool-grid" aria-live="polite" aria-atomic="true">
          <div class="tool-result"><span>點積 A · B</span><strong data-vector-dot></strong></div>
          <div class="tool-result"><span>夾角 θ</span><strong data-vector-angle></strong></div>
        </div>
        <p class="tool-message" role="status" data-vector-message></p>
      </form>`;

    const panels = container.querySelectorAll("[data-tool-panel]");
    const buttons = container.querySelectorAll("[data-tool-tab]");
    function select(tool) {
      panels.forEach(panel => { panel.hidden = panel.dataset.toolPanel !== tool; });
      buttons.forEach(button => {
        const active = button.dataset.toolTab === tool;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }
    buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.toolTab)));
    // The static labels in the template also provide their Traditional Chinese copy.
    const texts = [...container.querySelectorAll(".tool-tabs button, .tool-title, .tool-grid .field > span, [data-unit-swap], .tool-result > span")]
      .filter(node => Object.hasOwn(translations, node.textContent))
      .map(node => [node, node.textContent]);
    const aria = [...container.querySelectorAll("[aria-label]")].map(node => [node, node.getAttribute("aria-label")]);
    const refreshUnits = bindUnits(panels[0]);
    const refreshVectors = bindVectors(panels[1]);
    refreshMounted = () => {
      texts.forEach(([node, chinese]) => { node.textContent = translate(chinese); });
      aria.forEach(([node, chinese]) => { node.setAttribute("aria-label", translate(chinese)); });
      container.querySelectorAll("[data-vector-name]").forEach(node => {
        node.textContent = translate("向量") + " " + node.dataset.vectorName;
      });
      container.querySelectorAll("[data-vector][data-axis]").forEach(input => {
        const { vector, axis } = input.dataset;
        const label = english ? "Vector " + vector + ", " + axis + " component" : "向量 " + vector + " 的 " + axis + " 分量";
        input.setAttribute("aria-label", label);
      });
      refreshUnits();
      refreshVectors();
    };
    setLanguage(document.documentElement.lang);
    select(selected === "vectors" ? "vectors" : "units");
  }

  window.FieldTools = { mount, setLanguage };
})();
