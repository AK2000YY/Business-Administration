import DeleteOrEdit from "@/components/DeleteOrEdit";
import FormDeviceAdd from "@/components/FormDeviceAdd";
import FormDeviceUpdate from "@/components/FormDeviceUpdate";
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
import { type DeviceType } from "@/types/device_type";
import type { Work } from "@/types/work";
import { Download, HandHelping, Pencil, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorksAdministrate = () => {
  const [search, setSearch] = useState<string>("");
  const [works, setWorks] = useState<Work[]>([]);
  const [types, setTypes] = useState<DeviceType[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [end, setEnd] = useState<number>(9);
  const worksRef = useRef<Work[]>([]);
  const navigate = useNavigate();

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [arrivalDate, setArriavalDate] = useState<Date | undefined>(undefined);

  const getTypes = async () => {
    setLoad(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, device_types(*), passwords(*)")
      .order("created_at", { ascending: true })
      .range(end - 9, end);
    console.log(data);
    if (error) toast.error("حدث خطأ ما!");
    else {
      setWorks(data ?? []);
      worksRef.current = data ?? [];
      setLoad(false);
    }
  };

  useEffect(() => {
    const getNewType = async (id: string = "") => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, device_types(*), passwords(*)")
        .order("created_at", { ascending: true })
        .range(end, end);
      if (error) toast.error("حدث خطأ ما!");
      else {
        setWorks((prev) => [
          ...prev.filter((ele) => ele.id != id),
          ...(data ?? []),
        ]);
        worksRef.current = [
          ...worksRef.current.filter((ele) => ele.id != id),
          ...(data ?? []),
        ];
      }
    };

    const getDeviceTypes = async () => {
      const { data, error } = await supabase.from("device_types").select("*");
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
                .select("*, device_types(*), passwords(*)")
                .eq("id", newData.id)
                .single();
              console.log(worksRef.current.length);
              if (data && worksRef.current.length < 10) {
                setWorks((prev) => [...prev, data]);
                worksRef.current = [...worksRef.current, data];
              }
              break;
            }
            case "UPDATE": {
              const { data } = await supabase
                .from("jobs")
                .select("*, device_types(*), passwords(*)")
                .eq("id", newData.id)
                .single();

              if (data) {
                setWorks((prev) =>
                  prev.map((job) => (job.id === data.id ? data : job))
                );
                worksRef.current = [
                  ...worksRef.current.map((job) =>
                    job.id === data.id ? data : job
                  ),
                ];
              }
              break;
            }

            case "DELETE": {
              const job: Work = old as Work;
              if (worksRef.current.some((ele) => ele.id == job.id)) {
                getNewType(job.id);
              }
            }
          }
        }
      )
      .subscribe();

    getDeviceTypes();
    getTypes();
    return () => {
      deviceChannel.unsubscribe();
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
        .eq("number", data["password_num"])
        .eq("is_used", true);
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

    delete data.password_num;

    //file  uploade
    const fileInput = form.elements.namedItem("attachment") as HTMLInputElement;
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
      data["attachment"] = null;
    } else {
      data["attachment"] = filePath;
    }

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
    if ("password_num" in data && data["password_num"]) {
      const password = await supabase
        .from("passwords")
        .select("*")
        .eq("number", data["password_num"])
        .eq("is_used", true);
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

    delete data.password_num;

    //file  uploade
    const fileInput = form.elements.namedItem("attachment") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    let filePath: string | null = null;

    if (file && device.attachment) {
      const { error } = await supabase.storage
        .from("attachments")
        .remove([device.attachment]);
      if (error) {
        toast.error("حدث خطأ اثناء حذف الملف القديم");
      }
    }

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
      data["attachment"] = null;
    } else {
      data["attachment"] = filePath;
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
        .select("*, device_types(*), passwords(*)")
        .textSearch("tsv", search.trim().split(/\s+/).join(" & "));
      setWorks(data ?? []);
      worksRef.current = data ?? [];
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
                <TableHead className="w-1/17">الرقم التسلسلي</TableHead>
                <TableHead className="w-1/17">الشركة المصنعة</TableHead>
                <TableHead className="w-1/17">نوع الجهاز</TableHead>
                <TableHead className="w-1/17">الموديل</TableHead>
                <TableHead className="w-1/17">اسم المعالج</TableHead>
                <TableHead className="w-1/17">جيل المعالج</TableHead>
                <TableHead className="w-1/17">نوع الرام</TableHead>
                <TableHead className="w-1/17">حجم الرام</TableHead>
                <TableHead className="w-1/17">تاريخ الوصول</TableHead>
                <TableHead className="w-1/17">الحالة</TableHead>
                <TableHead className="w-1/17">اسم الأخ</TableHead>
                <TableHead className="w-1/17">الجهة</TableHead>
                <TableHead className="w-1/17">رقم التواصل</TableHead>
                <TableHead className="w-1/17">كرت الشبكة</TableHead>
                <TableHead className="w-1/17">الملاحظات</TableHead>
                <TableHead className="w-1/17">كلمة المرور</TableHead>
                <TableHead className="w-1/17">المرفقات</TableHead>
                <TableHead className="w-1/17">حذف تعديل تخديم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((ele) => (
                <TableRow key={ele.id} className="bg-[#988561]/30">
                  <TableCell className="w-1/17">{ele.serial}</TableCell>
                  <TableCell className="w-1/17">{ele.company ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.device_types.type}
                  </TableCell>
                  <TableCell className="w-1/17">{ele.model ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.cpu?.name ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">{ele.cpu_name}</TableCell>
                  <TableCell className="w-1/17">{ele.ram_type ?? ""}</TableCell>
                  <TableCell className="w-1/17">{ele.ram ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.recieve_data ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">{ele.status ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.brother_name ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">{ele.entity ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.contact_number ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">
                    {ele.wifi_card ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">{ele.notes ?? ""}</TableCell>
                  <TableCell className="w-1/17">
                    {ele.passwords?.number ?? ""}
                  </TableCell>
                  <TableCell className="w-1/17">
                    {ele.attachment ? (
                      <Download
                        className="m-auto cursor-pointer"
                        onClick={() => handleDownload(ele.attachment!)}
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="w-1/17">
                    <DeleteOrEdit ele={ele}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
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
        pageNumber={end / 9}
        nextDisable={false}
        previousDisable={end - 9 == 0}
        onNext={() => setEnd(end + 9)}
        onPrevious={() => setEnd(end - 9)}
      />
    </div>
  );
};

export default WorksAdministrate;
