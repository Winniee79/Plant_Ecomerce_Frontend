import data from "../data/carts.json";
import { http, HttpResponse } from "msw";

export const cartHandlers = [
    // GET carts
    http.get("/plant/carts", ({ request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get("user_id");
        const sessionId = url.searchParams.get("session_id");

        let result = data.carts.filter(c => c.status === "active");

        if (userId) {
            result = result.filter(c => c.user_id === Number(userId));
        }

        if (sessionId) {
            result = result.filter(c => c.session_id === sessionId);
        }

        return HttpResponse.json({ carts: result });
    }),

    // CREATE cart
    http.post("/plant/carts", async ({ request }) => {
        const body = await request.json() as {
            user_id: number | null;
            session_id: string | null;
        };

        const newCart =
            body.user_id !== null
                ? {
                    id: Date.now(),
                    user_id: body.user_id,
                    session_id: null,
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
                : {
                    id: Date.now(),
                    user_id: null,
                    session_id: body.session_id!,
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

        data.carts.push(newCart);
        return HttpResponse.json(newCart, { status: 201 });
    }),
];
