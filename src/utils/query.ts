import moment from 'moment';

export const parseDate = (value: unknown) => {
  const str = String(value);
  const isDate = moment(str).isValid();

  return isDate ? new Date(str) : undefined;
};

export const parseInteger = (value: unknown) => {
  const str = String(value);
  const int = parseInt(str, 10);

  return !isNaN(int) && String(int) === str ? int : NaN;
};
