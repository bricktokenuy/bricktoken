const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

pres.layout = "LAYOUT_16x9";
pres.author = "BrickToken";
pres.title = "BrickToken - Pitch Deck";

const NAVY = "1B2A4A";
const DARK = "0F1829";
const GOLD = "C9A84C";
const LIGHT_GOLD = "F5EFE0";
const WHITE = "FFFFFF";
const LGRAY = "94A3B8";
const MED = "64748B";

// ============ SLIDE 1: PORTADA ============
const s1 = pres.addSlide();
s1.background = { color: DARK };

// Top accent bar
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

// Logo
s1.addText([
  { text: "BT", options: { bold: true, color: GOLD, fontSize: 56, fontFace: "Georgia" } },
  { text: "  |  ", options: { color: LGRAY, fontSize: 36, fontFace: "Arial" } },
  { text: "Brick", options: { bold: true, color: WHITE, fontSize: 44, fontFace: "Georgia" } },
  { text: "Token", options: { color: WHITE, fontSize: 44, fontFace: "Georgia" } },
], { x: 0.5, y: 1.2, w: 9, h: 1.2, align: "center" });

// Subtitle
s1.addText("Democratizando la inversi\u00F3n inmobiliaria en Uruguay", {
  x: 1, y: 2.6, w: 8, h: 0.6, align: "center",
  fontSize: 16, fontFace: "Arial", color: LGRAY, italic: true,
});

// Gold divider
s1.addShape(pres.shapes.LINE, {
  x: 3.5, y: 3.4, w: 3, h: 0, line: { color: GOLD, width: 2 },
});

// Tagline
s1.addText([
  { text: "No vendemos rendimiento. Vendemos ", options: { color: WHITE, fontSize: 22, fontFace: "Georgia", italic: true } },
  { text: "ACCESO", options: { bold: true, color: GOLD, fontSize: 24, fontFace: "Georgia", italic: true } },
  { text: ".", options: { color: WHITE, fontSize: 22, fontFace: "Georgia", italic: true } },
], { x: 1, y: 3.7, w: 8, h: 0.8, align: "center" });

// Date
s1.addText("Abril 2026  |  Montevideo, Uruguay", {
  x: 1, y: 5, w: 8, h: 0.4, align: "center",
  fontSize: 11, fontFace: "Arial", color: MED,
});

