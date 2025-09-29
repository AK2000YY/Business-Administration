import DeleteOrEdit from "@/components/DeleteOrEdit";
import FormDeviceAdd from "@/components/FormDeviceAdd";
import FormDeviceUpdate from "@/components/FormDeviceUpdate";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
import Pagination from "@/components/Pagination";
import ShowPasswords from "@/components/ShowPasswords";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { type DeviceType } from "@/types/device_type";
import type { Work } from "@/types/work";
import { Download, HandHelping, Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorksAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [works, setWorks] = useState<Work[]>([]);
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [end, setEnd] = useState<number>(14);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [arrivalDate, setArriavalDate] = useState<Date | undefined>(undefined);

  const getTypes = async () => {
    setLoad(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, device_types(*), passwords(*), cpus(*)")
      .order("created_at", { ascending: true })
      .range(end - 14, end);
    console.log(data);
    if (error) toast.error("حدث خطأ ما!");
    else {
      setWorks(data ?? []);
      setLoad(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const getDeviceTypes = async () => {
      const { data, error } = await supabase.from("device_types").select("*");
      if (ignore) return;
      if (error) toast.error("حدث خطأ ما!");
      else setTypes(data ?? []);
    };

    const deviceChannel = supabase
      .channel("jobs-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        async ({ eventType, old, new: newData }) => {
          console.log(eventType);
          switch (eventType) {
            case "INSERT": {
              const { data } = await supabase
                .from("jobs")
                .select("*, device_types(*), passwords(*), cpus(*)")
                .eq("id", newData.id)
                .single();
              setWorks((prev) => {
                if (prev.length < 15) return [...prev, data];
                else return prev;
              });
              break;
            }
            case "UPDATE": {
              const { data } = await supabase
                .from("jobs")
                .select("*, device_types(*), passwords(*), cpus(*)")
                .eq("id", newData.id)
                .single();

              if (data) {
                setWorks((prev) =>
                  prev.map((job) => (job.id === data.id ? data : job))
                );
              }
              break;
            }

            case "DELETE": {
              const job: Work = old as Work;
              setWorks((prev) => prev.filter((ele) => ele.id != job.id));
            }
          }
        }
      )
      .subscribe();

    getDeviceTypes();
    getTypes();
    getUserId((id) => {
      setUserId(id);
    });
    return () => {
      deviceChannel.unsubscribe();
      ignore = true;
    };
  }, [end]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};
    const serial = formData.get("serial")?.toString().trim();
    const deviceTypeId = formData.get("device_type_id")?.toString().trim();

    if (!serial || !deviceTypeId) {
      toast.error("الرقم التسلسلي او نوع الجهاز فارغ!");
      return;
    }

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
    }
    if ("password_num" in data && data["password_num"]) {
      const password = await supabase
        .from("passwords")
        .select("*")
        .eq("number", data["password_num"]);
      if (password.error || password.data.length == 0) {
        toast.error("تأكد من رقم كلمة السر");
        return;
      } else {
        const currentPassword = await supabase
          .from("jobs")
          .select("*")
          .eq("password_id", password.data![0].id);
        if (currentPassword.data?.length != 0) {
          toast.error("كلمة السر مستخدمة");
          return;
        }
        data["password_id"] = password.data[0].id;
      }
    }
    delete data.password_type;
    delete data.password_num;

    if (arrivalDate) data["recieve_data"] = arrivalDate;

    //file  uploade
    const fileInput = form.elements.namedItem("attachment") as HTMLInputElement;
    const files = fileInput?.files;
    let filePaths: string[] = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`فشل في رفع الملف: ${file.name}`);
          continue;
        }

        filePaths.push(filePath);
      }
    }

    if (filePaths.length == 0) {
      data["attachment"] = null;
    } else {
      data["attachment"] = filePaths;
    }
    console.log(data["attachment"]);
    const { error } = await supabase.from("jobs").insert([data]);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تمت الإضافة");
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    device: Work
  ) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    //database insert
    const formData = new FormData(form);
    let data: any = {};
    const serial = formData.get("serial")?.toString().trim();
    const deviceTypeId = formData.get("device_type_id")?.toString().trim();

    if (!serial || !deviceTypeId) {
      toast.error("الرقم التسلسلي او نوع الجهاز فارغ!");
      return;
    }

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString().trim().length == 0 ? null : value;
    }

    data["password_id"] = null;
    if (
      "password_num" in data &&
      data["password_num"] &&
      device.passwords &&
      data["password_num"] == device.passwords.number
    )
      data["password_id"] = device.passwords.id;
    else if ("password_num" in data && data["password_num"]) {
      const password = await supabase
        .from("passwords")
        .select("*")
        .eq("number", data["password_num"]);
      if (password.error || password.data.length == 0) {
        toast.error("تأكد من رقم كلمة السر");
        return;
      } else {
        const currentPassword = await supabase
          .from("jobs")
          .select("*")
          .eq("password_id", password.data![0].id);
        if (currentPassword.data?.length != 0) {
          toast.error("كلمة السر مستخدمة");
          return;
        }
        data["password_id"] = password.data[0].id;
      }
    }

    delete data.password_type;
    delete data.password_num;

    if (arrivalDate) data["recieve_data"] = arrivalDate;

    //file  uploade
    const fileInput = form.elements.namedItem("attachment") as HTMLInputElement;
    const files = fileInput?.files;
    let filePaths: string[] = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`فشل في رفع الملف: ${file.name}`);
          continue;
        }

        filePaths.push(filePath);
      }
    }

    if (filePaths.length == 0) {
      data["attachment"] = null;
    } else {
      data["attachment"] = filePaths;
    }

    const { error } = await supabase
      .from("jobs")
      .update([data])
      .eq("id", data["id"]);
    console.log(error);
    if (error) toast.error("حدث خطأ ما!");
    else toast.success("تم التعديل");
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    if (search.length != 0) {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, device_types(*), passwords(*), cpus(*)")
        .textSearch("tsv", search.trim().split(/\s+/).join(" & "));
      setWorks(data ?? []);
      setLoad(false);
      console.log("ak2", data);
      if (error) toast.error("شيء ما خاطىء!");
    } else {
      await getTypes();
    }
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
            <Button
              className="bg-[#165D4E]"
              onClick={() => setArriavalDate(undefined)}
            >
              إضافة جهاز جديد <Plus />
            </Button>
          </DialogTrigger>
          <FormDeviceAdd
            types={types}
            arrivalOpen={arrivalOpen}
            setArrivalOpen={setArrivalOpen}
            arrivalDate={arrivalDate}
            setArrivalDate={setArriavalDate}
            handleAdd={handleAdd}
          />
        </Dialog>
      </Nav>
      <div className="flex-1 overflow-y-auto relative">
        {load && <Loader />}
        {!load && (
          <Table>
            <TableCaption>تصفح قائمة الأنواع</TableCaption>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-1/20">الرقم التسلسلي</TableHead>
                <TableHead className="w-1/20">الشركة المصنعة</TableHead>
                <TableHead className="w-1/20">نوع الجهاز</TableHead>
                <TableHead className="w-1/20">الموديل</TableHead>
                <TableHead className="w-1/20">الشركة المصنعة للمعالج</TableHead>
                <TableHead className="w-1/20">اسم المعالج</TableHead>
                <TableHead className="w-1/20">جيل المعالج</TableHead>
                <TableHead className="w-1/20">نوع الرام</TableHead>
                <TableHead className="w-1/20">حجم الرام</TableHead>
                <TableHead className="w-1/20">تاريخ الوصول</TableHead>
                <TableHead className="w-1/20">الحالة</TableHead>
                <TableHead className="w-1/20">ملاحظة</TableHead>
                <TableHead className="w-1/20">اسم الأخ</TableHead>
                <TableHead className="w-1/20">الجهة الرئيسية</TableHead>
                <TableHead className="w-1/20">الجهة الفرعية</TableHead>
                <TableHead className="w-1/20">رقم التواصل</TableHead>
                <TableHead className="w-1/20">معرف الاخ</TableHead>
                <TableHead className="w-1/20">كرت الشبكة</TableHead>
                <TableHead className="w-1/20">كلمة المرور</TableHead>
                <TableHead className="w-1/20">المرفقات</TableHead>
                <TableHead className="w-1/20">حذف تعديل تخديم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((ele) => (
                <TableRow key={ele.id} className="bg-[#988561]/30">
                  <TableCell className="w-1/20">{ele.serial}</TableCell>
                  <TableCell className="w-1/20">{ele.company ?? ""}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.device_types.type}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.model ?? ""}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.cpu_factory ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {ele.cpus?.name ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.cpu_name}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.ram_type?.toUpperCase() ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {(ele.ram ?? 0) + "GB"}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {ele.recieve_data
                      ? new Date(ele.recieve_data).toISOString().split("T")[0]
                      : ""}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.status ?? ""}</TableCell>
                  <TableCell className="w-1/20">{ele.note ?? ""}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.brother_name ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.entity ?? ""}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.sub_entity ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {ele.contact_number ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">{ele.username ?? ""}</TableCell>
                  <TableCell className="w-1/20">
                    {ele.wifi_card ?? ""}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {ele.passwords && (
                      <Dialog>
                        <DialogTrigger className="text-blue-700 cursor-pointer">
                          {ele.passwords?.number ?? ""}
                        </DialogTrigger>
                        <ShowPasswords passwords={ele.passwords} />
                      </Dialog>
                    )}
                  </TableCell>
                  <TableCell className="w-1/20">
                    {ele.attachment && ele.attachment.length && (
                      <Dialog>
                        <DialogTrigger>
                          <Download className="m-auto cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>المرفقات</DialogTitle>
                            <DialogDescription>
                              اضفط على رمز التحميل لتحميل المرفق
                            </DialogDescription>
                          </DialogHeader>
                          {ele.attachment?.map((attach) => (
                            <div
                              key={attach}
                              className="w-full pt-1 flex flex-row-reverse justify-between"
                            >
                              <p>{"..." + attach.slice(3)}</p>
                              <div>
                                <Download
                                  className="m-auto cursor-pointer"
                                  onClick={() => handleDownload(attach)}
                                />
                              </div>
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                  <TableCell className="w-1/20">
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
                            onClick={() => {
                              setArriavalDate(
                                ele.recieve_data
                                  ? new Date(ele.recieve_data)
                                  : undefined
                              );
                            }}
                          >
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <FormDeviceUpdate
                          arrivalDate={arrivalDate}
                          arrivalOpen={arrivalOpen}
                          setArrivalDate={setArriavalDate}
                          setArrivalOpen={setArrivalOpen}
                          types={types}
                          device={ele}
                          onUpdate={(e) => handleUpdate(e, ele)}
                        />
                      </Dialog>
                      <Button
                        className="size-min bg-[#165D4E]"
                        onClick={() => {
                          navigate(`/service/${ele.id}`);
                        }}
                      >
                        <HandHelping />
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

export default WorksAdministrate;
