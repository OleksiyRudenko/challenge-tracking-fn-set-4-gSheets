// v1.0.0
// Source code: https://github.com/OleksiyRudenko/challenge-tracking-fn-set-4-gSheets
// App: https://docs.google.com/spreadsheets/d/16lqic5VD1OWecEMCCXnvdhrsekyHCKX18uQAenODfwM/edit#gid=869151962

const config = {
  mainSpreadsheetName: "tracking",
  column: { from: 4, to: 5},
  row: { from: 8 },
  targetedColumn: { 4: 5, 5: 4},
};
const dows = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Creates a fills current and next columns with dates, days of week and short notation for the charts.
 * @param {Date} from Challenge start date
 * @param {Date} till Challenge end date
 * @returns Two columns of data representing sequence of dates with their repective days of week and short notations for the charts labels
 */
function DATEARRAY(from,till) {
  const dateList = [], tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  for (var d = from; d <= till; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d.toLocaleString('en', { timeZone: tz }));
    dateList.push([currentDate, dows[currentDate.getDay()], `${currentDate.getDate()}.${currentDate.getMonth() + 1}`]);
  }
  return dateList;
}

function onEdit(e) {
  const spreadSheet = SpreadsheetApp.getActiveSheet(),
    // nativeValue = e.value,
    range = e.range,
    column = range.getColumn(),
    row = range.getRow(),
    value = parseNumber(range.getDisplayValue());
  // Logger.log({f: "onEdit", column, row, value, range, Ax: spreadSheet.getRange(`A${row}`).getValue(), Axl: spreadSheet.getRange(`A${row}`).getValue().length});
  if (spreadSheet.getName().toLowerCase().includes(config.mainSpreadsheetName)
    && column >= config.column.from
    && column <= config.column.to 
    && row >= config.row.from
    && spreadSheet.getRange(`A${row}`).getValue().toString().length > 0
    ) {
    updateMileage(spreadSheet, column, row, value);
  }
}

function updateMileage(spreadSheet, column, row, value) {
  // Logger.log({f:"updateMileage", Ax: spreadSheet.getRange(`A${row}`).getValue(), column, row, value, range});
  const prevVal = spreadSheet.getRange(`R${row - 1}C${config.column.from}`).getDisplayValue();
  const previousCumulativeMileage = parseNumber(spreadSheet.getRange(`R${row - 1}C${config.column.from}`).getDisplayValue());
  const newValue = column === config.column.from
    ? value - previousCumulativeMileage // update increment
    : previousCumulativeMileage + value; // update cumulative
  // Logger.log({f: "updateMileage", previousCumulativeMileage, value, newValue, prevVal});
  spreadSheet.getRange(`R${row}C${config.targetedColumn[column]}`).setValue(newValue);
}

function parseNumber(string) {
  return parseFloat(string.replace(/,/g, ""));
}

/*@customfunction*/
function SHEETID() {
  return SpreadsheetApp.getActiveSheet().getSheetId()
}


/*
==================================================================================================================================
Example JSDoc
Multiplies the input value by 2.
 *
 * @param {number|Array<Array<number>>} input The value or range of cells
 *     to multiply.
 * @return The input multiplied by 2.
 * @customfunction

 */
