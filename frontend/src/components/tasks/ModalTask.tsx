"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import {
  AlertTriangle,
  Calendar,
  CameraIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FilesIcon,
  Loader2,
  Paperclip,
  Plus,
  Reply,
  Send,
  Trash2,
  Trash2Icon,
  Undo2,
  Upload,
  User2,
  XCircle,
  XIcon
} from "lucide-react";
import classNames from "@/utils/classNames";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import AvatarName from "../avatarName";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

const MAX_FILE_SIZE = 2000000;

const activity = [
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56"
  }
];

const timeline = [
  {
    id: 1,
    content: "Applied to",
    target: "Front End Developer",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: User2,
    iconBackground: "bg-zinc-400"
  },
  {
    id: 2,
    content: "Advanced to phone screening by",
    target: "Bethany Blake",
    href: "#",
    date: "Sep 22",
    datetime: "2020-09-22",
    icon: User2,
    iconBackground: "bg-blue-500"
  },
  {
    id: 3,
    content: "Completed phone screening with",
    target: "Martha Gardner",
    href: "#",
    date: "Sep 28",
    datetime: "2020-09-28",
    icon: User2,
    iconBackground: "bg-green-500"
  },
  {
    id: 4,
    content: "Advanced to interview by",
    target: "Bethany Blake",
    href: "#",
    date: "Sep 30",
    datetime: "2020-09-30",
    icon: User2,
    iconBackground: "bg-blue-500"
  },
  {
    id: 5,
    content: "Completed interview with",
    target: "Katherine Snyder",
    href: "#",
    date: "Oct 4",
    datetime: "2020-10-04",
    icon: User2,
    iconBackground: "bg-green-500"
  }
];

