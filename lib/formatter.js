import { size } from "zod";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  return currencyFormatter.format(amount);
};

const numberFormatter = new Intl.NumberFormat("en-US");

export const formatNumber = (number) => {
  return numberFormatter.format(number);
};

export const sizeFormatter = (fileSize) => {
  let size;
  if (fileSize < 1000) {
    size = fileSize + " bytes";
  } else if (fileSize >= 1000 && fileSize < 1000000) {
    size = parseInt(fileSize / 1000) + " kilobytes";
  } else {
    size = parseInt(fileSize / 1000000) + " megabytes";
  }

  return size;
};
