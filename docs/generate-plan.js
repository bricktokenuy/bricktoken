const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, LevelFormat
} = require("docx");

// Brand colors
const NAVY = "1B2A4A";
const GOLD = "C9A84C";
const DARK = "0F1829";
const LIGHT_GOLD = "F5EFE0";
const LIGHT_GRAY = "F7F7F7";
const MED_GRAY = "E5E5E5";
const WHITE = "FFFFFF";
const TEXT_DARK = "333333";
const TEXT_MED = "666666";

// Borders
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: MED_GRAY };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

// Page constants (US Letter)
const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN; // 9360

// Helper: Create a table cell
function cell(text, opts = {}) {
  const { bold, color, bg, width, align, font, size, span } = opts;
  return new TableCell({
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    columnSpan: span,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    borders: opts.borders || thinBorders,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: "center",
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text: String(text),
            bold: bold || false,
            color: color || TEXT_DARK,
            font: font || "Arial",
            size: size || 20,
          }),
        ],
      }),
    ],
  });
}

// Helper: Section title
function sectionTitle(num, title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({ text: `${num}. `, bold: true, color: GOLD, font: "Georgia", size: 32 }),
      new TextRun({ text: title, bold: true, color: NAVY, font: "Georgia", size: 32 }),
    ],
  });
}

// Helper: Sub-section title
function subTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({ text, bold: true, color: NAVY, font: "Georgia", size: 26 }),
    ],
  });
}

// Helper: Body paragraph
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        color: opts.color || TEXT_DARK,
        font: "Arial",
        size: opts.size || 21,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

