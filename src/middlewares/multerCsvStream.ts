import { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import CsvParse from 'csv-parse';

export const Defaults = {
  FIELD_NAME: 'file',
};

type Callback = (error?: unknown) => void;
type OnData = (rowData: unknown, callback: Callback) => Promise<void>;
type OnEnd = () => void | Promise<void>;

type MulterCsvStreamOptions = {
  fieldName?: string;
  csvOptions?: CsvParse.Options;
  onData: OnData;
  onEnd: OnEnd;
};

class MulterCsvStream implements StorageEngine {
  private csvParseOptions: CsvParse.Options;
  private onData: OnData;
  private onEnd: OnEnd;

  constructor(options: MulterCsvStreamOptions) {
    this.csvParseOptions = options.csvOptions || {};
    this.onData = options.onData;
    this.onEnd = options.onEnd;
  }

  _handleFile(req: Request, file: Express.Multer.File, callback: Callback) {
    const readable = CsvParse(this.csvParseOptions);
    file.stream
      .pipe(readable)
      .on('data', async rowData => {
        readable.pause();
        await this.onData(rowData, callback);
        readable.resume();
      })
      .on('end', async () => {
        await this.onEnd();
        callback();
      });
  }

  _removeFile() {
    return;
  }
}

const multerCsvStream = (options: MulterCsvStreamOptions) => {
  const storage = new MulterCsvStream(options);
  const middleware = multer({ storage }).single(
    options.fieldName || Defaults.FIELD_NAME,
  );

  return middleware;
};

export default multerCsvStream;
