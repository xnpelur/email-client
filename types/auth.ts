import { ProviderData } from "@/types/provider";

export type Session = {
    user: User;
};

export type User = {
    email: string;
    password: string;
} & ProviderData;
