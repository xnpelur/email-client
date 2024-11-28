"use client";

import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function LoginForm() {
    const formSchema = z.object({
        username: z
            .string()
            .min(1, { message: "Имя пользователя не может быть пустым" }),
        password: z.string().min(1, { message: "Пароль не может быть пустым" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // const success = await login(values.username, values.password);
        // if (!success) {
        //     form.setError("root", {
        //         message: "Неверный логин или пароль",
        //     });
        // }
    }

    return (
        <div>
            <Form {...form}>
                <form
                    className="grid gap-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <CardContent className="space-y-4 p-0">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="items-center">
                                    <FormLabel>Имя пользователя</FormLabel>
                                    <div className="flex items-center">
                                        <FormControl>
                                            <Input
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue(
                                                        field.name,
                                                        e.target.value,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="col-span-2 col-start-2" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="items-center">
                                    <FormLabel>Пароль</FormLabel>
                                    <div className="flex items-center">
                                        <FormControl>
                                            <Input
                                                type="password"
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue(
                                                        field.name,
                                                        e.target.value,
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="col-span-2 col-start-2" />
                                </FormItem>
                            )}
                        />
                        {form.formState.errors.root && (
                            <p className="text-[0.8rem] font-medium text-destructive">
                                {form.formState.errors.root.message}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="p-0 py-2">
                        <Button className="w-full" type="submit">
                            Войти
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </div>
    );
}
