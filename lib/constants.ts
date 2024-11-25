export const navbarItems = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

export const currencies = [
  { value: "INR", label: "₹ Rupees", locale: "en-IN" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "en-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof currencies)[0];

export const MAX_DATE_RANGE_DAYS = 90;
