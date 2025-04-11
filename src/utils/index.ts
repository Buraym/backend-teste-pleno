import csv from "csv-parser";
import fs from "fs";
import puppeteer from "puppeteer";

export function parseCSV(filePath: string, separator: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

export async function generatePaycheckReport(paychecks: any[], filters: any[]) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const formatter = new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  const rows = paychecks
    .map(
      (paycheck) => `
        <tr>
          <td><strong>${paycheck.name}</strong></td>
          <td>LOTE ${paycheck.spot_id}</td>
          <td>R$ ${formatter.format(paycheck.value)}</td>
          <td>${paycheck.code}</td>
        </tr>`
    )
    .join("");
  let appliedFilters = "";

  if (filters.length > 0) {
    if (filters.map((filter) => filter.name).includes("nome")) {
      appliedFilters += `<p>Filtro de boleto com palavra <strong><i>"${
        filters.find((filter) => filter.name === "nome").val
      }"</i></strong></p>`;
    }

    if (
      filters.map((filter) => filter.name).includes("valor_inicial") ||
      filters.map((filter) => filter.name).includes("valor_final")
    ) {
      appliedFilters += `<p>Filtro de boleto com valor entre <strong>R$ ${formatter.format(
        filters.find((filter) => filter.name === "valor_inicial").val
      )}</strong> e <strong>R$ ${formatter.format(
        filters.find((filter) => filter.name === "valor_final").val
      )}</strong></p>`;
    } else if (
      !filters.map((filter) => filter.name).includes("valor_inicial") ||
      filters.map((filter) => filter.name).includes("valor_final")
    ) {
      appliedFilters += `<p>Filtro de boleto com valor com o máximo de <strong>R$ ${formatter.format(
        filters.find((filter) => filter.name === "valor_final").val
      )}</strong></p>`;
    } else if (
      filters.map((filter) => filter.name).includes("valor_inicial") ||
      !filters.map((filter) => filter.name).includes("valor_final")
    ) {
      appliedFilters += `<p>Filtro de boleto com valor com o mínimo de <strong>R$ ${formatter.format(
        filters.find((filter) => filter.name === "valor_inicial").val
      )}</strong></p>`;
    }

    if (filters.map((filter) => filter.name).includes("id_lote")) {
      appliedFilters += `<p>Filtro de boleto com <strong>nº de lote '${
        filters.find((filter) => filter.name === "id_lote").val
      }'</strong></p>`;
    }
  }

  const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Relatório</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              background-color: #f9f9f9;
            }

            p {
              margin: 15px 10px !important;
              font-size: 16px;
              line-height:1;
            }

            table {
              width: 100%;
              font-size: 13px;
              background: #fff;
            }

            thead {
              background-color: #E70E02;
              color: white;
            }

            thead th:first-child {
              border-top-left-radius: 8px;
            }

            thead th:last-child {
              border-top-right-radius: 8px;
            }

            th, td {
              text-align: left;
              padding: 6px 10px;
              border-bottom: 1px solid #ddd;
            }

            tr:nth-child(even) {
              background-color: #f4f4f4;
            }

            th {
              background-color: #E70E02;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>Relatório de Boletos</h2>
          ${appliedFilters}
          <table>
            <thead>
              <tr>
                <th>Nome sacado</th>
                <th>Lote</th>
                <th>Valor</th>
                <th>Linha digitada</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
        </html>
    `;
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return Buffer.from(pdfBuffer).toString("base64");
}
