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
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/hooks/useCategoryHook";
import { Input } from "@/components/ui/input";
import { transactionSchema } from "@/utils/schema";
import { axiosService } from "@/services";
import { toast } from "sonner";

import { z } from "zod";
type transaction = z.input<typeof transactionSchema>;

interface CSVUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ open, onOpenChange }) => {
  const { error, accounts, currentAccount, setCurrentAccount } =
    useAccountStore();
  const { Categories } = useCategoryStore();
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
  const [rowCategories, setRowCategories] = useState<{ [key: string]: string }>(
    {}
  );
  const [rowPayees, setRowPayees] = useState<{ [key: string]: string }>({});

  // Available fields to map to
  const availableFields = {
    date: "Date",
    amount: "Amount",
    payee: "Payee",
    notes: "Notes",
    cheque_no: "Cheque No.",
    debit: "Debit",
    credit: "Credit",
  };

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
  };
  const handleCategoryChange = (rowIndex: number, value: string) => {
    setRowCategories((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handlePayeeChange = (rowIndex: number, value: string) => {
    setRowPayees((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const payload = prepareDataForPayload();
      const response = await axiosService.createBulkTransaction(payload);
      const { status, message } = response ?? {};
      if (!status) throw new Error(message ?? "Error while Bulk Upload");
      toast.success("Uploaded");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.error(error);
    } finally {
      setShowMapper(false);
      setLoading(false);
      setFile(null);
      setCSVData({ headers: [], rows: [] });
      setColumnMappings({});
      setRowCategories({});
      setRowPayees({});
    }
  };

  const prepareDataForPayload = (): transaction[] => {
    /* accountId,amount,categoryId,cheque_no,date,notes,payee */
    const { headers, rows } = csvData;
    const transactions: transaction[] = [];
    rows.slice(1).forEach((trans, ind) => {
      const obj: any = {};
      headers.forEach((h, i) => {
        if (!columnMappings[h] || !trans[i]) return;

        let key = columnMappings[h];
        let value: string | number = trans[i];
        if (key == "debit" || key == "credit") {
          value =
            parseFloat(value.split(",").join("")) * (key == "debit" ? -1 : 1);
          key = "amount";
        }
        obj[key] = value;
      });
      obj["accountId"] = currentAccount?.id;
      if (rowCategories[ind]) obj["categoryId"] = rowCategories[ind];
      obj["payee"] =
        rowPayees[ind] ??
        extractNoteOrName(
          trans[headers.findIndex((header) => header === "Description")]
        );

      transactions.push(obj);
    });
    return transactions;
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
                  <SelectItem key={account.id} value={account.id ?? ""}>
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
                            value={columnMappings[header] || "unselect"}
                            onValueChange={(value) =>
                              handleColumnMap(header, value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-[180px]",
                                columnMappings[header] &&
                                  columnMappings[header] !== "unselect"
                                  ? "border-green-500 ring-1 ring-green-500/20"
                                  : "hover:border-gray-400"
                              )}
                            >
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unselect">
                                -- Unselect --
                              </SelectItem>
                              {Object.entries(availableFields).map(
                                ([key, value]) => {
                                  const selectedFields =
                                    Object.values(columnMappings);
                                  const isSelected =
                                    selectedFields.includes(key);
                                  const isCurrentField =
                                    columnMappings[header] === key;

                                  if (!isSelected || isCurrentField) {
                                    return (
                                      <SelectItem key={key} value={key}>
                                        {value}
                                      </SelectItem>
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </SelectContent>
                          </Select>
                          <p className="text-xs font-normal">{header}</p>
                        </div>
                      </th>
                    ))}
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 "
                      key={"category"}
                    >
                      <p className="text-xs font-normal w-[150px]">Category</p>
                    </th>
                    <th
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500"
                      key={"payee"}
                    >
                      <p className="text-xs font-normal w-[150px]">Payee</p>
                    </th>
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
                      <td className="px-4 py-2 text-sm">
                        <Select
                          value={rowCategories[i] || "unselect"}
                          onValueChange={(value) =>
                            handleCategoryChange(i, value)
                          }
                        >
                          <SelectTrigger className={cn("w-[180px]")}>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unselect">
                              -- Select Category --
                            </SelectItem>
                            {Categories.map(({ name, id }) => {
                              return (
                                <SelectItem key={id} value={id}>
                                  {name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Input
                          className="w-[180px]"
                          placeholder="Enter payee"
                          value={
                            rowPayees[i] || extractNoteOrName(row[3]) || ""
                          }
                          onChange={(e) => handlePayeeChange(i, e.target.value)}
                        />
                      </td>
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
function extractNoteOrName(input: string): string {
  const cleanstring = input.replace(/\s+/g, " ").trim();
  if (cleanstring.startsWith("UPI")) {
    const parts = cleanstring.split("/");
    if (parts.length < 4) {
      return "";
    }

    let message = "";
    if (parts[6]) {
      message = parts[6].split("//")[0];
    }
    return message.length ? message : parts[3];
  } else if (cleanstring.startsWith("NEFT")) {
    const parts = cleanstring.split("-");
    return parts?.slice(3)?.join("-") ?? "";
  }
  return "UNKNOWN";
}
