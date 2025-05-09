import userAxiosInstance from "@/config/UserAxiosInstence";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SuccessToast } from "@/components/shared/Toast";


// Customer Form Schema
const customerSchema = z.object({
  phone: z
    .string()
    .min(10, "phone number need 10 digits")
    .max(10, "phone number need 10 digits"),
  dob: z
    .string()
    .min(1, "Date of Birth is required")
    .refine((dob) => {
      const dobDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      const dayDiff = today.getDate() - dobDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, "You must be at least 18 years old"),
  job: z.string().min(3, "Job title is required"),
  income: z.coerce
    .number()
    .positive("Income must be a positive number")
    .or(z.literal("")),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),
  aadhaarNumber: z.string().min(12, "Aadhaar must be 12 digits").max(12),
  panNumber: z.string().min(10, "PAN must be 10 characters").max(10),
  cibilScore: z.coerce
    .number()
    .min(300, "CIBIL Score must be 300-900")
    .max(900)
    .or(z.literal("")),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export function CustomerFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [cibilFile, setCibilFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileErrors, setFileErrors] = useState<{
    aadhaar: string | null;
    pan: string | null;
    cibil: string | null;
  }>({
    aadhaar: null,
    pan: null,
    cibil: null,
  });

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      phone: "",
      dob: "",
      job: "",
      income: "",
      gender: "male" as "male" | "female" | "other",
      aadhaarNumber: "",
      panNumber: "",
      cibilScore: "",
    },
  });

  const validateImageFile = (file: File | null): boolean => {
    if (!file) return false;
    return file.type.startsWith("image/");
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    fileType: "aadhaar" | "pan" | "cibil"
  ) => {
    setFileErrors((prev) => ({ ...prev, [fileType]: null }));
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (!validateImageFile(selectedFile)) {
        setFileErrors((prev) => ({
          ...prev,
          [fileType]: "Only image files are allowed (jpg, png, etc.)",
        }));
        event.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    const aadhaarValid = validateImageFile(aadhaarFile);
    const panValid = validateImageFile(panFile);
    const cibilValid = validateImageFile(cibilFile);

    setFileErrors({
      aadhaar: aadhaarValid ? null : "image file required",
      pan: panValid ? null : "image file required",
      cibil: cibilValid ? null : "image file required",
    });

    if (aadhaarValid && panValid && cibilValid) {
      const formData = new FormData();
      formData.append("phone", data.phone);
      formData.append("dob", data.dob);
      formData.append("job", data.job);
      formData.append("income", String(data.income));
      formData.append("gender", data.gender);
      formData.append("aadhaarNumber", data.aadhaarNumber);
      formData.append("panNumber", data.panNumber);
      formData.append("cibilScore", String(data.cibilScore));
      if (aadhaarFile) formData.append("aadhaarDoc", aadhaarFile);
      if (panFile) formData.append("panDoc", panFile);
      if (cibilFile) formData.append("cibilDoc", cibilFile);

      try {
        const response = await userAxiosInstance.post(
          "/complete-profile",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        SuccessToast("successfully updated");
        if (response.data.success) {
          navigate("/dashboard/profile", { state: { updated: true } });
          onClose(); // Close modal on success
        }
      } catch (error) {
        console.log(error);
      }
      setIsSubmitted(true);
    }
  };

  const renderFileUpload = (
    labelText: string,
    fileId: string,
    file: File | null,
    errorMsg: string | null,
    fileType: "aadhaar" | "pan" | "cibil"
  ) => {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <FormLabel className="block mb-2">{labelText}</FormLabel>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className={`w-full h-10 px-3 ${
                errorMsg
                  ? "text-red-600 border-red-200 hover:bg-red-50"
                  : "text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              }`}
              onClick={() => document.getElementById(fileId)?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {file ? file.name : "Choose File"}
            </Button>
            <input
              id={fileId}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(
                  e,
                  fileType === "aadhaar"
                    ? setAadhaarFile
                    : fileType === "pan"
                    ? setPanFile
                    : setCibilFile,
                  fileType
                )
              }
            />
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}
          {file && !errorMsg && (
            <div className="mt-2">
              <div className="text-xs text-gray-500">Preview:</div>
              <div
                className="mt-1 border rounded overflow-hidden"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-teal-50 border-b border-teal-100">
          <DialogTitle className="text-2xl font-bold text-teal-700 text-center">
            Customer Information
          </DialogTitle>
        </DialogHeader>
        {isSubmitted && (
          <Alert className="mb-6 bg-teal-50 border-teal-200">
            <Check className="h-4 w-4 text-teal-600" />
            <AlertDescription className="text-teal-700">
              Form submitted successfully!
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income (Yearly)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter yearly income"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12-digit Aadhaar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="10-character PAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cibilScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIBIL Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Score between 300-900"
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? undefined : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              {renderFileUpload(
                "Upload Aadhaar",
                "aadhaarFile",
                aadhaarFile,
                fileErrors.aadhaar,
                "aadhaar"
              )}
              {renderFileUpload(
                "Upload PAN",
                "panFile",
                panFile,
                fileErrors.pan,
                "pan"
              )}
              {renderFileUpload(
                "Upload CIBIL Report",
                "cibilFile",
                cibilFile,
                fileErrors.cibil,
                "cibil"
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
