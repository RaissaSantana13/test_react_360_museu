'use client';

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useDictionary } from "../../service/providers/i18n-providers";
import PermissionMatrixForm from "../forms/permissions/PermissionsMatrixForm";
import { PageShell } from "../pageshell/page-shell";
import { Button } from "../ui/button";

export default function PermissionsMatriz(){
  const dict = useDictionary();
  return (
      <> 
        <section aria-labelledby="permissions-heading">
          <PageShell
            title={dict.permissions.management.title}
            description={dict.permissions.management.description}
            headingId="permissions-heading"
            actions={
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {dict.navigation.dashboards}
                </Link>
              </Button>
            }
          >
           <PermissionMatrixForm roleName='Administrador' />
          </PageShell>
        </section>
</>
    );
}