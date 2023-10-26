using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Data;
using System.Text.RegularExpressions;

namespace Backend.Infrastructure.Utils
{
    public class ExcelHelper
    {
        private readonly IWebHostEnvironment _env;

        public ExcelHelper(IWebHostEnvironment env)
        {
            _env = env;
        }

        public static DataTable ReadExcelasDataTable(Stream stream)
        {
            try
            {
                DataTable dt = new();
                using (SpreadsheetDocument spreadSheetDocument = SpreadsheetDocument.Open(stream, false))
                {
                    WorkbookPart workbookPart = spreadSheetDocument.WorkbookPart;
                    IEnumerable<Sheet> sheets = spreadSheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>().Elements<Sheet>();
                    string relationshipId = sheets.First().Id.Value;
                    WorksheetPart worksheetPart = (WorksheetPart)spreadSheetDocument.WorkbookPart.GetPartById(relationshipId);
                    Worksheet workSheet = worksheetPart.Worksheet;
                    SheetData sheetData = workSheet.GetFirstChild<SheetData>();
                    IEnumerable<Row> rows = sheetData.Descendants<Row>();
                    foreach (Cell cell in rows.ElementAt(0))
                    {
                        dt.Columns.Add(GetCellValue(spreadSheetDocument, cell));
                    }
                    foreach (Row row in rows)
                    {
                        DataRow tempRow = dt.NewRow();
                        int columnIndex = 0;
                        foreach (Cell cell in row.Descendants<Cell>())
                        {
                            int cellColumnIndex = (int)GetColumnIndexFromName(GetColumnName(cell.CellReference));
                            cellColumnIndex--;
                            if (columnIndex < cellColumnIndex)
                            {
                                do
                                {
                                    tempRow[columnIndex] = "";
                                    columnIndex++;
                                }
                                while (columnIndex < cellColumnIndex);
                            }
                            tempRow[columnIndex] = GetCellValue(spreadSheetDocument, cell);

                            columnIndex++;
                        }
                        dt.Rows.Add(tempRow);
                    }
                }

                dt.Rows.RemoveAt(0);

                return dt;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public static string GetColumnName(string cellReference)
        {
            Regex regex = new("[A-Za-z]+");
            Match match = regex.Match(cellReference);
            return match.Value;
        }
        public static int? GetColumnIndexFromName(string columnName)
        {
            string name = columnName;
            int number = 0;
            int pow = 1;
            for (int i = name.Length - 1; i >= 0; i--)
            {
                number += (name[i] - 'A' + 1) * pow;
                pow *= 26;
            }
            return number;
        }

        public static string GetCellValue(SpreadsheetDocument document, Cell cell)
        {
            SharedStringTablePart stringTablePart = document.WorkbookPart.SharedStringTablePart;
            if (cell.CellValue == null)
            {
                return "";
            }
            string value = cell.CellValue.InnerXml;
            if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
            {
                return stringTablePart.SharedStringTable.ChildElements[Int32.Parse(value)].InnerText;
            }
            else
            {
                return value;
            }
        }


    }
}