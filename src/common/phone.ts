export const phoneChecker = (phone: string) => {
  const operators = [
    '90',
    '91',
    '93',
    '94',
    '95',
    '97',
    '98',
    '99',
    '20',
    '33',
    '50',
    '77',
    '88',
  ];

  if (!operators.includes(phone.slice(0, 2)) || phone.length !== 9) {
    return false;
  }
  return true;
};