// Helper: Gold accent line
function goldLine() {
  return new Paragraph({
    spacing: { before: 100, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
    children: [],
  });
}

// Helper: spacer
function spacer(pts = 200) {
  return new Paragraph({ spacing: { before: pts }, children: [] });
}

// ========== BUILD DOCUMENT ==========

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 21, color: TEXT_DARK } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Georgia", color: NAVY },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Georgia", color: NAVY },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // ===== PORTADA =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children: [
        spacer(2000),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "BT", bold: true, color: GOLD, font: "Georgia", size: 72 }),
            new TextRun({ text: "  |  ", color: MED_GRAY, font: "Arial", size: 48 }),
            new TextRun({ text: "Brick", bold: true, color: NAVY, font: "Georgia", size: 56 }),
            new TextRun({ text: "Token", bold: false, color: NAVY, font: "Georgia", size: 56 }),
          ],
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 8 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 8 } },
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({ text: "PLAN DE NEGOCIO", bold: true, color: NAVY, font: "Arial", size: 28, characterSpacing: 200 }),
          ],
        }),
        spacer(300),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Democratizando la inversi\u00F3n inmobiliaria en Uruguay", color: TEXT_MED, font: "Georgia", size: 24, italics: true }),
          ],
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({ text: "\"No vendemos rendimiento. Vendemos ", color: NAVY, font: "Georgia", size: 28, italics: true }),
            new TextRun({ text: "ACCESO", bold: true, color: GOLD, font: "Georgia", size: 28, italics: true }),
            new TextRun({ text: ".\"", color: NAVY, font: "Georgia", size: 28, italics: true }),
          ],
        }),
        spacer(1500),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Abril 2026  |  Montevideo, Uruguay", color: TEXT_MED, font: "Arial", size: 20 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80 },
          children: [
            new TextRun({ text: "Documento confidencial", color: TEXT_MED, font: "Arial", size: 18, italics: true }),
          ],
        }),
      ],
    },

    // ===== CONTENIDO PRINCIPAL =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 4 } },
              children: [
                new TextRun({ text: "BrickToken", bold: true, color: NAVY, font: "Georgia", size: 18 }),
                new TextRun({ text: "  |  Plan de Negocio", color: TEXT_MED, font: "Arial", size: 16 }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: MED_GRAY, space: 4 } },
              children: [
                new TextRun({ text: "Confidencial  |  P\u00E1gina ", color: TEXT_MED, font: "Arial", size: 16 }),
                new TextRun({ children: [PageNumber.CURRENT], color: TEXT_MED, font: "Arial", size: 16 }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ===== 1. RESUMEN EJECUTIVO =====
        sectionTitle("1", "Resumen Ejecutivo"),
        goldLine(),
        body("BrickToken es una plataforma de inversi\u00F3n inmobiliaria tokenizada en Uruguay. Permite a cualquier persona invertir desde USD 100 en propiedades reales, respaldadas por fideicomisos constituidos legalmente. Los inversores reciben rendimientos trimestrales por alquiler y participan en la revalorizaci\u00F3n del inmueble."),
        spacer(100),
        new Paragraph({
          shading: { fill: LIGHT_GOLD, type: ShadingType.CLEAR },
          spacing: { before: 100, after: 200 },
          indent: { left: 200, right: 200 },
          children: [
            new TextRun({ text: "Propuesta de valor: ", bold: true, color: NAVY, font: "Arial", size: 21 }),
            new TextRun({ text: "Acceder al mercado inmobiliario uruguayo \u2014 hist\u00F3ricamente reservado a quienes tienen USD 100K+ \u2014 desde USD 100, sin tr\u00E1mites, sin administrar inquilinos, con total transparencia.", color: TEXT_DARK, font: "Arial", size: 21 }),
          ],
        }),

        // ===== 2. EL PROBLEMA =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("2", "El Problema"),
        goldLine(),
        ...[
          "Invertir en inmuebles en Uruguay requiere un capital m\u00EDnimo de USD 100K-400K",
          "Gestionar una propiedad es complejo: inquilinos, mantenimiento, impuestos, vacancia",
          "Los peque\u00F1os ahorristas no tienen opciones de inversi\u00F3n inmobiliaria",
          "Falta de transparencia en el mercado inmobiliario tradicional",
          "Inversi\u00F3n totalmente il\u00EDquida \u2014 vender un inmueble lleva meses",
        ].map(t => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 80 },
          children: [new TextRun({ text: t, font: "Arial", size: 21, color: TEXT_DARK })],
        })),

        // ===== 3. LA SOLUCION =====
        spacer(200),
        sectionTitle("3", "La Soluci\u00F3n"),
        goldLine(),
        body("BrickToken tokeniza propiedades reales en Uruguay. Cada propiedad se estructura bajo un fideicomiso legal, se divide en tokens digitales, y los inversores compran tokens que representan participaci\u00F3n real en el fideicomiso."),
        spacer(100),
        body("Cada token da derecho a:", { bold: true }),
        ...[
          "Participaci\u00F3n proporcional en los ingresos por alquiler (distribuci\u00F3n trimestral)",
          "Participaci\u00F3n proporcional en la revalorizaci\u00F3n del inmueble",
          "Transparencia total: documentos legales, tasaciones, rendiciones de cuentas",
        ].map(t => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 80 },
          children: [new TextRun({ text: t, font: "Arial", size: 21, color: TEXT_DARK })],
        })),

        // ===== 4. COMO FUNCIONA =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("4", "C\u00F3mo Funciona"),
        goldLine(),
        subTitle("4.1 Para el Inversor"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [1200, 2400, 5760],
          rows: [
            new TableRow({
              children: [
                cell("PASO", { bold: true, bg: NAVY, color: WHITE, width: 1200, align: AlignmentType.CENTER }),
                cell("ACCI\u00D3N", { bold: true, bg: NAVY, color: WHITE, width: 2400 }),
                cell("DETALLE", { bold: true, bg: NAVY, color: WHITE, width: 5760 }),
              ],
            }),
            ...([
              ["1", "Crear cuenta", "Registro con datos personales y documento (KYC b\u00E1sico)"],
              ["2", "Explorar propiedades", "Cat\u00E1logo con detalles, documentos, rendimientos proyectados"],
              ["3", "Comprar tokens", "Desde USD 100, pago por transferencia bancaria o tarjeta"],
              ["4", "Recibir rendimientos", "Distribuci\u00F3n trimestral en USD, visible en dashboard"],
              ["5", "Vender tokens", "Marketplace interno, sujeto a lock-up de 6 meses"],
            ]).map(([paso, accion, detalle], i) =>
              new TableRow({
                children: [
                  cell(paso, { bold: true, bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, color: GOLD, width: 1200, align: AlignmentType.CENTER, size: 22 }),
                  cell(accion, { bold: true, bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 2400 }),
                  cell(detalle, { bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 5760 }),
                ],
              })
            ),
          ],
        }),
        spacer(300),
        subTitle("4.2 Para BrickToken (flujo operativo)"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [1200, 2400, 5760],
          rows: [
            new TableRow({
              children: [
                cell("PASO", { bold: true, bg: NAVY, color: WHITE, width: 1200, align: AlignmentType.CENTER }),
                cell("FASE", { bold: true, bg: NAVY, color: WHITE, width: 2400 }),
                cell("DETALLE", { bold: true, bg: NAVY, color: WHITE, width: 5760 }),
              ],
            }),
            ...([
              ["1", "Sourcing", "Identificar propiedades con yield atractivo (>6% bruto)"],
              ["2", "Due diligence", "Tasaci\u00F3n independiente, estudio de t\u00EDtulos, an\u00E1lisis de mercado"],
              ["3", "Fideicomiso", "Constituci\u00F3n del fideicomiso con escriban\u00EDa"],
              ["4", "Tokenizaci\u00F3n", "Creaci\u00F3n de tokens digitales sobre la propiedad"],
              ["5", "Venta de tokens", "Fase de financiaci\u00F3n en la plataforma"],
              ["6", "Gesti\u00F3n", "Administraci\u00F3n del alquiler, cobro, distribuci\u00F3n"],
              ["7", "Reporting", "Rendiciones trimestrales transparentes a inversores"],
            ]).map(([paso, fase, detalle], i) =>
              new TableRow({
                children: [
                  cell(paso, { bold: true, bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, color: GOLD, width: 1200, align: AlignmentType.CENTER, size: 22 }),
                  cell(fase, { bold: true, bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 2400 }),
                  cell(detalle, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 5760 }),
                ],
              })
            ),
          ],
        }),

        // ===== 5. MODELO DE NEGOCIO =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("5", "Modelo de Negocio \u2014 Revenue Streams"),
        goldLine(),
        subTitle("5.1 Fee de Compra (2.5%)"),
        body("Cobrado al inversor al momento de comprar tokens."),
        body("Ejemplo: Inversor compra $1,000 en tokens \u2192 paga $25 de fee."),
        body("Proyecci\u00F3n con $5M tokenizados en A\u00F1o 1: USD 125,000", { bold: true }),
        spacer(100),
        subTitle("5.2 Management Fee (8% del ingreso neto)"),
        body("Cobrado mensualmente sobre el ingreso neto de cada propiedad administrada."),
        body("Cubre: gesti\u00F3n de inquilinos, mantenimiento, cobro de alquiler, impuestos, seguros, reporting trimestral, compliance legal del fideicomiso, operaci\u00F3n de la plataforma."),
        body("Ejemplo: Propiedad con ingreso neto $7,460/a\u00F1o \u2192 fee $597/a\u00F1o"),
        spacer(100),
        subTitle("5.3 Fee de Venta Secundaria (1.5%)"),
        body("Cobrado al vendedor cuando vende tokens en el marketplace. Incentiva el holding a largo plazo."),
        spacer(100),
        subTitle("5.4 Tokens No Vendidos"),
        body("Los tokens no vendidos quedan en el fideicomiso como posici\u00F3n de BrickToken. Se recibe la parte proporcional de la renta. No es ganancia directa \u2014 es capital invertido que se recupera al vender esos tokens o al liquidar la propiedad."),
        spacer(200),

        // Revenue summary table
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: [
                cell("FUENTE DE INGRESO", { bold: true, bg: NAVY, color: WHITE, width: 3120 }),
                cell("% / MONTO", { bold: true, bg: NAVY, color: WHITE, width: 3120, align: AlignmentType.CENTER }),
                cell("TIPO", { bold: true, bg: NAVY, color: WHITE, width: 3120, align: AlignmentType.CENTER }),
              ],
            }),
            ...([
              ["Fee de compra", "2.5% sobre inversi\u00F3n", "One-time"],
              ["Management fee", "8% del ingreso neto", "Recurrente"],
              ["Fee venta secundaria", "1.5% sobre venta", "Transaccional"],
              ["Renta tokens propios", "Proporcional", "Recurrente"],
            ]).map(([fuente, monto, tipo], i) =>
              new TableRow({
                children: [
                  cell(fuente, { bold: true, bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 3120 }),
                  cell(monto, { bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 3120, align: AlignmentType.CENTER }),
                  cell(tipo, { bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 3120, align: AlignmentType.CENTER }),
                ],
              })
            ),
          ],
        }),

        // ===== 6. FLUJO POR PROPIEDAD =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("6", "Flujo de Ingresos por Propiedad"),
        goldLine(),

        // Ejemplo 1
        subTitle("Ejemplo 1: Monoambiente Cord\u00F3n/Pocitos (Target)"),
        body("Valor: USD 120,000  |  Alquiler: USD 750/mes  |  Tokens: 1,200 a USD 100", { bold: true }),
        spacer(50),
        ...buildPropertyTable(
          [
            ["Ingreso bruto anual", "$9,000"],
            ["Contribuci\u00F3n + Primaria", "-$800"],
            ["Mantenimiento (3%)", "-$270"],
            ["Vacancia (3%)", "-$270"],
            ["Seguro", "-$200"],
          ],
          "$7,460",
          "-$597",
          "$6,863",
          "5.7%",
          "3-5%",
          "8.7-10.7%"
        ),
        spacer(300),

        // Ejemplo 2
        subTitle("Ejemplo 2: Local Comercial Ciudad Vieja"),
        body("Valor: USD 350,000  |  Alquiler: USD 3,500/mes  |  Tokens: 3,500 a USD 100", { bold: true }),
        spacer(50),
        ...buildPropertyTable(
          [
            ["Ingreso bruto anual", "$42,000"],
            ["Contribuci\u00F3n + Primaria", "-$2,500"],
            ["Mantenimiento (3%)", "-$1,260"],
            ["Vacancia (5%)", "-$2,100"],
            ["Seguro", "-$400"],
          ],
          "$35,740",
          "-$2,859",
          "$32,881",
          "9.4%",
          "2-4%",
          "11.4-13.4%"
        ),
        spacer(300),

        // Ejemplo 3
        subTitle("Ejemplo 3: Apartamento 2 Dorm. Pocitos"),
        body("Valor: USD 360,000  |  Alquiler: USD 1,490/mes  |  Tokens: 3,600 a USD 100", { bold: true }),
        spacer(50),
        ...buildPropertyTable(
          [
            ["Ingreso bruto anual", "$17,880"],
            ["Contribuci\u00F3n + Primaria", "-$2,500"],
            ["Mantenimiento (3%)", "-$536"],
            ["Vacancia (5%)", "-$894"],
            ["Seguro", "-$400"],
          ],
          "$13,550",
          "-$1,084",
          "$12,466",
          "3.5%",
          "3-5%",
          "6.5-8.5%"
        ),

        // ===== 7. MARKETPLACE =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("7", "Marketplace de Tokens (Mercado Secundario)"),
        goldLine(),
        body("Modelo: Libro de \u00F3rdenes simple donde vendedores listan tokens y compradores los adquieren."),
        spacer(100),
        ...[
          "Vendedor lista tokens al precio que desee (precio m\u00EDnimo = \u00FAltima tasaci\u00F3n)",
          "Comprador ve: precio de lista, precio base (tasaci\u00F3n), yield actual, historial",
          "BrickToken cobra 1.5% fee al vendedor",
          "Lock-up: 6 meses desde la compra (no se puede vender antes)",
          "Tasaci\u00F3n independiente cada 6 meses actualiza el precio base del token",
        ].map(t => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 80 },
          children: [new TextRun({ text: t, font: "Arial", size: 21, color: TEXT_DARK })],
        })),
        spacer(100),
        new Paragraph({
          shading: { fill: LIGHT_GOLD, type: ShadingType.CLEAR },
          spacing: { before: 100, after: 100 },
          indent: { left: 200, right: 200 },
          children: [
            new TextRun({ text: "Importante: ", bold: true, color: NAVY, font: "Arial", size: 21 }),
            new TextRun({ text: "BrickToken NO garantiza recompra de tokens en esta etapa. Si no hay comprador, el token queda listado. A futuro se evaluar\u00E1 un fondo de liquidez.", color: TEXT_DARK, font: "Arial", size: 21 }),
          ],
        }),
        spacer(100),
        subTitle("Determinaci\u00F3n del precio del token"),
        body("Precio base = Valor tasaci\u00F3n de la propiedad / Total de tokens"),
        body("La tasaci\u00F3n es realizada por tasador independiente matriculado cada 6 meses."),
        body("El vendedor puede listar a precio base (venta r\u00E1pida) o con prima."),
        body("El comprador siempre ve el precio base como referencia de valor real."),

        // ===== 8. REQUISITOS INVERSOR =====
        spacer(200),
        sectionTitle("8", "Requisitos para el Inversor"),
        goldLine(),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3500, 5860],
          rows: [
            new TableRow({
              children: [
                cell("REQUISITO", { bold: true, bg: NAVY, color: WHITE, width: 3500 }),
                cell("DETALLE", { bold: true, bg: NAVY, color: WHITE, width: 5860 }),
              ],
            }),
            ...([
              ["Edad", "Mayor de 18 a\u00F1os"],
              ["Documento", "C\u00E9dula de identidad uruguaya o pasaporte"],
              ["Cuenta bancaria", "En Uruguay (para recibir distribuciones en USD)"],
              ["Inversi\u00F3n m\u00EDnima", "USD 100 (1 token)"],
              ["Inversi\u00F3n m\u00E1xima", "Sin l\u00EDmite"],
              ["KYC", "Verificaci\u00F3n de identidad obligatoria"],
              ["Residencia", "No se requiere ser residente \u2014 inversores extranjeros bienvenidos"],
            ]).map(([req, det], i) =>
              new TableRow({
                children: [
                  cell(req, { bold: true, bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 3500 }),
                  cell(det, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 5860 }),
                ],
              })
            ),
          ],
        }),

        // ===== 9. ESTRUCTURA LEGAL =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("9", "Estructura Legal"),
        goldLine(),
        body("Veh\u00EDculo: Fideicomiso de administraci\u00F3n (Ley 17.703)", { bold: true }),
        spacer(100),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3500, 5860],
          rows: [
            new TableRow({
              children: [
                cell("ELEMENTO", { bold: true, bg: NAVY, color: WHITE, width: 3500 }),
                cell("DETALLE", { bold: true, bg: NAVY, color: WHITE, width: 5860 }),
              ],
            }),
            ...([
              ["Fiduciante", "BrickToken S.A.S. (o S.R.L.)"],
              ["Fiduciario", "Empresa fiduciaria autorizada por BCU"],
              ["Beneficiarios", "Los tenedores de tokens"],
              ["Estructura", "Un fideicomiso por propiedad (ring-fencing de riesgo)"],
              ["Token", "Cada token = participaci\u00F3n en el fideicomiso"],
              ["Regulaci\u00F3n", "Participaciones en fideicomiso (no valores regulados por BCU)"],
            ]).map(([elem, det], i) =>
              new TableRow({
                children: [
                  cell(elem, { bold: true, bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 3500 }),
                  cell(det, { bg: i % 2 === 0 ? LIGHT_GOLD : WHITE, width: 5860 }),
                ],
              })
            ),
          ],
        }),
        spacer(100),
        new Paragraph({
          shading: { fill: "FFF3CD", type: ShadingType.CLEAR },
          spacing: { before: 100, after: 200 },
          indent: { left: 200, right: 200 },
          children: [
            new TextRun({ text: "Nota legal: ", bold: true, color: "856404", font: "Arial", size: 20 }),
            new TextRun({ text: "Se debe validar con estudio jur\u00EDdico especializado la estructura final y si requiere autorizaci\u00F3n del BCU como intermediaci\u00F3n financiera.", color: "856404", font: "Arial", size: 20 }),
          ],
        }),

        // ===== 10. ETAPAS DE DESARROLLO =====
        spacer(100),
        sectionTitle("10", "Etapas de Desarrollo del Negocio"),
        goldLine(),
        ...buildStageTable("ETAPA 1", "MVP y Validaci\u00F3n", "Mes 1-3", [
          "Plataforma web funcional (ya construida \u2713)",
          "1-2 propiedades iniciales (de socios o conocidos)",
          "Constituci\u00F3n legal de BrickToken S.A.S.",
          "Primer fideicomiso constituido",
          "10-20 inversores iniciales (red cercana)",
        ], "Validar el modelo, hacer primera distribuci\u00F3n de rendimientos", "USD 150K-200K"),

        spacer(200),
        ...buildStageTable("ETAPA 2", "Tracci\u00F3n Inicial", "Mes 4-8", [
          "3-5 propiedades en plataforma",
          "Marketplace de venta secundaria b\u00E1sico",
          "Sistema de pagos integrado",
          "50-100 inversores",
          "Primera tasaci\u00F3n de revalorizaci\u00F3n",
        ], "Demostrar retorno real, caso de \u00E9xito publicable", "USD 300K-500K adicional"),

        new Paragraph({ children: [new PageBreak()] }),
        ...buildStageTable("ETAPA 3", "Crecimiento", "Mes 9-18", [
          "10-20 propiedades diversificadas (residencial, comercial)",
          "200-500 inversores",
          "App mobile",
          "Alianzas con inmobiliarias y desarrolladores",
          "Fondo de liquidez para marketplace",
        ], "Revenue mensual que cubra costos operativos (break-even)", "Seg\u00FAn crecimiento"),

        spacer(200),
        ...buildStageTable("ETAPA 4", "Escala", "Mes 18-36", [
          "30-50+ propiedades",
          "1,000+ inversores",
          "Expansi\u00F3n a otros tipos de activos",
          "Posible expansi\u00F3n regional (Argentina, Paraguay)",
          "Licencia BCU si requerida",
        ], "$15M+ en AUM, revenue sostenible", "Reinversi\u00F3n + posible ronda"),

        // ===== 11. RIESGOS =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("11", "An\u00E1lisis de Riesgos"),
        goldLine(),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2800, 1300, 1300, 3960],
          rows: [
            new TableRow({
              children: [
                cell("RIESGO", { bold: true, bg: NAVY, color: WHITE, width: 2800 }),
                cell("PROB.", { bold: true, bg: NAVY, color: WHITE, width: 1300, align: AlignmentType.CENTER }),
                cell("IMPACTO", { bold: true, bg: NAVY, color: WHITE, width: 1300, align: AlignmentType.CENTER }),
                cell("MITIGACI\u00D3N", { bold: true, bg: NAVY, color: WHITE, width: 3960 }),
              ],
            }),
            ...([
              ["Regulatorio (BCU exige licencia)", "Media", "Alto", "Asesor\u00EDa legal preventiva, estructura fideicomiso"],
              ["Baja demanda de inversores", "Media", "Alto", "Propiedades de socios, marketing org\u00E1nico"],
              ["Vacancia prolongada", "Baja", "Medio", "Reserva de vacancia, diversificaci\u00F3n"],
              ["Morosidad inquilinos", "Media", "Medio", "Garant\u00EDas de alquiler, seguros"],
              ["Devaluaci\u00F3n (rentas en pesos)", "Media", "Medio", "Alquileres en USD"],
              ["Iliquidez de tokens", "Alta", "Medio", "Transparencia, lock-up, marketplace gradual"],
              ["Ca\u00EDda mercado inmobiliario", "Baja", "Alto", "Diversificaci\u00F3n por tipo y zona"],
            ]).map(([riesgo, prob, impacto, mitigacion], i) =>
              new TableRow({
                children: [
                  cell(riesgo, { bold: true, bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 2800, size: 19 }),
                  cell(prob, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 1300, align: AlignmentType.CENTER, size: 19 }),
                  cell(impacto, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 1300, align: AlignmentType.CENTER, size: 19, color: impacto === "Alto" ? "CC0000" : GOLD }),
                  cell(mitigacion, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 3960, size: 19 }),
                ],
              })
            ),
          ],
        }),

        // ===== 12. PROYECCIONES =====
        spacer(300),
        sectionTitle("12", "Proyecciones Financieras"),
        goldLine(),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3360, 2000, 2000, 2000],
          rows: [
            new TableRow({
              children: [
                cell("CONCEPTO", { bold: true, bg: NAVY, color: WHITE, width: 3360 }),
                cell("A\u00D1O 1", { bold: true, bg: NAVY, color: WHITE, width: 2000, align: AlignmentType.CENTER }),
                cell("A\u00D1O 2", { bold: true, bg: NAVY, color: WHITE, width: 2000, align: AlignmentType.CENTER }),
                cell("A\u00D1O 3", { bold: true, bg: NAVY, color: WHITE, width: 2000, align: AlignmentType.CENTER }),
              ],
            }),
            ...([
              ["Propiedades activas", "3-5", "10-20", "30-50"],
              ["Capital tokenizado (AUM)", "$500K-1M", "$2M-5M", "$8M-15M"],
              ["Inversores activos", "30-100", "200-500", "800-2,000"],
              ["Revenue fee compra (2.5%)", "$12.5K-25K", "$50K-125K", "$200K-375K"],
              ["Revenue management (8%)", "$3K-5K", "$12K-30K", "$50K-100K"],
              ["Revenue marketplace (1.5%)", "$0", "$2K-5K", "$10K-25K"],
              ["Revenue total", "$15K-30K", "$64K-160K", "$260K-500K"],
              ["Costos operativos/mes", "$8K-12K", "$15K-25K", "$30K-50K"],
              ["Resultado", "Negativo", "Breakeven", "Positivo"],
            ]).map(([concepto, a1, a2, a3], i) => {
              const isTotal = concepto === "Revenue total" || concepto === "Resultado";
              const bg = isTotal ? LIGHT_GOLD : (i % 2 === 0 ? LIGHT_GRAY : WHITE);
              return new TableRow({
                children: [
                  cell(concepto, { bold: isTotal, bg, width: 3360 }),
                  cell(a1, { bold: isTotal, bg, width: 2000, align: AlignmentType.CENTER, color: concepto === "Resultado" ? "CC0000" : TEXT_DARK }),
                  cell(a2, { bold: isTotal, bg, width: 2000, align: AlignmentType.CENTER, color: concepto === "Resultado" ? GOLD : TEXT_DARK }),
                  cell(a3, { bold: isTotal, bg, width: 2000, align: AlignmentType.CENTER, color: concepto === "Resultado" ? "228B22" : TEXT_DARK }),
                ],
              });
            }),
          ],
        }),

        // ===== 13. CIERRE =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("13", "Por Qu\u00E9 BrickToken"),
        goldLine(),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "\"No vendemos rendimiento.", color: NAVY, font: "Georgia", size: 36, italics: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Vendemos ", color: NAVY, font: "Georgia", size: 36, italics: true }),
            new TextRun({ text: "ACCESO", bold: true, color: GOLD, font: "Georgia", size: 40 }),
            new TextRun({ text: ".\"", color: NAVY, font: "Georgia", size: 36, italics: true }),
          ],
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "El acceso a invertir en inmuebles uruguayos que antes requer\u00EDa cientos de miles de d\u00F3lares.", color: TEXT_MED, font: "Georgia", size: 24 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: "Ahora desde USD 100.", bold: true, color: NAVY, font: "Georgia", size: 28 }),
          ],
        }),
        spacer(800),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: MED_GRAY, space: 8 } },
          spacing: { before: 400 },
          children: [
            new TextRun({ text: "Este documento es informativo y no constituye oferta de valores ni asesoramiento financiero. Las proyecciones son estimativas y no garantizan resultados futuros. Consulte con su asesor financiero antes de invertir.", color: TEXT_MED, font: "Arial", size: 16, italics: true }),
          ],
        }),
      ],
    },
  ],
});

