export async function onRequest(context) {
  const { request, env, params } = context;

  const type = params.type;

  if (type !== "movie" && type !== "tv") {
    return new Response("Invalid type", { status: 400 });
  }

  const incoming = new URL(request.url);
  const allowed = [
    "language",
    "sort_by",
    "include_adult",
    "vote_count.gte",
    "page",
    "with_genres",
    "with_origin_country"
  ];

  const tmdb = new URL(
    `https://api.themoviedb.org/3/discover/${type}`
  );

  for (const key of allowed) {
    const value = incoming.searchParams.get(key);
    if (value !== null) {
      tmdb.searchParams.set(key, value);
    }
  }

  tmdb.searchParams.set("api_key", env.TMDB_API_KEY);

  const response = await fetch(tmdb.toString());

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
