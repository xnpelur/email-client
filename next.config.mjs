/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, must-revalidate",
                    },
                ],
            },
        ];
    },
    output: "standalone",
};

export default nextConfig;
