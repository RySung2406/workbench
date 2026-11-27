(() => {
  const materials = [
    {
      topic: "auto",
      title: "How Do All-Electric Cars Work?",
      url: "https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work",
      summary: "美國能源部以部件圖解說電池、馬達、充電器和傳動系統如何共同驅動電動車。"
    },
    {
      topic: "robot",
      title: "Modern Robotics · Video Supplements",
      url: "https://modernrobotics.northwestern.edu/",
      summary: "西北大學按章節提供教學影片，可由剛體運動、正向運動學一路查到軌跡規劃與控制。"
    },
    {
      topic: "m2",
      title: "2026 HKDSE Mathematics M2 · Samples of Candidates’ Performance",
      url: "https://www.hkeaa.edu.hk/en/HKDSE/assessment/subject_information/category_a_subjects/math/sp/2026_Sample_M2.html",
      summary: "香港考評局提供不同等級的考生答卷示例，可比較同一試題的解題步驟和數學表達。"
    },
    {
      topic: "mech",
      title: "Design and Manufacturing I",
      url: "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/",
      summary: "MIT 機械工程入門課程，以機電設計項目講解機件選擇、分析與製造，附課程資料及習作。"
    }
  ];

  // Set data-public-csv on this script only after confirming anonymous read access.
  const publicCsv = document.currentScript?.dataset.publicCsv;
  const topicIds = new Set(["auto", "robot", "m2", "mech"]);
  const columns = ["title", "topic", "url", "summary"];

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (quoted && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = !quoted;
        }
      } else if (!quoted && char === ",") {
        row.push(field.trim());
        field = "";
      } else if (!quoted && (char === "\r" || char === "\n")) {
        if (char === "\r" && text[i + 1] === "\n") i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
    if (quoted) throw new Error("Incomplete CSV");
    if (row.length || field) rows.push([...row, field.trim()]);
    return rows;
  }

  function readMaterials(csv) {
    const [header, ...rows] = parseCsv(csv);
    const fields = columns.map(key => header?.indexOf(key) ?? -1);
    if (fields.includes(-1)) throw new Error("Unexpected resource columns");
    const results = [];
    for (const row of rows) {
      const [title, topic, href, summary] = fields.map(index => row[index]);
      if (!title || !topicIds.has(topic) || !summary || !/^https?:\/\//i.test(href || "")) continue;
      let url;
      try {
        url = new URL(href);
      } catch {
        continue;
      }
      if (!url.username && !url.password) results.push({ title, topic, url: url.href, summary });
    }
    return results;
  }

  window.FIELD_MATERIALS = materials;
  window.loadFieldMaterials = async () => {
    if (!publicCsv) return materials;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const source = new URL(publicCsv);
      if (source.origin !== "https://docs.google.com" || !source.pathname.startsWith("/spreadsheets/d/")) return materials;
      const response = await fetch(source, { credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal });
      if (!response.ok) return materials;
      return readMaterials(await response.text());
    } catch {
      return materials;
    } finally {
      clearTimeout(timeout);
    }
  };
})();