// ============ SLIDE 2: EL PROBLEMA ============
const s2 = pres.addSlide();
s2.background = { color: DARK };
s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s2.addText("El problema", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

const problems = [
  ["01", "Capital inaccesible", "Se necesitan USD 120K-400K m\u00EDnimo para invertir en un inmueble en Uruguay"],
  ["02", "Gesti\u00F3n compleja", "Inquilinos, mantenimiento, impuestos, vacancia. Administrar una propiedad es un trabajo"],
  ["03", "Sin opciones para ahorristas", "Quien tiene USD 1,000-10,000 ahorrados no tiene forma de acceder al mercado inmobiliario"],
  ["04", "Inversi\u00F3n il\u00EDquida", "Vender un inmueble lleva meses. El capital queda atrapado sin posibilidad de salida r\u00E1pida"],
];

problems.forEach(([num, title, desc], i) => {
  const y = 1.3 + i * 1.05;
  // Number circle
  s2.addShape(pres.shapes.OVAL, { x: 0.7, y: y + 0.05, w: 0.6, h: 0.6, fill: { color: GOLD } });
  s2.addText(num, { x: 0.7, y: y + 0.05, w: 0.6, h: 0.6, align: "center", valign: "middle", fontSize: 16, fontFace: "Arial", bold: true, color: DARK });
  // Title
  s2.addText(title, { x: 1.6, y: y - 0.05, w: 7.5, h: 0.4, fontSize: 18, fontFace: "Georgia", bold: true, color: WHITE, margin: 0 });
  // Description
  s2.addText(desc, { x: 1.6, y: y + 0.35, w: 7.5, h: 0.45, fontSize: 12, fontFace: "Arial", color: LGRAY, margin: 0 });
});

// ============ SLIDE 3: LA SOLUCION ============
const s3 = pres.addSlide();
s3.background = { color: DARK };
s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s3.addText([
  { text: "Brick", options: { bold: true, color: WHITE, fontSize: 36, fontFace: "Georgia" } },
  { text: "Token", options: { color: WHITE, fontSize: 36, fontFace: "Georgia" } },
  { text: ": La soluci\u00F3n", options: { color: GOLD, fontSize: 36, fontFace: "Georgia" } },
], { x: 0.6, y: 0.3, w: 9, h: 0.8, margin: 0 });

s3.addText("Tokenizamos propiedades reales en Uruguay. Cada propiedad se estructura bajo un fideicomiso legal y se divide en tokens digitales.", {
  x: 0.7, y: 1.2, w: 8.5, h: 0.6, fontSize: 14, fontFace: "Arial", color: LGRAY,
});

const solutions = [
  ["Fideicomiso legal", "Cada propiedad = 1 fideicomiso constituido (Ley 17.703)"],
  ["Desde USD 100", "Inversi\u00F3n m\u00EDnima accesible para cualquier persona"],
  ["Rendimientos trimestrales", "Distribuci\u00F3n autom\u00E1tica de ingresos por alquiler"],
  ["Transparencia total", "Documentos legales, tasaciones y rendiciones p\u00FAblicas"],
  ["Revalorizaci\u00F3n", "Participaci\u00F3n en la apreciaci\u00F3n del inmueble"],
];

solutions.forEach(([title, desc], i) => {
  const y = 2.1 + i * 0.7;
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: y + 0.08, w: 0.06, h: 0.4, fill: { color: GOLD } });
  s3.addText(title, { x: 1.1, y: y, w: 3, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: WHITE, margin: 0 });
  s3.addText(desc, { x: 4.2, y: y + 0.02, w: 5.2, h: 0.35, fontSize: 11, fontFace: "Arial", color: LGRAY, margin: 0 });
});

// ============ SLIDE 4: COMO FUNCIONA ============
const s4 = pres.addSlide();
s4.background = { color: DARK };
s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s4.addText("C\u00F3mo funciona", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

const steps = [
  ["1", "Crear cuenta", "Registro con KYC b\u00E1sico"],
  ["2", "Explorar", "Cat\u00E1logo de propiedades verificadas"],
  ["3", "Comprar tokens", "Desde USD 100 por transferencia o tarjeta"],
  ["4", "Cobrar rentas", "Distribuci\u00F3n trimestral autom\u00E1tica"],
  ["5", "Vender", "Marketplace interno (lock-up 6 meses)"],
];

steps.forEach(([num, title, desc], i) => {
  const x = 0.3 + i * 1.9;
  const w = 1.7;
  // Card bg
  s4.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w, h: 3.2, fill: { color: "1E3250" } });
  // Number
  s4.addShape(pres.shapes.OVAL, { x: x + 0.55, y: 1.8, w: 0.6, h: 0.6, fill: { color: GOLD } });
  s4.addText(num, { x: x + 0.55, y: 1.8, w: 0.6, h: 0.6, align: "center", valign: "middle", fontSize: 20, fontFace: "Arial", bold: true, color: DARK });
  // Title
  s4.addText(title, { x: x + 0.1, y: 2.6, w: w - 0.2, h: 0.5, align: "center", fontSize: 15, fontFace: "Georgia", bold: true, color: WHITE });
  // Desc
  s4.addText(desc, { x: x + 0.1, y: 3.2, w: w - 0.2, h: 0.8, align: "center", fontSize: 10, fontFace: "Arial", color: LGRAY });

  // Arrow between cards
  if (i < 4) {
    s4.addText("\u25B6", { x: x + w - 0.05, y: 2.85, w: 0.3, h: 0.3, align: "center", fontSize: 10, color: GOLD });
  }
});

