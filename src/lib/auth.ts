import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "~/env";
import { db } from "~/server/db";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: 'sandbox'
});

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "9969b522-e380-47d6-b22d-bdb6e4fb46b7",
                            slug: "starter" 
                        },
                        {
                            productId: "0e2d6143-eb90-4de3-af11-e2a07e9e21b5",
                            slug: "creator" 
                        },
                        {
                            productId: "cb698d5d-88c8-428d-b3a4-e39ba8012723",
                            slug: "studio" 
                        },
                    ],
                    successUrl: "/",
                    authenticatedUsersOnly: true
                }),
                portal({
                    returnUrl: env.BETTER_AUTH_URL,
                }),
                webhooks({
                    secret: env.POLAR_WEBHOOK_SECRET,
                    onOrderPaid: async (order) => {
                        const externalCustomerId = order.data.customer.externalId;
                        if(!externalCustomerId){
                            console.error("No external customer ID found!");
                            throw new Error("No external customer ID found!");
                        }
                        const productId = order.data.productId;
                        let creditsToAdd = 0;
                        switch(productId){
                            case "9969b522-e380-47d6-b22d-bdb6e4fb46b7":
                                creditsToAdd = 10;
                                break;
                            case "0e2d6143-eb90-4de3-af11-e2a07e9e21b5":
                                creditsToAdd = 25;
                                break;
                            case "cb698d5d-88c8-428d-b3a4-e39ba8012723":
                                creditsToAdd = 50;
                                break;
                        }

                        await db.user.update({
                            where: {
                                id: externalCustomerId
                            },
                            data: {
                                credits: {
                                    increment: creditsToAdd,
                                }
                            }
                        })
                    }
                })
            ],
        })
    ]
});