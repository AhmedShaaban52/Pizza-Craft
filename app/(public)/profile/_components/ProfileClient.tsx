"use client";

import Image from "next/image";
import { User, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  role?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
}

interface ProfileClientProps {
  user: ProfileUser;
}


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProfileClient({ user }: ProfileClientProps) {
 const t = useTranslations("Profile");
  return (
    <div className="min-h-screen bg-background text-foreground md:flex pt-5 md:pt-20">
      <main className="w-full md:w-[98%] px-3 md:px-12 md:py-10  space-y-8">

        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={112}
                height={112}
                className="w-28 h-28 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="size-20 md:size-28 rounded-full border-2 border-border bg-orange-500 flex items-center justify-center">
                <span className="text-lg md:text-3xl font-bold text-white">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors flex items-center justify-center border-2 border-background"
              aria-label="Change profile photo"
            >
              <Pencil className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <div>
            <h1 className="text-lg md:text-4xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-sm text-orange-500 mt-1">
              {user.role ?? "Member"} • {t("joined")} {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Personal Information card */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-sm">{t("personalInformation")}</span>
            </div>
            <button className="text-orange-500 text-sm font-medium text-start hover:text-orange-400 transition-colors">
              {t("editInfo")}
            </button>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Field label={t("fullName")} value={user.name} />
            <Field label={t("emailAddress")} value={user.email} highlight />
            <Field
              label={t("phoneNumber")}
              value={user.phoneNumber ?? t("notProvided")}
              muted={!user.phoneNumber}
            />
          </div>
        </section>

      </main>
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-medium ${highlight
            ? "text-orange-400"
            : muted
              ? "text-muted-foreground"
              : "text-foreground"
          }`}
      >
        {value}
      </p>
    </div>
  );
}