// ============ SLIDE 5: LOS NUMEROS ============
const s5 = pres.addSlide();
s5.background = { color: DARK };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s5.addText("Los n\u00FAmeros", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

const properties = [
  {
    name: "Monoambiente\nCord\u00F3n/Pocitos", value: "USD 120K", rent: "USD 750/mes",
    yield: "5.7%", apre: "+3-5%", total: "8.7-10.7%", tokens: "1,200 tokens",
  },
  {
    name: "Local Comercial\nCiudad Vieja", value: "USD 350K", rent: "USD 3,500/mes",
    yield: "9.4%", apre: "+2-4%", total: "11.4-13.4%", tokens: "3,500 tokens",
  },
  {
    name: "Apartamento 2D\nPocitos", value: "USD 360K", rent: "USD 1,490/mes",
    yield: "3.5%", apre: "+3-5%", total: "6.5-8.5%", tokens: "3,600 tokens",
  },
];

properties.forEach((p, i) => {
  const x = 0.5 + i * 3.1;
  const w = 2.9;
  // Card
  s5.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w, h: 4, fill: { color: "1E3250" } });
  // Gold top accent
  s5.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w, h: 0.06, fill: { color: GOLD } });
  // Name
  s5.addText(p.name, { x: x + 0.15, y: 1.4, w: w - 0.3, h: 0.7, fontSize: 14, fontFace: "Georgia", bold: true, color: WHITE, align: "center" });
  // Value & rent
  s5.addText(p.value, { x: x + 0.15, y: 2.15, w: w - 0.3, h: 0.35, fontSize: 12, fontFace: "Arial", color: LGRAY, align: "center" });
  s5.addText(p.rent, { x: x + 0.15, y: 2.45, w: w - 0.3, h: 0.3, fontSize: 11, fontFace: "Arial", color: MED, align: "center" });
  // Yield
  s5.addText("Yield neto", { x: x + 0.15, y: 2.9, w: w - 0.3, h: 0.25, fontSize: 10, fontFace: "Arial", color: MED, align: "center" });
  s5.addText(p.yield, { x: x + 0.15, y: 3.1, w: w - 0.3, h: 0.5, fontSize: 32, fontFace: "Georgia", bold: true, color: GOLD, align: "center" });
  // Apre
  s5.addText("Apreciaci\u00F3n est.", { x: x + 0.15, y: 3.6, w: w - 0.3, h: 0.25, fontSize: 10, fontFace: "Arial", color: MED, align: "center" });
  s5.addText(p.apre, { x: x + 0.15, y: 3.8, w: w - 0.3, h: 0.35, fontSize: 16, fontFace: "Arial", color: LGRAY, align: "center" });
  // Total line
  s5.addShape(pres.shapes.LINE, { x: x + 0.4, y: 4.25, w: w - 0.8, h: 0, line: { color: GOLD, width: 1 } });
  s5.addText("Retorno total", { x: x + 0.15, y: 4.3, w: w - 0.3, h: 0.25, fontSize: 10, fontFace: "Arial", color: MED, align: "center" });
  s5.addText(p.total, { x: x + 0.15, y: 4.5, w: w - 0.3, h: 0.4, fontSize: 18, fontFace: "Georgia", bold: true, color: WHITE, align: "center" });
});