// Helper: Build property flow table
function buildPropertyTable(items, neto, fee, distrib, yieldPct, apreciacion, totalReturn) {
  const rows = [
    new TableRow({
      children: [
        cell("CONCEPTO", { bold: true, bg: NAVY, color: WHITE, width: 6000 }),
        cell("MONTO", { bold: true, bg: NAVY, color: WHITE, width: 3360, align: AlignmentType.RIGHT }),
      ],
    }),
    ...items.map(([concepto, monto], i) =>
      new TableRow({
        children: [
          cell(concepto, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 6000 }),
          cell(monto, { bg: i % 2 === 0 ? LIGHT_GRAY : WHITE, width: 3360, align: AlignmentType.RIGHT }),
        ],
      })
    ),
    new TableRow({
      children: [
        cell("= Ingreso neto", { bold: true, bg: LIGHT_GOLD, width: 6000 }),
        cell(neto, { bold: true, bg: LIGHT_GOLD, width: 3360, align: AlignmentType.RIGHT, color: NAVY }),
      ],
    }),
    new TableRow({
      children: [
        cell("Fee BrickToken (8%)", { bg: WHITE, width: 6000 }),
        cell(fee, { bg: WHITE, width: 3360, align: AlignmentType.RIGHT, color: "CC0000" }),
      ],
    }),
    new TableRow({
      children: [
        cell("= DISTRIBUCI\u00D3N A INVERSORES", { bold: true, bg: NAVY, color: WHITE, width: 6000 }),
        cell(distrib + "/a\u00F1o", { bold: true, bg: NAVY, color: GOLD, width: 3360, align: AlignmentType.RIGHT }),
      ],
    }),
  ];

  const table = new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [6000, 3360],
    rows,
  });

  return [
    table,
    spacer(50),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Yield neto inversor: ", color: TEXT_DARK, font: "Arial", size: 21 }),
        new TextRun({ text: yieldPct, bold: true, color: NAVY, font: "Arial", size: 22 }),
        new TextRun({ text: "  +  Apreciaci\u00F3n estimada: ", color: TEXT_DARK, font: "Arial", size: 21 }),
        new TextRun({ text: apreciacion + "/a\u00F1o", bold: true, color: GOLD, font: "Arial", size: 22 }),
        new TextRun({ text: "  =  Retorno total: ", color: TEXT_DARK, font: "Arial", size: 21 }),
        new TextRun({ text: totalReturn, bold: true, color: "228B22", font: "Arial", size: 22 }),
      ],
    }),
  ];
}

