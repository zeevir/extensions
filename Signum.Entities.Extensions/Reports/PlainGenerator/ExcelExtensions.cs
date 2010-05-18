﻿#region usings
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using spreadsheet = DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using Signum.Entities.DynamicQuery;
using System.IO;
using Signum.Utilities.DataStructures;
using Signum.Utilities;
using System.Globalization;
#endregion

namespace Signum.Entities.Reports
{
    public static class ExcelExtensions
    {
        public static string ToStringExcel(this DateTime datetime)
        {
            return (datetime.ToOADate()).ToString(CultureInfo.InvariantCulture); //Convert to Julean Format
        }

        public static string ToStringExcel(this decimal number)
        {
            return number.ToString(CultureInfo.InvariantCulture);
        }

        public static SheetData ToSheetData(this IEnumerable<Row> rows)
        {
            return new SheetData(rows.Cast<OpenXmlElement>());
        }

        public static Row ToRow(this IEnumerable<Cell> rows)
        {
            return new Row(rows.Cast<OpenXmlElement>());
        }

        public static WorksheetPart AddWorksheet(this WorkbookPart workbookPart, string name, Worksheet sheet)
        {
            sheet.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            
            var result = workbookPart.AddNewPart<WorksheetPart>();
            result.Worksheet = sheet;
            sheet.Save();

            workbookPart.Workbook.Sheets.Append(
                new Sheet
                {
                    Name = name,
                    SheetId = (uint)workbookPart.Workbook.Sheets.Count() + 1,
                    Id = workbookPart.GetIdOfPart(result)
                });

            return result;
        }

        public static void XLDeleteSheet(this SpreadsheetDocument document, string sheetId)
        {
            WorkbookPart wbPart = document.WorkbookPart;

            Sheet theSheet = wbPart.Workbook.Descendants<Sheet>().
              Where(s => s.Id == sheetId).FirstOrDefault();

            if (theSheet == null)
                return;

            // Remove the sheet reference from the workbook.
            WorksheetPart worksheetPart = (WorksheetPart)(wbPart.GetPartById(theSheet.Id));
            theSheet.Remove();

            // Delete the worksheet part.
            wbPart.DeletePart(worksheetPart);
        }

        public static Cell FindCell(this Worksheet worksheet, string addressName)
        {
            return worksheet.Descendants<Cell>().
              Where(c => c.CellReference == addressName).FirstOrDefault();
        }

        public static string GetCellValue(this SpreadsheetDocument document, Worksheet worksheet, string addressName)
        {
            Cell theCell = worksheet.Descendants<Cell>().
              Where(c => c.CellReference == addressName).FirstOrDefault();

            // If the cell doesn't exist, return an empty string:
            if (theCell == null)
                return "";
            
            string value = theCell.InnerText;

            // If the cell represents an integer number, you're done. 
            // For dates, this code returns the serialized value that 
            // represents the date. The code handles strings and booleans
            // individually. For shared strings, the code looks up the corresponding
            // value in the shared string table. For booleans, the code converts 
            // the value into the words TRUE or FALSE.
            if (theCell.DataType == null)
                return value;

            switch (theCell.DataType.Value)
            {
                case CellValues.SharedString:
                    // For shared strings, look up the value in the shared strings table.
                    var stringTable = document.WorkbookPart.GetPartsOfType<SharedStringTablePart>().FirstOrDefault();
                    // If the shared string table is missing, something's wrong.
                    // Just return the index that you found in the cell.
                    // Otherwise, look up the correct text in the table.
                    if (stringTable != null)
                        return stringTable.SharedStringTable.ElementAt(int.Parse(value)).InnerText;
                    break;
                case CellValues.Boolean:
                    switch (value)
                    {
                        case "0":
                            return "FALSE";
                        default:
                            return "TRUE";
                    }
                    break;
            }
            return value;
        }

        public static WorksheetPart GetWorksheetPartById(this SpreadsheetDocument document, string sheetId)
        {
            WorkbookPart wbPart = document.WorkbookPart;

            Sheet theSheet = wbPart.Workbook.Descendants<Sheet>().
              Where(s => s.Id == sheetId).FirstOrDefault();

            if (theSheet == null)
                throw new ArgumentException("Sheet with id {0} not found".Formato(sheetId));

            // Retrieve a reference to the worksheet part, and then use its Worksheet property to get 
            // a reference to the cell whose address matches the address you've supplied:
            WorksheetPart wsPart = (WorksheetPart)(wbPart.GetPartById(theSheet.Id));
            return wsPart;
        }

        public static WorksheetPart GetWorksheetPartByName(this SpreadsheetDocument document, string sheetName)
        {
            WorkbookPart wbPart = document.WorkbookPart;

            Sheet theSheet = wbPart.Workbook.Descendants<Sheet>().
              Where(s => s.Name == sheetName).FirstOrDefault();

            if (theSheet == null)
                throw new ArgumentException("Sheet with name {0} not found".Formato(sheetName));

            // Retrieve a reference to the worksheet part, and then use its Worksheet property to get 
            // a reference to the cell whose address matches the address you've supplied:
            WorksheetPart wsPart = (WorksheetPart)(wbPart.GetPartById(theSheet.Id));
            return wsPart;
        }
    }
}
