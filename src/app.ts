import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import helmet from 'helmet';
import indexRouter from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(((err, req, res, next) => {
  res.status(err.status || 500).send('Internal Server Error');
}) as ErrorRequestHandler);

export default app;
