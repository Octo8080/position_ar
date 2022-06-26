import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";

const bearerToken = Deno.env.get("SUPABASE_BEARER_TOKEN") as string;
const apiEndPoint = Deno.env.get("SUPABASE_API_ENDPOINT") as string;

console.log(bearerToken);
console.log(apiEndPoint);

const app = new Application();
const router = new Router();

// GET /api/position は、supabeseから届いた結果を詰めなおして送る
router.get("/api/position", async (ctx: Context) => {
  const result = await fetch(
    apiEndPoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );
  const resultJson = await result.json();

  ctx.response.body = resultJson;
  ctx.response.status = 200;
  ctx.response.type = "application/json";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context:Context, next: ()=> Promise<unknown>) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

await app.listen({ port: 8080 });
