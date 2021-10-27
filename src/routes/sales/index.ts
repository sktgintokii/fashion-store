import express from 'express';
import _ from 'lodash';
import env from '../../env';
import multerCsvStream from '../../middlewares/multerCsvStream';
import logger from '../../services/logger';
import mongoose, { models } from '../../services/mongoose';
import { Sale } from '../../services/mongoose/schemas/Sale';
import { wrapAsyncHandler } from '../../utils/middleware';
import { getRangeQuery } from '../../utils/mongoose';
import { parseDate, parseInteger } from '../../utils/query';

const salesRouter = express.Router();
const { maxBatchSize, maxPageSize } = env.mongo;

salesRouter.post(
  '/record',
  wrapAsyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    const { Sale: SaleModel } = models;

    let batch: Sale[] = [];
    let rowCount = 0;
    let processedCount = 0;

    const flush = async () => {
      logger.debug(`flush count = ${batch.length}`);

      const writes = batch.map(document => ({ insertOne: { document } }));
      processedCount += batch.length;
      await SaleModel.bulkWrite(writes, { session });
      batch = [];
    };

    multerCsvStream({
      csvOptions: {
        columns: true,
        skip_empty_lines: true,
      },
      onData: async (rowData: any, callback) => {
        rowCount += 1;

        const sale = new SaleModel({
          userName: rowData.USER_NAME,
          age: _.toInteger(rowData.AGE),
          height: _.toInteger(rowData.HEIGHT),
          gender: _.toUpper(rowData.GENDER),
          saleAmount: _.toInteger(rowData.SALE_AMOUNT),
          lastPurchaseDate: new Date(rowData.LAST_PURCHASE_DATE),
        });

        logger.debug(`Process index = ${rowCount}`);
        const error = sale.validateSync();

        if (error) {
          batch = [];
          callback(error);
        } else {
          batch = [...batch, sale];

          if (batch.length >= maxBatchSize) {
            try {
              await flush();
            } catch (bulkWriteError) {
              callback(bulkWriteError);
            }
          }
        }
      },
      onEnd: async () => {
        await flush();
      },
    })(req, res, err => {
      if (err) {
        logger.error(err);
        session.abortTransaction();
        res.status(400).send({
          error: err,
        });
      } else {
        session.endSession();
        res.json({
          processedCount,
        });
      }
    });
  }),
);

salesRouter.get(
  '/report',
  wrapAsyncHandler(async (req, res) => {
    const { Sale: SaleModel } = models;
    const fromDate = parseDate(req.query.formDate);
    const toDate = parseDate(req.query.toDate);
    const skip = parseInteger(req.query.skip) || 0;
    const limit = Math.min(
      parseInteger(req.query.limit) || maxPageSize,
      maxPageSize,
    );

    const sales = await SaleModel.find(
      getRangeQuery('lastPurchaseDate', { lte: fromDate, gte: toDate }),
    )
      .limit(limit)
      .skip(skip);

    res.send({
      limit,
      skip,
      count: sales.length,
      results: sales,
    });
  }),
);

export default salesRouter;
