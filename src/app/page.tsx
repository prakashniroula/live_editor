import { Routes } from "@/routes/routes";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(Routes.app)
  return <></>
}
