import { viewPaths } from "@better-auth-ui/core";
import { notFound } from "next/navigation";

import { Settings } from "~/components/auth/settings/settings";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{
    path: string;
  }>;
}) {
  const { path } = await params;

  if (!Object.values(viewPaths.settings).includes(path)) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <Settings path={path} />
    </div>
  );
}
