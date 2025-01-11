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
    "Category",
    "Amount",
    "Payee",
    "Notes",
    "Cheque",
  ];

  const parseCSV = (content: string) => {
    const lines = content.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const rows = lines
      .slice(1)
      .map((line) => line.split(",").map((cell) => cell.trim()));
    return { headers, rows: rows.slice(0, 5) }; // Show first 5 rows for preview
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

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      // Simulate upload with mappings
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Column mappings:", columnMappings);
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
        <DialogHeader className="flex-row justify-end">
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
              <SelectTrigger className="min-w-[150px]">
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
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full h-full">
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
                            <SelectTrigger className="w-full">
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
                  {csvData.rows.map((row, i) => (
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
            <div className="flex justify-between">
              <p className="italic text-sm ">**Showing first 5 rows**</p>
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
