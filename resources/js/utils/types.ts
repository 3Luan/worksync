export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};
