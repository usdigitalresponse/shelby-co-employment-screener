const maxColumns = 200;
class SheetClass {
  constructor(name, workbookId, columnHeaders) {
    this.name = name;
    if (workbookId) {
      this.sheet = SpreadsheetApp.openById(workbookId).getSheetByName(name);
    } else {
      this.sheet = SpreadsheetApp.getActive().getSheetByName(name);
    }
    if (columnHeaders) {
      this.lastColumn = this.columnLetterFromIndex(columnHeaders.length - 1);
      this.setRowData(1, [columnHeaders]);
      this.headerData = [columnHeaders];
    } else {
      this.findLastColumnHeader();
      if (this.lastColumn < 'A') {
        throw 'No headers in sheet named: ' + this.name;
      }
      let rangeSpec = 'A1:' + this.lastColumn + '1';
      let headerRange = this.sheet.getRange(rangeSpec);
      this.headerData = headerRange.getValues();
    }
  }
  removeEmptyCells(rowData) {
    let i;
    let lastCol = rowData.length - 1;
    for (i = lastCol; i >= 0; i--) {
      if (rowData[i] === '') {
        rowData.pop();
      } else {
        break;
      }
    }
  }
  findLastColumnHeader() {
    let rangeSpec = 'A1:' + this.columnLetterFromIndex(maxColumns - 1) + '1';
    let headerRange = this.sheet.getRange(rangeSpec);
    let headerData = headerRange.getValues()[0];
    this.removeEmptyCells(headerData);
    if (headerData.length === maxColumns) {
      logger.logAndAlert('Warning', 'Sheet: "' + this.name + '" may have more than ' + maxColumns +
                    ' columns. Ignoring columns after: ' + maxColumns + '.');
    }
    this.headerData = headerData;
    this.lastColumn = this.columnLetterFromIndex(headerData.length - 1);
  }
  columnIndex(columnName) {
    let index = this.headerData[0].indexOf(columnName);
    if (index < 0) {
      let msg = 'No column named: "' + columnName + '" in sheet: "' + this.name + '".';
      logger.logAndAlert('Error', msg);
      throw msg;
    }
    return index;
  }
  columnName(columnIndex) {
    if (columnIndex >= this.headerData[0].length) {
      let msg = 'Column index too big: "' + columnIndex + '" in sheet: "' + this.name + '"?';
      logger.logAndAlert('Error', msg);
      throw msg;
    }
    return this.headerData[0][columnIndex];
  }
  getRowCount() {
    return this.sheet.getLastRow();
  }
  getRowData(rowNumber) {
    let rangeSpec = 'A' + rowNumber + ':' + this.lastColumn + rowNumber;
    try {
      let range = this.sheet.getRange(rangeSpec);
      return range.getValues();
    } catch(err) {
      logger.writeLogLine(['Exception', 'Sheet: "' + this.name + '", range: ' + rangeSpec]);
      throw err;
    }
  }
  getColumnData(columnName) {
    let columnIndex = this.columnIndex(columnName);
    return this.sheet.getRange(2, columnIndex + 1, this.getRowCount() - 1).getValues();
  }
  setRowData(rowNumber, data) {
    let range = this.sheet.getRange('A' + rowNumber + ':' + this.lastColumn + rowNumber);
    range.setValues(data);
  }
  setMultipleRows(rowNumber, data) {
    let lastRow = rowNumber + data.length - 1;
    let range = this.sheet.getRange('A' + rowNumber + ':' + this.lastColumn + lastRow);
    range.setValues(data);
  }
  load(data) {
    let lastRow = data.length;
    this.headers = [data[0]];
    this.lastColumn = this.columnLetterFromIndex(this.headers[0].length - 1);
    let rangeSpec = 'A1' + ':' + this.lastColumn + lastRow;
    let range = this.sheet.getRange(rangeSpec);
    this.sheet.clear();
    range.setValues(data);
  }
  columnIndexFromLetter(colId) {
    let highOrderVal = 0;
    let lowOrderIndex = 0;
    if (colId.length > 1) {
      highOrderVal = 26 * (colId.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
      lowOrderIndex = 1;
    }
    return highOrderVal + colId.charCodeAt(lowOrderIndex) - 'A'.charCodeAt(0);
  }
  columnLetterFromIndex(columnIdx) {
    let charCodeA = 'A'.charCodeAt(0);
    let higherOrderDigit = Math.floor(columnIdx / 26);
    let columnLetter = '';
    if (higherOrderDigit > 0) {
      columnLetter = String.fromCharCode(charCodeA + higherOrderDigit - 1);
    }
    columnLetter += String.fromCharCode(charCodeA + (columnIdx % 26));
    return columnLetter;
  }
  columnLetterFromName(columnName) {
    return this.columnLetterFromIndex(this.columnIndex(columnName));
  }
  setCellData(rowNumber, columnName, data) {
    let columnLetter = this.columnLetterFromName(columnName);
    let range = this.sheet.getRange(columnLetter + rowNumber + ':' + columnLetter + rowNumber);
    let arr = [[data]];
    range.setValues(arr);
  }
  sortSheet(sortColumn, ascendingVal) {
    let address = 'A2:' + this.lastColumn + this.getRowCount();
    let range = this.sheet.getRange(address);
    let columnIdx = this.columnIndex(sortColumn) + 1;
    range.sort({column: columnIdx, ascending: ascendingVal});
  }
  lookupRowIndex(columnName, keyValue) { // (0-based) 
    let columnLetter = this.columnLetterFromName(columnName);
    let values = this.sheet.getRange(columnLetter + '1:' + columnLetter).getValues();
    let i = 0;
    while (i < values.length) {
      if (values[i][0] === keyValue) {
        return i;
      }
      i++;
    }
    return -1;
  }
  clearData() {
    let rowCount = this.getRowCount();
    if (rowCount > 1) {
      let address = 'A2:' + this.lastColumn + rowCount;
      let range = this.sheet.getRange(address);
      range.deleteCells(SpreadsheetApp.Dimension.ROWS);
    }
  }
  cloneSheet(sourceId, sourceSheetName, hackData) {
    let sourceWorkbook = SpreadsheetApp.openById(sourceId);
    let sourceSheet = sourceWorkbook.getSheetByName(sourceSheetName);
    let fullRange = sourceSheet.getDataRange();
    let rangeSpec = fullRange.getA1Notation();
    let sData = fullRange.getValues();
    this.sheet.clear({contentsOnly: true});
    if (hackData) {
      hackData(sData);
    }
    this.sheet.getRange(rangeSpec).setValues(sData);
    return this;
  }
  copyFrom(sourceSheetName, sourceRange) {
    let sourceSheet = SpreadsheetApp.getActive().getSheetByName(sourceSheetName);
    let fullRange = sourceSheet.getRange(sourceRange);
    let sData = fullRange.getValues();
    this.sheet.clear();
    this.sheet.getRange(sourceRange).setValues(sData);
  }
  getAllDataRows() {
    let rowCount = this.getRowCount();
    if (rowCount > 1) {
      let address = 'A2:' + this.lastColumn + rowCount;
      return this.sheet.getRange(address).getValues();
    }
    return [];
  }
}

class SheetRowIterator {
  constructor(sheet) {
    this.sheet = sheet;
    this.lastIndex = this.sheet.getRowCount();
    this.nextIndex = 2;
  }
  getNextRow() {
    if (this.nextIndex > this.lastIndex) {
      return null;
    }
    return this.sheet.getRowData(this.nextIndex++)[0];
  }
}