// Helper: Build stage section
function buildStageTable(etapa, nombre, periodo, items, meta, inversion) {
  return [
    new Paragraph({
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      spacing: { before: 100, after: 50 },
      indent: { left: 100, right: 100 },
      children: [
        new TextRun({ text: `${etapa}: `, bold: true, color: GOLD, font: "Georgia", size: 24 }),
        new TextRun({ text: `${nombre}  `, bold: true, color: WHITE, font: "Georgia", size: 24 }),
        new TextRun({ text: `(${periodo})`, color: MED_GRAY, font: "Arial", size: 20 }),
      ],
    }),
    ...items.map(t => new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text: t, font: "Arial", size: 20, color: TEXT_DARK })],
    })),
    new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [
        new TextRun({ text: "Meta: ", bold: true, color: NAVY, font: "Arial", size: 20 }),
        new TextRun({ text: meta, color: TEXT_DARK, font: "Arial", size: 20 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Inversi\u00F3n: ", bold: true, color: NAVY, font: "Arial", size: 20 }),
        new TextRun({ text: inversion, color: GOLD, font: "Arial", size: 20, bold: true }),
      ],
    }),
  ];
}

// Generate
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/enriquezerbino/Desktop/bricktoken/docs/BrickToken_Plan_de_Negocio.docx", buffer);
  console.log("DOCX generated successfully!");
});
