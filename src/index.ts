import * as fs from 'fs';
import { ParserRow, write } from 'fast-csv';
import {
  DIALOGUE_COLUMN_INDEX,
  IN_COLUMN_INDEX,
  OUT_COLUMN_INDEX,
  ROW_ELEMENTS_SEPARATOR,
  ROW_SEPARATOR,
} from './const';
import {
  DIALOGUE_COLUMN_HEADER,
  IN_COLUMN_HEADER,
  OUT_COLUMN_HEADER,
  SOURCE_COLUMN_HEADER,
  SOURCE_COLUMN_ITEM,
} from './columnsText';

const getRowsAsText = (textFromFile: string) => {
  return textFromFile.split(ROW_SEPARATOR);
};

const getDataForCsv = (textFromFile: string) => {
  const rowsAsText = getRowsAsText(textFromFile);
  return rowsAsText.map((rowText) => {
    const rowElements = rowText.split(ROW_ELEMENTS_SEPARATOR);
    return {
      [IN_COLUMN_HEADER]: rowElements[IN_COLUMN_INDEX],
      [OUT_COLUMN_HEADER]: rowElements[OUT_COLUMN_INDEX],
      [SOURCE_COLUMN_HEADER]: SOURCE_COLUMN_ITEM,
      [DIALOGUE_COLUMN_HEADER]: rowElements[DIALOGUE_COLUMN_INDEX],
    };
  });
};

const writeDataToCsv = (dataForCsv: ParserRow[]) => {
  const writeStream = fs.createWriteStream('out.csv', { encoding: 'utf8' });

  write(dataForCsv, { headers: true })
    .pipe(writeStream)
    .on('end', () => console.log('Done writing CSV file'));
};

const parseTxtFileIntoCsv = () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('ERROR: No file path provided');
    process.exit(1);
  }

  fs.readFile(filePath, 'utf8', (error, textFromFile) => {
    if (error) {
      console.error('Error reading file:', error);
      process.exit(1);
    }

    console.log('Reading text from file: \n', textFromFile);

    const dataForCsv: ParserRow[] = getDataForCsv(textFromFile);
    writeDataToCsv(dataForCsv);
  });
};

parseTxtFileIntoCsv();
