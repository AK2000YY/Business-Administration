import CheckFormAdd from "@/components/CheckFormAdd";
import DeleteOrEdit from "@/components/DeleteOrEdit";
import FromServiceAdd from "@/components/FormServiceAdd";
import FormServiceEdit from "@/components/FormServiceEdit";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/supabase";
import { getUserId } from "@/lib/utils";
import type { CheckService } from "@/types/check_service";
import type { Service } from "@/types/service";
import {
  BadgeCheck,
  Download,
  Pencil,
  Plus,
  Printer,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ServicesAdministrate = () => {
  const { id } = useParams();

  const [search, setSearch] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [end, setEnd] = useState<number>(14);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getServices = async () => {
      setLoad(true);
      const { data, error } = await supabase
        .from("services")
        .select("*, check_service(*), jobs(*,device_types(*))")
        .eq("job_id", id)
        .range(end - 14, end);
      console.log(data);
      console.log(error);
      if (error) toast.error("حدث خطأ ما!");
      else {
        setServices(data ?? []);
        setLoad(false);
      }
    };

    const services = supabase
      .channel("services-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        async ({ eventType, old, new: newData }) => {
          switch (eventType) {
            case "INSERT": {
              const { data } = await supabase
                .from("services")
                .select("*")
                .eq("job_id", id)
                .eq("id", newData.id)
                .single();
              setServices((prev) => {
                if (data && prev.length < 15) return [...prev, data];
                else return prev;
              });
              break;
            }
            case "UPDATE": {
              const { data } = await supabase
                .from("services")
                .select("*, check_service(*)")
                .eq("job_id", id)
                .eq("id", newData.id)
                .single();
              console.log(data);
              if (data) {
                setServices((prev) =>
                  prev.map((service) =>
                    service.id === data.id ? data : service
                  )
                );
              }
              break;
            }
            case "DELETE": {
              const service: Service = old as Service;
              setServices((prev) => prev.filter((ele) => ele.id != service.id));
            }
          }
        }
      )
      .subscribe();

    const checks = supabase
      .channel("checks-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "check_service" },
        async ({ eventType, old, new: newData }) => {
          switch (eventType) {
            case "INSERT": {
              const data: CheckService = newData as CheckService;
              setServices((prev) =>
                prev.map((ele) =>
                  ele.id == data.service_id
                    ? { ...ele, check_service: data }
                    : ele
                )
              );
              break;
            }
            case "UPDATE": {
              const data: CheckService = newData as CheckService;
              setServices((prev) =>
                prev.map((ele) =>
                  ele.id == data.service_id
                    ? { ...ele, check_service: data }
                    : ele
                )
              );
              break;
            }
            case "DELETE": {
              const data: CheckService = old as CheckService;
              setServices((prev) =>
                prev.map((ele) => {
                  if (ele.check_service && ele.check_service.id == data.id) {
                    const { check_service, ...rest } = ele;
                    return rest;
                  }
                  return ele;
                })
              );
            }
          }
        }
      )
      .subscribe();

    getServices();
    getUserId((id) => {
      setUserId(id);
    });
    return () => {
      services.unsubscribe();
      checks.unsubscribe();
    };
  }, [end]);

  const handlePrint = (service: Service) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html lang="ar" dir="rtl">
          <head>
            <style>
            * {
              padding: 0;
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              box-sizing: border-box;
            }
            body {
              font-family: sans-serif;
              padding: 20px;
            }
            p {
              margin: 0;
            }
            header {
              height: 10%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .title-log {
              display: flex;
              flex-direction: column;
            }

            .arc-h {
              width: 100%;
              height: fit-content;
              padding: 2px 6px;
              margin-top: 4px;
              background: rgb(192, 192, 192);
            }
            table {
              width: 100%;
              border-spacing: -1px;
            }
            th {
              width: 25%;
              background-color: lightblue;
              border: 2px solid black;
              padding: 0;
              margin: 0;
            }
            td {
              height: 30px;
              border: 2px solid black;
              text-align: center;
            }
            .tas-h {
              width: 100%;
              height: fit-content;
              padding: 2px 6px;
              background-color: lightcoral;
            }
            .tas-s {
              width: 100%;
              height: 80px;
              border: 2px solid black;
              padding: 4px;
            }
            .h-s {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 4px 0px;
            }
            .h-s div {
              height: 80px;
              border: 2px solid black;
              padding: 4px;
              text-align: center;
            }
            .m-t {
              margin-top: 5px;
            }
            .wo {
              background-color: silver;
            }
          </style>
          </head>
          <body>
            <header>
              <div class="title-log">
                <p>الإدارة العامة</p>
                <p>القسم التقني</p>
              </div>
              <p>استمارة جهاز الحاسوب</p>
              <p>رقم وصل الاستلام: ......</p>
            </header>
            <hr />
            <div>
              <header class="arc-h">الأرشيف</header>
              <table>
                <thead>
                  <tr>
                    <th>الرقم التسلسلي</th>
                    <th>الجهة</th>
                    <th>نوع الجهاز</th>
                    <th>اسم الأخ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${service.jobs.serial}</td>
                    <td>${service.jobs.entity ?? ""}</td>
                    <td>${service.jobs.device_types.type}</td>
                    <td>${service.worker ?? ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <header class="tas-h">المهام</header>
              <div class="tas-s">${service.requirements ?? ""}</div>
            </div>
            <div class="h-s">
              <p>يوم وتاريخ الاستلام: ....................</p>
              <div>
                الأرشيف والديوان <br />
                اسم وتوقيع الأخ
              </div>
            </div>
            <div class="m-t">
              <header class="tas-h wo">العمل</header>
              <div class="tas-s"></div>
            </div>
            <div class="h-s">
              <p>يوم وتاريخ الانتهاء من العمل: ....................</p>
              <div>
                المسؤول عن العمل <br />
                اسم وتوقيع الأخ
              </div>
            </div>
            <div class="m-t">
              <header class="tas-h wo">التدقيق</header>
              <div class="tas-s"></div>
            </div>
            <div class="h-s">
              <p>يوم وتاريخ الانتهاء من التدقيق: ....................</p>
              <div>
                المسؤول عن التدقيق <br />
                اسم وتوقيع الأخ
              </div>
            </div>
            <script>
              window.print();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }

    //file  uploade
    const fileInput = form.elements.namedItem("attach") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let filePath: string | null = null;

    if (file) {
      filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) {
        toast.error("فشل في رفع المرفق!");
        return;
      }
    }

    if (!filePath) {
      data["attach"] = null;
    } else {
      data["attach"] = [filePath];
    }

    data["job_id"] = id;

    const { error } = await supabase.from("services").insert([data]);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تمت الإضافة");
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    service: Service
  ) => {
    e.preventDefault();

    //file  uploade
    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }

    const fileInput = form.elements.namedItem("attach") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let filePath: string | null = null;

    if (service.attach && service.attach.length > 0 && file) {
      console.log("done");
      const { error } = await supabase.storage
        .from("attachments")
        .remove([service.attach[0]]);
      if (error) {
        console.log("error", error);
        return;
      }
    }

    if (file) {
      filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        toast.error("فشل في رفع المرفق!");
        return;
      }
    }

    if (!filePath) {
      data["attach"] = null;
    } else {
      data["attach"] = [filePath];
    }

    data["job_id"] = id;

    const { error } = await supabase
      .from("services")
      .update([data])
      .eq("id", data["id"]);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تم التعديل");
  };

  const handleCheck = async (
    e: React.FormEvent<HTMLFormElement>,
    service: Service
  ) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    let data: any = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }
    data["service_id"] = service.id;
    const { error } = await supabase.from("check_service").insert([data]);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تم اضافة التدقيق");
  };

  const handleUpdateCheck = async (
    e: React.FormEvent<HTMLFormElement>,
    service: Service
  ) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    let data: any = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
      if (!data[key]) {
        toast.error("أحد الحقول فارغة!");
        return;
      }
    }
    data["service_id"] = service.id;
    const { error } = await supabase
      .from("check_service")
      .update([data])
      .eq("id", service.check_service?.id);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تم تعديل التدقيق");
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .textSearch("tsv", search.trim().split(/\s+/).join(" & "));
    setServices(data ?? []);
    console.log("ak2", data);
    if (error) toast.error("شيء ما خاطىء!");
  };

  const handleDownload = async (attachment: string) => {
    const { data } = supabase.storage
      .from("attachments")
      .getPublicUrl(attachment);

    const publicUrl = data.publicUrl;

    window.open(publicUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-screen">
      <Nav>
        <form className="flex gap-x-1 pr-12" onSubmit={handleSearch}>
          <Input
            name="search"
            type="text"
            placeholder="ادخل ماتريد البحث عنه"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="bg-[#165D4E]">
            <Search />
          </Button>
        </form>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#165D4E]">
              إضافة تخديم <Plus />
            </Button>
          </DialogTrigger>
          <FromServiceAdd onAdd={handleAdd} />
        </Dialog>
      </Nav>
      <div className="flex-1 overflow-y-auto relative">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة الخدمات الخاصة بالجهاز</TableCaption>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/8">الحالة</TableHead>
                <TableHead className="w-1/8">نوع التخديم</TableHead>
                <TableHead className="w-1/8">القائم بالعمل</TableHead>
                <TableHead className="w-1/8">المتطلبات</TableHead>
                <TableHead className="w-1/8">الملاحظات</TableHead>
                <TableHead className="w-1/8">المرفق</TableHead>
                <TableHead className="w-1/8">تم التدقيق</TableHead>
                <TableHead className="w-1/8">حذف تعديل تدقيق طباعة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((ele) => (
                <TableRow key={ele.id} className="bg-[#988561]/30">
                  <TableCell className="w-1/7">{ele.status}</TableCell>
                  <TableCell className="w-1/7">{ele.service_type}</TableCell>
                  <TableCell className="w-1/7">{ele.worker ?? ""}</TableCell>
                  <TableCell className="w-1/7">
                    {ele.requirements ?? ""}
                  </TableCell>
                  <TableCell className="w-1/7">{ele.notes ?? ""}</TableCell>
                  <TableCell className="w-1/7">
                    {ele.attach && ele.attach.length > 0 ? (
                      <Download
                        className="m-auto cursor-pointer"
                        onClick={() => handleDownload(ele.attach![0])}
                      />
                    ) : (
                      "لايوجد مرفق"
                    )}
                  </TableCell>
                  <TableCell className="w-1/7">
                    {ele.check_service && (
                      <Dialog>
                        <DialogTrigger>
                          <BadgeCheck />
                        </DialogTrigger>
                        <CheckFormAdd
                          check={ele.check_service}
                          onUpdate={(e) => handleUpdateCheck(e, ele)}
                        />
                      </Dialog>
                    )}
                  </TableCell>
                  <TableCell className="w-1/7">
                    <DeleteOrEdit
                      ele={ele}
                      disable={userId && userId != ele.user_id ? true : false}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            disabled={
                              userId && userId != ele.user_id ? true : false
                            }
                            className="size-min bg-[#165D4E]"
                          >
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <FormServiceEdit
                          service={ele}
                          onUpdate={(e) => handleUpdate(e, ele)}
                        />
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            disabled={
                              userId && userId != ele.user_id ? true : false
                            }
                            className="size-min bg-[#165D4E]"
                            onClick={(e) => {
                              if (ele.check_service) {
                                e.preventDefault();
                                toast.error("الخدمة مدققة بالفعل!");
                              }
                            }}
                          >
                            <BadgeCheck />
                          </Button>
                        </DialogTrigger>

                        <CheckFormAdd
                          check={ele.check_service}
                          onAdd={(e) => handleCheck(e, ele)}
                        />
                      </Dialog>
                      <Button
                        className="size-min bg-[#165D4E]"
                        onClick={() => handlePrint(ele)}
                      >
                        <Printer />
                      </Button>
                    </DeleteOrEdit>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Pagination
        pageNumber={(end - 14) / 15 + 1}
        nextDisable={false}
        previousDisable={end - 14 == 0}
        onNext={() => setEnd(end + 15)}
        onPrevious={() => setEnd(end - 15)}
      />
    </div>
  );
};

export default ServicesAdministrate;
