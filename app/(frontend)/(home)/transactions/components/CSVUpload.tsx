import React, { useCallback, useState } from "react";
import { Cloud, File, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountStore } from "@/hooks/useAccountsHook";

interface CSVUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ open, onOpenChange }) => {
  const { error, accounts, currentAccount, setCurrentAccount } =
    useAccountStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvData, setCSVData] = useState<{
    headers: string[];
    rows: string[][];
  }>({ headers: [], rows: [] });
  const [showMapper, setShowMapper] = useState(false);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {}
  );

  // Available fields to map to
  const availableFields = [
    "Date",
    "Amount",
    "Payee",
    "Notes",
    "Cheque No.",
    "Debit",
    "Credit",
  ];

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile?.type === "text/csv") {
      setFile(selectedFile);
      const content = await selectedFile.text();
      const parsed = parseCSV(content);
      setCSVData(parsed);
      setShowMapper(true);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleColumnMap = (csvColumn: string, mappedField: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [csvColumn]: mappedField,
    }));
    console.log("columnMappings:", columnMappings);
    console.log("CSVData:", csvData);
  };

  //upload logic
  interface TransactionData {
    accountId: string;
    transactions: {
      amount: number;
      date: string;
      payee: string;
      notes: string;
      chequeNo?: string;
    }[];
  }

  const transformCSVToTransactions = (
    csvData: { headers: string[]; rows: string[][] },
    accountId: string
  ): TransactionData => {
    // Skip the header row (index 0) and start from actual data (index 1)
    const transactions = csvData.rows.slice(1).map((row) => {
      // Create an object from the row data
      const rowData = csvData.headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {} as Record<string, string>);

      // Parse the date (assuming format "DD-MM-YYYY HH:mm:ss")
      const dateString = rowData["Txn Date"].split(" ")[0]; // Get just the date part
      const [day, month, year] = dateString.split("-");
      const formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD

      // Calculate amount (positive for Credit, negative for Debit)
      let amount = 0;
      if (rowData["Credit"]) {
        amount = parseFloat(rowData["Credit"].replace(/,/g, ""));
      } else if (rowData["Debit"]) {
        amount = -parseFloat(rowData["Debit"].replace(/,/g, ""));
      }

      // Extract payee from Description
      // Assuming UPI format: UPI/DR|CR/{id}/{payee name}/{bank}/**{other details}
      let payee = "Unknown";
      const description = rowData["Description"];
      if (description.startsWith("UPI")) {
        const parts = description.split("/");
        if (parts.length >= 4) {
          payee = parts[3];
        }
      } else if (description.startsWith("NEFT")) {
        // Handle NEFT format
        const parts = description.split("-");
        if (parts.length >= 4) {
          payee = parts[3];
        }
      }

      return {
        amount: amount,
        date: formattedDate,
        payee: payee,
        notes: rowData["Description"],
        ...(rowData["Cheque No."] && { chequeNo: rowData["Cheque No."] }),
      };
    });

    return {
      accountId,
      transactions: transactions.filter((t) => t.amount !== 0), // Remove any transactions with 0 amount
    };
  };
  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      await new Promise((resolve) => {
        setTimeout(() => {
          transformCSVToTransactions(csvData, currentAccount?.id || "");
          resolve("");
        }, 2000);
      });
      console.log("data:", csvData);
      onOpenChange(false);
      setShowMapper(false);
    } finally {
      setLoading(false);
      setFile(null);
      setCSVData({ headers: [], rows: [] });
      setColumnMappings({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          showMapper ? "max-w-4xl h-screen sm:h-[85vh]" : "sm:max-w-[425px]"
        } `}
      >
        <DialogHeader
          className={`flex-row ${showMapper ? "justify-between" : ""}`}
        >
          <div>
            <DialogTitle>
              {showMapper ? "Map CSV Columns" : "Upload CSV"}
            </DialogTitle>
            <DialogDescription>
              {showMapper
                ? "Map your CSV columns to the corresponding fields in the system"
                : "Upload your CSV file to import transactions"}
            </DialogDescription>
          </div>
          {showMapper && (
            <Select
              disabled={!!error}
              value={currentAccount?.id || ""}
              onValueChange={(value: any) => {
                const selectedAccount = accounts.find(
                  (acc) => acc.id === value
                );
                if (selectedAccount) {
                  setCurrentAccount(selectedAccount);
                }
              }}
            >
              <SelectTrigger className="max-w-[150px]">
                {currentAccount ? currentAccount.name : "Select an account"}
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </DialogHeader>

        {!showMapper ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="grid gap-4"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    {file ? (
                      <>
                        <File className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <Cloud className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV files only</p>
                      </>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="overflow-auto border rounded-lg h-[480px] max-w-3/4">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 dark:text-gray-50">
                  <tr>
                    {csvData.headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-2 text-left text-sm font-medium text-gray-500"
                      >
                        <div className="space-y-1">
                          <Select
                            value={columnMappings[header] || ""}
                            onValueChange={(value) =>
                              handleColumnMap(header, value)
                            }
                          >
                            <SelectTrigger className="w-[150px] dark:border-gray-700">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFields.map((field) => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs font-normal">{header}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.rows.slice(1).map((row, i) => (
                    <tr key={i} className="border-t">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMapper(false);
                    setFile(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!file || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Confirm & Upload"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVUpload;

//utils
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        cell += '"';
        i++;
      } else {
        // Toggle quotes state
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      // End of cell
      result.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }

  // Add the last cell
  result.push(cell.trim());
  return result;
};

const parseCSV = (content: string) => {
  // Split into lines, handling potential \r\n
  const lines = content.split(/\r?\n/).filter((line) => line.trim());

  // Parse headers
  const headers = parseCSVLine(lines[0]);

  // Parse rows (first 5 for preview)
  const rows = lines.map((line) => {
    const cells = parseCSVLine(line);
    // Ensure we have the same number of cells as headers
    while (cells.length < headers.length) cells.push("");
    return cells;
  });

  return { headers, rows };
};
