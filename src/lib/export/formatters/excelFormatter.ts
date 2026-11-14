import { ExportColumn, ExportSheetData } from '../types';
import { escapeXml } from '../utils/textSanitizer';
import { maskPhoneNumber, maskEmail } from '../utils/piiSanitizer';

export interface ExcelWorkbookOptions<T> {
  sheets: ExportSheetData<T>[];
  maskPii?: boolean;
  author?: string;
  company?: string;
}

/**
 * Generates a full Microsoft Excel XML Workbook string (SpreadsheetML) supporting
 * multiple tabs, styled headers, auto-column widths, and numeric/date formatting.
 */
export function formatDataToExcelXml<T>(options: ExcelWorkbookOptions<T>): string {
  const { sheets, maskPii = false, author = 'UFUQ ’26 Organizing Council', company = 'ADSA Alathurpadi' } = options;

  const nowIso = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>${escapeXml(author)}</Author>
  <LastAuthor>${escapeXml(author)}</LastAuthor>
  <Created>${nowIso}</Created>
  <Company>${escapeXml(company)}</Company>
  <Version>16.00</Version>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#111827"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <!-- Brand Header Style -->
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#C9A45C"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#0B132B" ss:Pattern="Solid"/>
  </Style>
  <!-- Title Banner Style -->
  <Style ss:ID="TitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="16" ss:Color="#0B132B" ss:Bold="1"/>
  </Style>
  <!-- Subtitle Style -->
  <Style ss:ID="SubTitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#6B7280" ss:Italic="1"/>
  </Style>
  <!-- Zebra Data Row 1 (Clean White) -->
  <Style ss:ID="DataRow">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#1F2937"/>
  </Style>
  <!-- Zebra Data Row 2 (Subtle Cream/Ice) -->
  <Style ss:ID="DataRowAlt">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#1F2937"/>
   <Interior ss:Color="#F9FAFB" ss:Pattern="Solid"/>
  </Style>
  <!-- Centered Data Style -->
  <Style ss:ID="DataCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#1F2937"/>
  </Style>
  <!-- Metric Key Style -->
  <Style ss:ID="MetricKey">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="10" ss:Color="#4B5563" ss:Bold="1"/>
   <Interior ss:Color="#F3F4F6" ss:Pattern="Solid"/>
  </Style>
  <!-- Metric Val Style -->
  <Style ss:ID="MetricVal">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#0B132B" ss:Bold="1"/>
  </Style>
 </Styles>
`;

  // Render each Worksheet tab
  for (const sheet of sheets) {
    const { sheetName, data, columns, title, subTitle } = sheet;
    const safeSheetName = escapeXml(sheetName.substring(0, 31).replace(/[\\/*?[\]:]/g, '_'));

    xml += ` <Worksheet ss:Name="${safeSheetName}">\n`;
    xml += `  <Table x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">\n`;

    // Define column widths
    for (const col of columns) {
      const width = col.width ? col.width * 7.5 : 120;
      xml += `   <Column ss:AutoFitWidth="1" ss:Width="${width}"/>\n`;
    }

    // Optional Title Banner Row
    if (title) {
      xml += `   <Row ss:Height="28">\n`;
      xml += `    <Cell ss:StyleID="TitleStyle"><Data ss:Type="String">${escapeXml(title)}</Data></Cell>\n`;
      xml += `   </Row>\n`;
    }
    if (subTitle) {
      xml += `   <Row ss:Height="18">\n`;
      xml += `    <Cell ss:StyleID="SubTitleStyle"><Data ss:Type="String">${escapeXml(subTitle)}</Data></Cell>\n`;
      xml += `   </Row>\n`;
      xml += `   <Row ss:Height="6"/>\n`; // Spacing row
    }

    // Header Row
    xml += `   <Row ss:Height="26">\n`;
    for (const col of columns) {
      xml += `    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>\n`;
    }
    xml += `   </Row>\n`;

    // Data Rows
    data.forEach((item, rowIndex) => {
      const isAlt = rowIndex % 2 === 1;
      const baseStyle = isAlt ? 'DataRowAlt' : 'DataRow';

      xml += `   <Row ss:Height="20">\n`;

      columns.forEach((col) => {
        let val = col.accessor(item, rowIndex);

        if (maskPii && col.isPii) {
          if (typeof val === 'string' && val.includes('@')) {
            val = maskEmail(val);
          } else {
            val = maskPhoneNumber(String(val));
          }
        }

        let type = 'String';
        let formattedVal = '';

        if (val === null || val === undefined) {
          formattedVal = '';
        } else if (typeof val === 'number') {
          type = 'Number';
          formattedVal = String(val);
        } else if (typeof val === 'boolean') {
          type = 'String';
          formattedVal = val ? 'Yes' : 'No';
        } else {
          type = 'String';
          formattedVal = escapeXml(String(val));
        }

        const cellStyle = col.alignment === 'center' ? 'DataCenter' : baseStyle;

        xml += `    <Cell ss:StyleID="${cellStyle}"><Data ss:Type="${type}">${formattedVal}</Data></Cell>\n`;
      });

      xml += `   </Row>\n`;
    });

    xml += `  </Table>\n`;
    xml += `  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">\n`;
    xml += `   <PageSetup>\n`;
    xml += `    <Header x:Margin="0.3"/>\n`;
    xml += `    <Footer x:Margin="0.3"/>\n`;
    xml += `    <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>\n`;
    xml += `   </PageSetup>\n`;
    xml += `   <FitToPage/>\n`;
    xml += `   <Print>\n`;
    xml += `    <FitWidth>1</FitWidth>\n`;
    xml += `    <FitHeight>0</FitHeight>\n`;
    xml += `    <ValidPrinterInfo/>\n`;
    xml += `    <PaperSizeIndex>9</PaperSizeIndex>\n`; // A4
    xml += `   </Print>\n`;
    xml += `   <Selected/>\n`;
    xml += `   <FreezePanes/>\n`;
    xml += `   <FrozenNoSplit/>\n`;
    xml += `   <SplitHorizontal>${title ? (subTitle ? 4 : 3) : 1}</SplitHorizontal>\n`;
    xml += `   <TopRowBottomPane>${title ? (subTitle ? 4 : 3) : 1}</TopRowBottomPane>\n`;
    xml += `   <ActivePane>2</ActivePane>\n`;
    xml += `  </WorksheetOptions>\n`;
    xml += ` </Worksheet>\n`;
  }

  xml += `</Workbook>`;
  return xml;
}
