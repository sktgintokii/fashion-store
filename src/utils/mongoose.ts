import _ from 'lodash';

export const getRangeQuery = <T>(
  key: string,
  options: {
    lte?: T;
    gte?: T;
    lt?: T;
    gt?: T;
  },
) => {
  const condition = _.omitBy(
    {
      $lte: options.lte,
      $gte: options.gte,
      $lt: options.lt,
      $gt: options.gt,
    },
    _.isNil,
  );
  return _.isEmpty(condition) ? {} : { [key]: condition };
};
