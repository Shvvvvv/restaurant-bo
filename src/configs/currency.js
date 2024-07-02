const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const currencyFormat = (currency) => {
  return formatter.format(currency);
};
