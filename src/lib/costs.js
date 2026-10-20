import { site } from "@/data/site";

/** What a tenant pays up front to move in. */
export function moveInCosts(rent, depositMonths = site.fees.defaultDepositMonths) {
  const deposit = rent * depositMonths;
  const agencyFee = rent * site.fees.agencyFeeMonths;
  return {
    firstMonth: rent,
    deposit,
    agencyFee,
    total: rent + deposit + agencyFee,
  };
}

export const agencyFeeLabel =
  site.fees.agencyFeeMonths === 0.5
    ? "half a month's rent"
    : `${site.fees.agencyFeeMonths} month${site.fees.agencyFeeMonths === 1 ? "" : "s"}' rent`;
