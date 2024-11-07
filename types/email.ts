export type Email = {
    seqNo: number;
    from: {
        name: string;
        address: string;
    };
    to: {
        name: string;
        address: string;
    };
    subject: string;
    date: Date;
    text: string;
    attachments: {
        filename: string;
        content: Buffer;
    }[];
};
