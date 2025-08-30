import type { Password } from "@/types/password";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const ShowPasswords = ({ passwords }: { passwords: Password }) => {
  const handlePrint = () => {
    const rows = Object.entries(passwords)
      .filter(
        ([key, value]) =>
          value &&
          key !== "id" &&
          key !== "created_at" &&
          key !== "is_used" &&
          key !== "user_id" &&
          key !== "number" &&
          key !== "type"
      )
      .map(([key, value]) => {
        const label =
          key === "username"
            ? "المستخدم"
            : key === "bios"
            ? "البيوس"
            : key === "ice"
            ? "التجميد"
            : key === "system"
            ? "النظام"
            : key === "file"
            ? "الملف بالانكليزي"
            : key === "file_arabic"
            ? "الملف بالعربي"
            : "القفل";

        return `
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <p><strong>${label}:</strong></p>
            <p>${value}</p>
          </div>
        `;
      })
      .join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html lang="ar" dir="rtl">
          <head>
            <title>طباعة كلمات السر</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              p { margin: 0; }
            </style>
          </head>
          <body>
            <h2 style="text-align:center;">كلمات المرور</h2>
            ${rows}
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>كلمات المرور</DialogTitle>
      </DialogHeader>
      {Object.entries(passwords).map(([key, value]) =>
        value &&
        key != "id" &&
        key != "created_at" &&
        key != "is_used" &&
        key != "user_id" &&
        key != "number" &&
        key != "type" ? (
          <div key={key} className="w-full flex justify-between">
            <p>
              {key == "username"
                ? "المستخدم"
                : key == "bios"
                ? "البيوس"
                : key == "ice"
                ? "التجميد"
                : key == "system"
                ? "النظام"
                : key == "file"
                ? "الملف بالانكليزي"
                : key == "file_arabic"
                ? "الملف بالعربي"
                : "القفل"}
              :
            </p>
            <p>{value}</p>
          </div>
        ) : null
      )}
      <DialogFooter>
        <Button onClick={handlePrint}>طباعة</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ShowPasswords;
