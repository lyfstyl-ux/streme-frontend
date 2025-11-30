import { SPAMMER_BLACKLIST, BLACKLISTED_TOKENS } from "@/src/lib/blacklist";

interface TrendingToken {
  username?: string;
  name?: string;
  symbol?: string;
  contract_address?: string;
  [key: string]: unknown;
}

export async function GET() {
  try {
    const headers = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
    };

    // Fetch trending tokens from the external API with a short timeout
    const controller = new AbortController();
    const timeoutMs = 5000; // 5 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(
        "https://api.streme.fun/api/tokens/trending?type=all",
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Streme/1.0",
          },
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      );
    }

    const trendingData: TrendingToken[] = await response.json();

    // Filter out blacklisted tokens and clean up symbols
    const filteredData = trendingData
      .filter((token) => {
        // Filter by spammer username
        if (token.username) {
          const username = token.username.toLowerCase();
          const isBlacklisted = SPAMMER_BLACKLIST.includes(username);
          if (isBlacklisted) return false;
        }
        // Filter by token address
        if (token.contract_address) {
          const tokenAddress = (token.contract_address as string).toLowerCase();
          const isBlacklisted = BLACKLISTED_TOKENS.includes(tokenAddress);
          if (isBlacklisted) return false;
        }
        return true;
      })
      .map((token) => {
        // Remove leading $ from symbol if present
        if (
          token.symbol &&
          typeof token.symbol === "string" &&
          token.symbol.startsWith("$")
        ) {
          return {
            ...token,
            symbol: token.symbol.substring(1),
          };
        }
        return token;
      });

    return Response.json(filteredData, { headers });
  } catch (error) {
    // Handle request timeout separately so callers can react accordingly
    // Node's fetch will throw an AbortError when the controller aborts.
    // Different runtimes may surface different error shapes, so check common patterns.
    const isTimeout =
      (error && typeof error === "object" && (error as any).name === "AbortError") ||
      (error && typeof error === "object" && (error as any).code === "ERR_ABORTED");

    if (isTimeout) {
      console.error("Trending fetch aborted (timeout)");
      return Response.json(
        { error: "Upstream request timed out" },
        { status: 504 }
      );
    }

    console.error("Error fetching trending tokens:", error);
    return Response.json(
      {
        error: "Failed to fetch trending tokens",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
