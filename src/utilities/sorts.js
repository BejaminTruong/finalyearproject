import _ from "lodash";

export const mapOrder = (array, order, key) => {
  if ((!array || !order || !key)) return [];
  const newArr = _.cloneDeep(array);
  newArr.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]));
  return newArr;
};
