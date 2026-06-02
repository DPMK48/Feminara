const NON_DIGIT = /[^\d+]/g;

export const normalizePhone = (value: string) => value.trim().replace(NON_DIGIT, '');