export default function ModalTaskDetail({
  open,
  setOpen,
  data,
  handleUpdate
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  data: any;
  handleUpdate: () => void;
}) {
  const { data: session }: any = useSession();
  const [tab, setTab] = useState<string>("details");
  const [checklistDetail, setChecklistDetail] = useState<any>(null);
  const [fileDetail, setFileDetail] = useState<any>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [ckItem, setCkItem] = useState<string>("");
  const [taskData, setTaskData] = useState<any>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  const [loadings, setLoadings] = useState<any>({
    addChecklist: false,
    finalizeChecklist: false,
    deleteChecklist: false,
    addComment: false
  });

  useEffect(() => {
    if (!data) {
      setTab("details");
    } else {
      setTaskData(data);
    }
  }, [data]);

  if (!data || !taskData) {
    return <></>;
  }

  const tabs = [
    { name: "Detalhes", tab: "details", current: tab === "details" },
    {
      name: "Checklist",
      tab: "checklist",
      count: taskData.checklist.length || "0",
      current: tab === "checklist"
    },
    {
      name: "Comentários",
      tab: "comments",
      count: taskData.comments.length || "0",
      current: tab === "comments"
    },
    {
      name: "Anexos",
      tab: "files",
      count: taskData.files.length || "0",
      current: tab === "files"
    },
    {
      name: "Logs",
      tab: "logs",
      count: taskData.logs.length || "0",
      current: tab === "logs"
    }
  ];

  const updateTaskData = async () => {
    try {
      const { data: updateTask }: any = await axios.get(
        `/api/v1/tasks/${data.id}?taskId=${data.id}`
      );
      setTaskData(updateTask);
      handleUpdate();
      toast.success("Dados mais recentes baixados...");
    } catch (error) {
      console.error("updateTaskData", error);
    }
  };

  const handleAddChecklist = async () => {
    if (ckItem === "") {
      toast.error("Comentários vazios não permitidos.");
      return false;
    }
    setLoadings({ ...loadings, addChecklist: true });
    try {
      const added: any = await axios.post(
        `/api/v1/checklist?taskId=${data.id}`,
        {
          title: ckItem
        }
      );
      await updateTaskData();
      toast.success("Checklist atualizada com sucesso");
      setCkItem("");
    } catch (error) {
      console.error("handleAddChecklist"), error;
      toast.error(`Falha ao adicionar o item.`);
    } finally {
      setLoadings({ ...loadings, addChecklist: false });
    }
  };

  const handleComment = async () => {
    if (comment === "" || comment.length <= 1) {
      toast.error("Comentários vazios não permitidos.");
      return false;
    }
    setLoadings({ ...loadings, addComment: true });
    try {
      const { data: added }: any = await axios.post(
        `/api/v1/comments?taskId=${data.id}`,
        {
          comment,
          replyId
        }
      );
      if (added.error) {
        toast.error(added.error);
        return false;
      }
      await updateTaskData();
      toast.success("Comentário publicado com sucesso");
      setComment("");
      setReplyId(null);
    } catch (error) {
      console.error("handleComment"), error;
      toast.error(`Falha ao enviar comentário.`);
    } finally {
      setLoadings({ ...loadings, addComment: false });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/tasks?userId=${data.id}`);
      toast.success("Projeto excluído com sucesso");
      setOpen(false);
      handleUpdate();
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao recuperar as tarefas.`);
    }
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    setLoadings({ ...loadings, deleteChecklist: true });
    try {
      const { data: query }: any = await axios.delete(
        `/api/v1/checklist?checklistId=${checklistId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await updateTaskData();
      setChecklistDetail(null);
      toast.success("Checklist excluído com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao excluir o checklist.`);
    } finally {
      setLoadings({ ...loadings, deleteChecklist: false });
    }
  };

  const handleFinalizeChecklist = async (checklistId: string) => {
    setLoadings({ ...loadings, finalizeChecklist: true });
    try {
      const { data: query }: any = await axios.put(
        `/api/v1/checklist/finalize?checklistId=${checklistId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await updateTaskData();
      setChecklistDetail(null);
      toast.success("Checklist finalizado com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao finalizar o checklist.`);
    } finally {
      setLoadings({ ...loadings, finalizeChecklist: false });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { data: query }: any = await axios.delete(
        `/api/v1/comments?commentId=${commentId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await updateTaskData();
      toast.success("Comentário excluído com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao excluir o comentário.`);
    }
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSelectedFile = async (files: any) => {
    if (files && files[0].size < MAX_FILE_SIZE) {
      const base64 = files[0] ? await toBase64(files[0] as File) : null;
      if (base64) {
        setImageFile(files[0]);
        setBase64(base64 as string);
      }
    } else {
      toast.error(`Envie um arquivo de no máximo 2MB`);
    }
  };

  const handleUploadFile = async (taskId: string) => {
    try {
      const { data: query }: any = await axios.post(
        `/api/v1/files?taskId=${taskId}`,
        {
          base64,
          filename: imageFile.name,
          mimetype: imageFile.type
        }
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await updateTaskData();
      setImageFile(null);
      toast.success("Arquivo enviado com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao enviar o arquivo selecionado.`);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { data: query }: any = await axios.delete(
        `/api/v1/files?fileId=${fileId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await updateTaskData();
      setFileDetail(null);
      toast.success("Anexo excluído com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao excluir anexo.`);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <DialogTitle
                  as="h3"
                  className="text-lg capitalize font-semibold leading-6 text-zinc-900"
                >
                  {taskData.title}
                </DialogTitle>
                {taskData.description && taskData.description !== "" && (
                  <div className="mt-2">
                    <p className="text-sm text-zinc-500">
                      {taskData.description}
                    </p>
                  </div>
                )}
                {tab === "details" && (
                  <div aria-label="Breadcrumb" className="flex">
                    <ol
                      role="list"
                      className="flex items-center bg-black/10 rounded-md pr-4 mt-4"
                    >
                      {["A Fazer", "Em Progresso", "Finalizado"].map(
                        (page: any, k: number) => (
                          <li key={page.name} className="p-2">
                            <div className="flex items-center">
                              {k > 0 && (
                                <ChevronRight
                                  aria-hidden="true"
                                  className="h-5 w-5 flex-shrink-0 text-zinc-400"
                                />
                              )}
                              <div
                                className={`ml-4 text-sm ${
                                  taskData.status >= k
                                    ? `font-bold text-zinc-800 hover:text-zinc-900`
                                    : `font-medium text-zinc-500 hover:text-zinc-700`
                                }`}
                              >
                                {page}
                              </div>
                            </div>
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}
                <div>
                  <div className="my-4">
                    <div className="border-b border-zinc-200">
                      <nav aria-label="Tabs" className="-mb-px flex space-x-6">
                        {tabs.map((tab) => (
                          <button
                            key={tab.tab}
                            onClick={() => setTab(tab.tab)}
                            className={classNames(
                              tab.current
                                ? "border-zinc-500 text-zinc-600"
                                : "border-transparent text-zinc-500 hover:border-zinc-200 hover:text-zinc-700",
                              "flex outline-none whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                            )}
                          >
                            {tab.name}
                            {tab.count ? (
                              <span
                                className={classNames(
                                  tab.current
                                    ? "bg-zinc-200 text-zinc-600"
                                    : "bg-zinc-200 text-zinc-900",
                                  "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block"
                                )}
                              >
                                {tab.count}
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
                {tab === "details" ? (
                  <div className="text-left">
                    <dl className="divide-y divide-zinc-100">
                      <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">
                          Tarefa
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                          {taskData.title}
                        </dd>
                      </div>
                      <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">
                          Descrição
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                          {taskData.description || ""}
                        </dd>
                      </div>
                      <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">
                          Criado em
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                          {dayjs(taskData.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </dd>
                      </div>
                      {taskData.end_at && (
                        <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium leading-6 text-zinc-900">
                            Finalizado em
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                            {dayjs(taskData.end_at).format("DD/MM/YYYY HH:mm")}
                          </dd>
                        </div>
                      )}
                      <div className="bg-white py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">
                          Por
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                          {taskData.user.name}
                        </dd>
                      </div>
                      <div className="bg-white py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium leading-6 text-zinc-900">
                          Anexos
                        </dt>
                        <dd className="mt-2 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
                          {taskData.files.length >= 1 ? (
                            <ul className="divide-y divide-zinc-100 rounded-md border border-zinc-200">
                              {taskData.files.map((x: any, k: number) => (
                                <li
                                  key={k}
                                  className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                                >
                                  <div className="flex w-0 flex-1 items-center">
                                    <Paperclip
                                      aria-hidden="true"
                                      className="h-5 w-5 flex-shrink-0 text-zinc-400"
                                    />
                                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                      <span className="truncate font-medium">
                                        {x.filename}
                                      </span>
                                      <span className="flex-shrink-0 text-zinc-400">
                                        {dayjs(x.created_at).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <Link
                                      href={x.uri}
                                      target="_blank"
                                      className="font-medium text-zinc-600 hover:text-zinc-500"
                                    >
                                      Visualizar
                                    </Link>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-zinc-500">
                              Nenhum arquivo anexado à tarefa.
                            </span>
                          )}
                        </dd>
                      </div>
                      {session && session.manager && (
                        <>
                          <div className="bg-white py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium leading-6 text-zinc-900">
                              Excluir
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                              <button
                                onClick={handleDelete}
                                className="flex items-center gap-x-2 text-red-500 p-2 px-3 hover:bg-black/10 rounded-md bg-black/5"
                              >
                                <Trash2Icon size={16} /> Excluir Tarefa
                              </button>
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                ) : tab === "checklist" ? (
                  <>
                    <div className="w-full">
                      {!checklistDetail ? (
                        <>
                          {taskData.checklist.length <= 0 && (
                            <div className="text-center w-full py-8">
                              <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400" />
                              <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                                Sem registros
                              </h3>
                              <p className="mt-1 text-sm text-zinc-500">
                                A lista está vazia.
                              </p>
                            </div>
                          )}
                          <ul className="w-full space-y-2 overflow-y-auto">
                            {taskData.checklist.map((a: any, k: number) => (
                              <li
                                key={k}
                                className={`w-full border-l-4 ${
                                  a.status === 0
                                    ? `border-protectdata-500`
                                    : `border-emerald-500`
                                } relative flex items-center justify-between gap-x-4 bg-black/5 hover:bg-black/10 rounded-md p-2 px-3 transition duration-300 ease-in-out`}
                              >
                                <div className="flex items-center gap-x-4">
                                  <input
                                    type="checkbox"
                                    checked={a.status === 1}
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      setChecklistDetail(a);
                                    }}
                                  />
                                  <div
                                    onClick={() => setChecklistDetail(a)}
                                    className="cursor-pointer"
                                  >
                                    {a.title}
                                  </div>
                                </div>
                                <button onClick={() => setChecklistDetail(a)}>
                                  <ChevronRight
                                    className="text-zinc-600"
                                    size={16}
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-x-2 mt-4 pt-4 border-t border-zinc-300">
                            <input
                              value={ckItem}
                              disabled={loadings.addChecklist}
                              onChange={(e: any) => setCkItem(e.target.value)}
                              className="w-full outline-none py-1.5 px-2 text-sm rounded-md border border-zinc-300 focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Adicionar nova tarefa"
                            />
                            <button
                              disabled={loadings.addChecklist}
                              onClick={handleAddChecklist}
                              className="bg-protectdata-500 text-black text-sm flex items-center gap-x-1 p-2 px-3 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {!loadings.addChecklist ? (
                                <>
                                  <Plus size={16} /> Adicionar
                                </>
                              ) : (
                                <>
                                  <Loader2
                                    size={20}
                                    className="mx-auto animate-spin"
                                  />
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`w-full h-full rounded-md border-l-4 ${
                              checklistDetail.status
                                ? `border-emerald-500`
                                : `border-protectdata-500`
                            } pl-4 pb-4`}
                          >
                            <div className="font-semibold mb-2 flex justify-between items-center gap-x-2 w-full">
                              <div className="flex items-center gap-x-2">
                                <button
                                  className="p-2 rounded-md bg-black/5 hover:bg-black/10 text-zinc-600 transition duration-300 ease-in-out"
                                  onClick={() => setChecklistDetail(null)}
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                {checklistDetail.title}
                              </div>
                              <div className="flex items-center gap-x-2">
                                {checklistDetail.status === 0 ? (
                                  <button
                                    onClick={() =>
                                      handleFinalizeChecklist(
                                        checklistDetail.id
                                      )
                                    }
                                    className="flex items-center gap-x-2 text-sm text-emerald-500 font-medium hover:bg-emerald-500/10 border border-emerald-500 p-1 px-2 rounded-md transition duration-300 ease-in-out"
                                  >
                                    {!loadings.finalizeChecklist ? (
                                      <>
                                        <CheckCircle2 size={12} /> Finalizar
                                      </>
                                    ) : (
                                      <>
                                        <Loader2
                                          size={20}
                                          className="mx-auto animate-spin"
                                        />
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleFinalizeChecklist(
                                        checklistDetail.id
                                      )
                                    }
                                    className="flex items-center gap-x-2 text-sm text-protectdata-600 font-medium hover:bg-protectdata-600/10 border border-protectdata-600 p-1 px-2 rounded-md transition duration-300 ease-in-out"
                                  >
                                    {!loadings.finalizeChecklist ? (
                                      <>
                                        <Undo2 size={12} /> Desmarcar
                                      </>
                                    ) : (
                                      <>
                                        <Loader2
                                          size={20}
                                          className="mx-auto animate-spin"
                                        />
                                      </>
                                    )}
                                  </button>
                                )}{" "}
                                {session &&
                                  session.id === checklistDetail.userId && (
                                    <button
                                      onClick={() =>
                                        handleDeleteChecklist(
                                          checklistDetail.id
                                        )
                                      }
                                      className="flex items-center gap-x-2 text-sm text-red-500 font-medium hover:bg-red-500/10 border border-red-500 p-1 px-2 rounded-md transition duration-300 ease-in-out"
                                    >
                                      {!loadings.deleteChecklist ? (
                                        <>
                                          <Trash2 size={12} /> Excluir
                                        </>
                                      ) : (
                                        <>
                                          <Loader2
                                            size={20}
                                            className="mx-auto animate-spin"
                                          />
                                        </>
                                      )}
                                    </button>
                                  )}
                              </div>
                            </div>
                            <span className="flex mb-1 items-center gap-x-2 text-sm text-zinc-600">
                              <Calendar size={12} /> Criado em {` `}
                              {dayjs(checklistDetail.created_at).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </span>
                            <span className="flex items-center gap-x-2 text-sm text-zinc-600">
                              <User2 size={12} /> Por{" "}
                              {checklistDetail.user.name}
                            </span>
                            <span className="flex mb-1 items-center gap-x-2 text-sm text-zinc-600">
                              <Clock size={12} />{" "}
                              {!checklistDetail.status
                                ? `Em progresso`
                                : `Finalizado em ${dayjs(
                                    checklistDetail.updated_at
                                  ).format("DD/MM/YYYY HH:mm")}`}
                            </span>
                          </div>
                          <ul className="space-y-6">
                            {[].map((activityItem: any, activityItemIdx) => (
                              <li
                                key={activityItem.id}
                                className="relative flex gap-x-4"
                              >
                                <div
                                  className={classNames(
                                    activityItemIdx === activity.length - 1
                                      ? "h-6"
                                      : "-bottom-6",
                                    "absolute left-0 top-0 flex w-6 justify-center"
                                  )}
                                >
                                  <div className="w-px bg-zinc-200" />
                                </div>
                                <img
                                  alt=""
                                  src={activityItem.person}
                                  className="relative mt-3 h-6 w-6 flex-none rounded-full bg-zinc-50"
                                />
                                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-zinc-200">
                                  <div className="flex justify-between gap-x-4">
                                    <div className="py-0.5 text-xs leading-5 text-zinc-500">
                                      <span className="font-medium text-zinc-900">
                                        {activityItem.person}
                                      </span>{" "}
                                      comentou
                                    </div>
                                    <time
                                      dateTime={activityItem.dateTime}
                                      className="flex-none py-0.5 text-xs leading-5 text-zinc-500"
                                    >
                                      {activityItem.date}
                                    </time>
                                  </div>
                                  <p className="text-sm leading-6 text-zinc-500">
                                    {activityItem.comment}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </>
                ) : tab === "comments" ? (
                  <>
                    <div className="">
                      {taskData.comments.length <= 0 && (
                        <div className="text-center w-full py-8">
                          <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400" />
                          <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                            Sem registros
                          </h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            A lista está vazia.
                          </p>
                        </div>
                      )}
                      <ul className="space-y-6">
                        {taskData.comments.map(
                          (activityItem: any, activityItemIdx: number) =>
                            !activityItem.replyId && (
                              <>
                                <li
                                  key={activityItem.id}
                                  className="relative flex gap-x-4"
                                >
                                  <div
                                    className={classNames(
                                      activityItemIdx === activity.length - 1
                                        ? "h-6"
                                        : "-bottom-6",
                                      "absolute left-0 top-0 flex w-6 justify-center"
                                    )}
                                  >
                                    <div className="w-px bg-zinc-200" />
                                  </div>
                                  <AvatarName name={activityItem.user.name} />
                                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-zinc-200">
                                    <div className="flex justify-between gap-x-4">
                                      <div className="py-0.5 text-xs leading-5 text-zinc-500">
                                        <span className="font-medium text-zinc-900">
                                          {activityItem.user.name}
                                        </span>{" "}
                                        comentou
                                      </div>
                                      <div className="flex items-center gap-x-2">
                                        <time
                                          dateTime={activityItem.created_at}
                                          className="flex-none py-0.5 text-xs leading-5 text-zinc-500"
                                        >
                                          {dayjs(
                                            activityItem.created_at
                                          ).format("DD/MM/YYYY HH:mm")}
                                        </time>
                                        {session &&
                                          activityItem.user.id ===
                                            session.id && (
                                            <button
                                              onClick={() =>
                                                handleDeleteComment(
                                                  activityItem.id
                                                )
                                              }
                                              className="p-2 rounded-md flex justify-center items-center bg-black/5 text-red-500 hover:bg-black/10 transition duration-300 ease-in-out"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                    <p className="text-sm leading-6 text-zinc-500">
                                      {activityItem.comment}
                                    </p>
                                    {!replyId ? (
                                      <button
                                        onClick={() =>
                                          setReplyId(activityItem.id)
                                        }
                                        className="text-sm flex items-center gap-x-1 text-zinc-400"
                                      >
                                        <Reply size={16} /> responder
                                      </button>
                                    ) : replyId === activityItem.id ? (
                                      <>
                                        <button
                                          onClick={() => setReplyId(null)}
                                          className="text-sm flex items-center gap-x-1 text-zinc-700"
                                        >
                                          <Reply size={16} /> respondendo
                                        </button>
                                      </>
                                    ) : null}
                                  </div>
                                </li>
                                {taskData.comments
                                  .filter(
                                    (x: any) => x.replyId === activityItem.id
                                  )
                                  .map((_x: any, k: number) => (
                                    <li
                                      key={k}
                                      className="relative flex gap-x-4 ml-8"
                                    >
                                      <div
                                        className={classNames(
                                          k === activity.length - 1
                                            ? "h-6"
                                            : "-bottom-6",
                                          "absolute left-0 top-0 flex w-6 justify-center"
                                        )}
                                      >
                                        <div className="w-px bg-zinc-200" />
                                      </div>
                                      <AvatarName name={_x.user.name} />
                                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-zinc-200">
                                        <div className="flex justify-between gap-x-4">
                                          <div className="py-0.5 text-xs leading-5 text-zinc-500">
                                            <span className="font-medium text-zinc-900">
                                              {_x.user.name}
                                            </span>{" "}
                                            respondeu
                                          </div>
                                          <div className="flex items-center gap-x-2">
                                            <time
                                              dateTime={_x.created_at}
                                              className="flex-none py-0.5 text-xs leading-5 text-zinc-500"
                                            >
                                              {dayjs(_x.created_at).format(
                                                "DD/MM/YYYY HH:mm"
                                              )}
                                            </time>
                                            {session &&
                                              _x.user.id === session.id && (
                                                <button
                                                  onClick={() =>
                                                    handleDeleteComment(_x.id)
                                                  }
                                                  className="p-2 rounded-md flex justify-center items-center bg-black/5 text-red-500 hover:bg-black/10 transition duration-300 ease-in-out"
                                                >
                                                  <Trash2 size={12} />
                                                </button>
                                              )}
                                          </div>
                                        </div>
                                        <p className="text-sm leading-6 text-zinc-500">
                                          {_x.comment}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                              </>
                            )
                        )}
                      </ul>
                      <div className="mt-6 flex gap-x-3 w-full">
                        <AvatarName name={session ? session.name : "PD"} />
                        <div className="overflow-hidden w-full rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-zinc-600">
                          <textarea
                            rows={2}
                            disabled={loadings.addComment}
                            value={comment}
                            onChange={(e: any) => setComment(e.target.value)}
                            placeholder="Escreva o seu comentário..."
                            className="block w-full outline-none resize-none border-0 bg-transparent py-2 px-3 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                            defaultValue={""}
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
                          <button
                            type="submit"
                            disabled={loadings.addComment}
                            onClick={handleComment}
                            className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-200"
                          >
                            {!loadings.addComment ? (
                              `Enviar Comentário`
                            ) : (
                              <Loader2
                                size={20}
                                className="mx-auto animate-spin"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : tab === "files" ? (
                  <>
                    {fileDetail ? (
                      <>
                        <div className="font-semibold mb-2 flex justify-between items-center gap-x-2 w-full">
                          <div className="flex items-center gap-x-2">
                            <button
                              type="button"
                              className="p-2 rounded-md bg-black/5 hover:bg-black/10 text-zinc-600 transition duration-300 ease-in-out"
                              onClick={() => setFileDetail(null)}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            {fileDetail.filename.substring(0, 55)}
                            {fileDetail.filename.length > 55 && `...`}
                          </div>
                        </div>
                        <div className="text-left">
                          <dl className="divide-y divide-zinc-100">
                            <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium leading-6 text-zinc-900">
                                Anexo
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                {fileDetail.filename}
                              </dd>
                            </div>
                            <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium leading-6 text-zinc-900">
                                Tipo
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                {fileDetail.mimetype}
                              </dd>
                            </div>
                            <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium leading-6 text-zinc-900">
                                Enviado por
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                {fileDetail.user.name}
                              </dd>
                            </div>
                            <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium leading-6 text-zinc-900">
                                Criado em
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                {dayjs(fileDetail.created_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </dd>
                            </div>
                            <div className="bg-zinc-50 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium leading-6 text-zinc-900">
                                Visualizar
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                <Link
                                  href={fileDetail.uri}
                                  target="_blank"
                                  className="flex items-center gap-x-2 hover:text-black"
                                >
                                  <ExternalLink size={16} /> Visualizar
                                </Link>
                              </dd>
                            </div>
                            {session &&
                              (session.manager ||
                                session.id === fileDetail.user.id) && (
                                <>
                                  <div className="bg-white py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium leading-6 text-zinc-900">
                                      Excluir
                                    </dt>
                                    <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteFile(fileDetail.id)
                                        }
                                        className="flex items-center gap-x-2 text-red-500 hover:text-red-600"
                                      >
                                        <Trash2Icon size={16} /> Excluir Arquivo
                                      </button>
                                    </dd>
                                  </div>
                                </>
                              )}
                          </dl>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="my-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          <div className="text-center">
                            {!base64 ? (
                              <>
                                <CameraIcon
                                  aria-hidden="true"
                                  className="mx-auto h-12 w-12 text-gray-300"
                                />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Selecione um arquivo</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      onChange={(files) =>
                                        handleSelectedFile(files.target.files)
                                      }
                                      type="file"
                                      className="sr-only"
                                    />
                                  </label>
                                  <p className="pl-1">para anexar</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                  PNG, JPG, GIF, PDF, CSV up to 10MB
                                </p>
                              </>
                            ) : (
                              <>
                                <Paperclip
                                  aria-hidden="true"
                                  className="mx-auto h-12 w-12 text-gray-300 mb-4"
                                />
                                <p className="text-xs leading-5 text-gray-600">
                                  Arquivo{" "}
                                  <span className="uppercase font-semibold">
                                    {base64.split(";")[0].split("/")[1]}
                                  </span>{" "}
                                  selecionado.
                                </p>
                                <button
                                  className="mt-3 p-2 px-3 text-sm rounded-md text-zinc-600 hover:text-black hover:bg-black/5 transition duration-300 ease-in-out"
                                  onClick={() => setBase64(null)}
                                >
                                  Selecionar Outro Arquivo
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {(taskData.files.length <= 0 || base64) && (
                          <div className="flex justify-end items-center">
                            <button
                              disabled={!base64}
                              onClick={() => handleUploadFile(taskData.id)}
                              className="bg-protectdata-500 text-black text-sm flex items-center gap-x-1 p-2 px-3 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Upload size={16} /> Enviar Arquivo
                            </button>
                          </div>
                        )}
                        <ul className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                          {taskData.files.map((x: any, k: number) => (
                            <li
                              key={k}
                              onClick={() => setFileDetail(x)}
                              className="col-span-1 border border-zinc-200 hover:border-zinc-400 cursor-pointer flex items-center gap-x-2 bg-black/5 hover:bg-black/10 rounded-md p-2 transition duration-300 ease-in-out"
                            >
                              <Image
                                width={44}
                                height={44}
                                alt={x.mimetype}
                                src={`/assets/files/${
                                  x.mimetype.includes("spreadsheetml.sheet")
                                    ? `xls`
                                    : x.mimetype.split("/")[1]
                                }.png`}
                              />
                              <div>
                                <span>
                                  {x.filename.substring(0, 10)}
                                  {x.filename.length > 10 && `...`}
                                </span>
                                <span className="block text-zinc-500 text-xs">
                                  {dayjs(x.created_at).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                ) : tab === "logs" ? (
                  <>
                    <ul role="list" className="-mb-8">
                      {taskData.logs.map((event: any, eventIdx: number) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== timeline.length - 1 ? (
                              <span
                                aria-hidden="true"
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-200"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="flex bg-protectdata-700 h-8 w-8 items-center justify-center rounded-full ring-8 ring-white">
                                  <Clock
                                    aria-hidden="true"
                                    className="h-5 w-5 text-white"
                                  />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-zinc-500">
                                    {event.action}
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-zinc-500">
                                  <time dateTime={event.created_at}>
                                    {dayjs(event.created_at).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
