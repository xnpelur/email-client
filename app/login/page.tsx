import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage() {
    const session = await getSession();
    if (session !== null) {
        redirect("/inbox");
    }

    return (
        <div className="flex h-full flex-1 items-center pb-20">
            <Card className="mx-auto w-96 max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Вход</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