// ============ SLIDE 6: REVENUE MODEL ============
const s6 = pres.addSlide();
s6.background = { color: DARK };
s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s6.addText("Modelo de negocio", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

const revenues = [
  ["2.5%", "Fee de compra", "Cobrado al inversor al adquirir tokens", "One-time"],
  ["8%", "Management fee", "Sobre el ingreso neto por alquiler (mensual)", "Recurrente"],
  ["1.5%", "Fee marketplace", "Al vendedor en mercado secundario", "Transaccional"],
  ["\u223C", "Renta tokens propios", "Ingreso proporcional sobre tokens no vendidos", "Recurrente"],
];

revenues.forEach(([pct, title, desc, type], i) => {
  const y = 1.4 + i * 1.0;
  // Card
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.85, fill: { color: "1E3250" } });
  // Percentage
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 1.5, h: 0.85, fill: { color: GOLD } });
  s6.addText(pct, { x: 0.6, y, w: 1.5, h: 0.85, align: "center", valign: "middle", fontSize: 28, fontFace: "Georgia", bold: true, color: DARK });
  // Content
  s6.addText(title, { x: 2.4, y: y + 0.05, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Georgia", bold: true, color: WHITE, margin: 0 });
  s6.addText(desc, { x: 2.4, y: y + 0.42, w: 4.5, h: 0.3, fontSize: 11, fontFace: "Arial", color: LGRAY, margin: 0 });
  // Type badge
  const isRecurrent = type === "Recurrente";
  s6.addShape(pres.shapes.RECTANGLE, { x: 7.6, y: y + 0.25, w: 1.5, h: 0.35, fill: { color: isRecurrent ? "1B4332" : "3D2B1F" } });
  s6.addText(type, { x: 7.6, y: y + 0.25, w: 1.5, h: 0.35, align: "center", valign: "middle", fontSize: 10, fontFace: "Arial", bold: true, color: isRecurrent ? "4ADE80" : GOLD });
});

// ============ SLIDE 7: COMPARATIVA ============
const s7 = pres.addSlide();
s7.background = { color: DARK };
s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s7.addText("Por qu\u00E9 BrickToken", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

const compHeaders = [
  { text: "", options: { fill: { color: DARK }, color: DARK } },
  { text: "BrickToken", options: { fill: { color: GOLD }, color: DARK, bold: true, fontSize: 12 } },
  { text: "Compra directa", options: { fill: { color: "1E3250" }, color: WHITE, bold: true, fontSize: 11 } },
  { text: "Plazo fijo", options: { fill: { color: "1E3250" }, color: WHITE, bold: true, fontSize: 11 } },
  { text: "S&P 500", options: { fill: { color: "1E3250" }, color: WHITE, bold: true, fontSize: 11 } },
];

const compRows = [
  ["Inversi\u00F3n m\u00EDnima", "USD 100", "USD 120K+", "USD 1,000", "USD 500"],
  ["Liquidez", "Media", "Muy baja", "Alta", "Alta"],
  ["Gesti\u00F3n", "Ninguna", "Total", "Ninguna", "Ninguna"],
  ["Yield estimado", "5-9%", "4-6%", "~3%", "~10%"],
  ["Respaldo", "Inmueble real", "Inmueble real", "Banco", "Acciones"],
  ["Diversificaci\u00F3n", "M\u00FAltiple", "1 propiedad", "N/A", "Alta"],
  ["Transparencia", "Total", "Variable", "Baja", "Alta"],
];

const tableData = [
  compHeaders,
  ...compRows.map((row, ri) => row.map((cell, ci) => ({
    text: cell,
    options: {
      fill: { color: ci === 1 ? (ri % 2 === 0 ? "3D3520" : "2E2818") : (ri % 2 === 0 ? "1E3250" : "172A42") },
      color: ci === 1 ? GOLD : (ci === 0 ? WHITE : LGRAY),
      bold: ci === 0 || ci === 1,
      fontSize: ci === 0 ? 11 : 11,
      fontFace: ci === 0 ? "Georgia" : "Arial",
    },
  }))),
];

s7.addTable(tableData, {
  x: 0.5, y: 1.3, w: 9, h: 3.5,
  colW: [2, 1.8, 1.8, 1.7, 1.7],
  border: { pt: 0.5, color: "2A3F5F" },
  rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
});

// ============ SLIDE 8: ROADMAP ============
const s8 = pres.addSlide();
s8.background = { color: DARK };
s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });

s8.addText("Etapas de desarrollo", {
  x: 0.6, y: 0.3, w: 9, h: 0.8, fontSize: 36, fontFace: "Georgia", color: WHITE, bold: true, margin: 0,
});

// Timeline line
s8.addShape(pres.shapes.LINE, { x: 0.8, y: 1.65, w: 8.4, h: 0, line: { color: GOLD, width: 3 } });

