// Helpers for deciding whether a transaction affects an account's balance.
//
// The account balance is a snapshot taken at `balance_date`. A transaction
// should adjust it only when it belongs to the snapshot day or later. Manual
// transactions are stored with a date but no meaningful time (they default to
// the start of the picked day), so we compare at DAY granularity — otherwise a
// transaction dated "today" (00:00) would look older than a balance edited
// later the same day and get skipped.
//
// Dates are handled in IST, matching how the rest of the app stores/parses
// transaction dates.

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Start of the IST calendar day for the given instant, as a real UTC Date.
export const startOfIstDay = (date: Date): Date => {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const istMidnightUtc = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate()
  );
  return new Date(istMidnightUtc - IST_OFFSET_MS);
};

// True when a transaction dated `txnDate` should be applied to a balance whose
// snapshot was taken at `balanceDate` (i.e. same IST day or later).
export const affectsBalance = (txnDate: Date, balanceDate: Date): boolean =>
  txnDate.getTime() >= startOfIstDay(balanceDate).getTime();
