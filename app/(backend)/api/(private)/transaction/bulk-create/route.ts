import prisma from "@/lib/db";
import { validateAccountOwnership, withErrorHandling } from "@/utils";
import { transactionSchema } from "@/utils/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type transactionSchema = z.input<typeof transactionSchema>;

interface ValidationError {
  status: false;
  transaction: transactionSchema;
  error: string;
}
interface ValidationSuccess {
  status: true;
  transaction: transactionSchema;
}
type ValidationResult = ValidationError | ValidationSuccess;

interface PrismaTransactionInput {
  account_id: string;
  amount: number;
  date: Date;
  category_id: string | null;
  payee: string;
  cheque_no: string | null;
  notes: string | null;
}

const bulkTransactionCreate = async (request: NextRequest) => {
  try {
    const sessionHeader = request.headers.get("x-user-session");
    if (!sessionHeader) {
      throw new Error("Invalid session");
    }

    const { userId } = JSON.parse(sessionHeader);
    const transactionArray = await request.json();

    if (!Array.isArray(transactionArray)) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid input: Expected an array of transactions",
        },
        { status: 400 }
      );
    }

    // First validate all transactions
    const validationResults: ValidationResult[] = await Promise.all(
      transactionArray.map(async (transaction): Promise<ValidationResult> => {
        try {
          // const transaction = transactionSchema.parse(transaction);

          if (
            !transaction.accountId ||
            !transaction.amount ||
            !transaction.date ||
            !transaction.payee
          ) {
            return {
              status: false,
              transaction,
              error: "Missing required fields",
            };
          }
          // Try to parse the date
          try {
            parseDateString(String(transaction.date));
          } catch (error) {
            return {
              status: false,
              transaction,
              error: "Invalid date format. Expected DD-MM-YYYY HH:mm:ss",
            };
          }
          const isOwner = await validateAccountOwnership(
            userId,
            transaction.accountId
          );
          if (!isOwner) {
            return {
              status: false,
              transaction,
              error: "Unauthorized: Account does not belong to user",
            };
          }

          return {
            status: true,
            transaction: transaction,
          };
        } catch (error) {
          return {
            status: false,
            transaction,
            error: error instanceof Error ? error.message : "Validation error",
          };
        }
      })
    );

    const failedValidations = validationResults.filter(
      (result): result is ValidationError => !result.status
    );

    if (failedValidations.length > 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Validation failed for some transactions",
          errors: failedValidations,
        },
        { status: 400 }
      );
    }

    // Get valid transactions
    const validTransactions = validationResults
      .filter((result): result is ValidationSuccess => result.status)
      .map((result) => result.transaction);

    // Check for duplicates within the current csv file
    const uniqueTransactions = new Map<string, transactionSchema>();
    validTransactions.forEach((transaction) => {
      let key: string;
      if (transaction.cheque_no) {
        // For transactions with cheque numbers
        key = `${transaction.accountId}-${transaction.cheque_no}`;
      } else {
        // For transactions without cheque numbers, create a composite key
        key = `${transaction.accountId}-${transaction.amount}-${transaction.date}`;
      }
      // Only keep the first occurrence
      if (!uniqueTransactions.has(key)) {
        uniqueTransactions.set(key, transaction);
      }
    });

    // Check for existing transactions in database
    const deduplicatedTransactions = await Promise.all(
      Array.from(uniqueTransactions.values()).map(async (transaction) => {
        const transactionDate = parseDateString(String(transaction.date));
        const existingTransaction = await prisma.transactions.findFirst({
          where: transaction.cheque_no
            ? {
                // For transactions with cheque numbers
                AND: [
                  { account_id: transaction.accountId },
                  { cheque_no: transaction.cheque_no },
                ],
              }
            : {
                // For transactions without cheque numbers
                AND: [
                  { account_id: transaction.accountId },
                  { amount: transaction.amount * 100 }, // Convert to paisa
                  { date: transactionDate },
                  { payee: transaction.payee },
                ],
              },
        });

        return existingTransaction ? null : transaction;
      })
    );

    // Filter out nulls (duplicates) and prepare for insertion
    const transactionsToCreate: PrismaTransactionInput[] =
      deduplicatedTransactions
        .filter((t): t is transactionSchema => t !== null)
        .map((transaction) => ({
          account_id: transaction.accountId,
          amount: transaction.amount * 100, // Convert to paisa
          date: parseDateString(String(transaction.date)),
          category_id: transaction.categoryId || null,
          payee: transaction.payee,
          cheque_no: transaction.cheque_no || null,
          notes: transaction.notes || null,
        }));

    const skippedDuplicates =
      validTransactions.length - transactionsToCreate.length;

    if (transactionsToCreate.length === 0) {
      return NextResponse.json({
        status: true,
        message: "All transactions were duplicates",
        count: 0,
        skippedDuplicates,
      });
    }

    // Bulk create non-duplicate transactions
    const result = await prisma.transactions.createMany({
      data: transactionsToCreate,
    });

    return NextResponse.json({
      status: true,
      message: "Transactions created successfully",
      count: result.count,
      skippedDuplicates,
    });
  } catch (error) {
    console.error("Bulk transaction creation error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error while creating transactions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
export const POST = withErrorHandling(bulkTransactionCreate);

// Helper function to parse date string in "DD-MM-YYYY HH:mm:ss" format
const parseDateString = (dateString: string): Date => {
  try {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split(" ");

    // Only proceed if we have both date and time parts
    if (!datePart || !timePart) {
      throw new Error("Missing date or time part");
    }

    // Parse date components
    const [day, month, year] = datePart
      .split("-")
      .map((num) => parseInt(num, 10));

    // Parse time components
    const [hours, minutes, seconds] = timePart
      .split(":")
      .map((num) => parseInt(num, 10));

    // Validate all components are numbers
    if ([day, month, year, hours, minutes, seconds].some(isNaN)) {
      throw new Error("Invalid number in date components");
    }

    // Validate ranges
    if (month < 1 || month > 12) throw new Error("Invalid month");
    if (day < 1 || day > 31) throw new Error("Invalid day");
    if (hours < 0 || hours > 23) throw new Error("Invalid hours");
    if (minutes < 0 || minutes > 59) throw new Error("Invalid minutes");
    if (seconds < 0 || seconds > 59) throw new Error("Invalid seconds");

    // Create date object (month is 0-based in JavaScript)
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    // Verify the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  } catch (error: any) {
    throw new Error(
      `Invalid date format: ${dateString}. Expected format: DD-MM-YYYY HH:mm:ss. Error: ${error.message}`
    );
  }
};