const stages = [
  { num: "1", name: "MVP", period: "Mes 1-3", items: ["Plataforma web", "1-2 propiedades", "10-20 inversores", "Primer fideicomiso"] },
  { num: "2", name: "Tracci\u00F3n", period: "Mes 4-8", items: ["3-5 propiedades", "Marketplace b\u00E1sico", "50-100 inversores", "Pagos integrados"] },
  { num: "3", name: "Crecimiento", period: "Mes 9-18", items: ["10-20 propiedades", "200-500 inversores", "App mobile", "Fondo liquidez"] },
  { num: "4", name: "Escala", period: "Mes 18-36", items: ["30-50+ propiedades", "1,000+ inversores", "Expansi\u00F3n regional", "$15M+ AUM"] },
];

stages.forEach((stage, i) => {
  const x = 0.5 + i * 2.3;
  const w = 2.1;
  // Circle on timeline
  s8.addShape(pres.shapes.OVAL, { x: x + 0.7, y: 1.35, w: 0.6, h: 0.6, fill: { color: GOLD } });
  s8.addText(stage.num, { x: x + 0.7, y: 1.35, w: 0.6, h: 0.6, align: "center", valign: "middle", fontSize: 18, fontFace: "Arial", bold: true, color: DARK });
  // Stage name
  s8.addText(stage.name, { x: x, y: 2.1, w: w, h: 0.4, align: "center", fontSize: 16, fontFace: "Georgia", bold: true, color: WHITE });
  // Period
  s8.addText(stage.period, { x: x, y: 2.45, w: w, h: 0.3, align: "center", fontSize: 10, fontFace: "Arial", color: GOLD });
  // Items card
  s8.addShape(pres.shapes.RECTANGLE, { x: x + 0.05, y: 2.9, w: w - 0.1, h: 2.2, fill: { color: "1E3250" } });
  stage.items.forEach((item, j) => {
    s8.addText(item, {
      x: x + 0.15, y: 3.0 + j * 0.48, w: w - 0.3, h: 0.4,
      fontSize: 10, fontFace: "Arial", color: LGRAY,
      bullet: true,
    });
  });
});

// ============ SLIDE 9: CIERRE ============
const s9 = pres.addSlide();
s9.background = { color: DARK };
s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GOLD } });
s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: GOLD } });

s9.addText([
  { text: "No vendemos rendimiento.", options: { breakLine: true, color: WHITE, fontSize: 30, fontFace: "Georgia", italic: true } },
  { text: "Vendemos ", options: { color: WHITE, fontSize: 30, fontFace: "Georgia", italic: true } },
  { text: "ACCESO", options: { bold: true, color: GOLD, fontSize: 36, fontFace: "Georgia" } },
  { text: ".", options: { color: WHITE, fontSize: 30, fontFace: "Georgia", italic: true } },
], { x: 1, y: 1.2, w: 8, h: 1.8, align: "center", valign: "middle" });

s9.addShape(pres.shapes.LINE, { x: 3.5, y: 3.2, w: 3, h: 0, line: { color: GOLD, width: 2 } });

s9.addText("Invert\u00ED en inmuebles uruguayos desde USD 100", {
  x: 1, y: 3.5, w: 8, h: 0.6, align: "center",
  fontSize: 18, fontFace: "Arial", color: LGRAY,
});

s9.addText("bricktoken.uy", {
  x: 1, y: 4.3, w: 8, h: 0.5, align: "center",
  fontSize: 14, fontFace: "Arial", bold: true, color: GOLD,
});

s9.addText("Contacto: info@bricktoken.uy", {
  x: 1, y: 4.8, w: 8, h: 0.4, align: "center",
  fontSize: 11, fontFace: "Arial", color: MED,
});

// Write file
pres.writeFile({ fileName: "/Users/enriquezerbino/Desktop/bricktoken/docs/BrickToken_Pitch_Deck.pptx" })
  .then(() => console.log("PPTX generated successfully!"))
  .catch(err => console.error(err));
