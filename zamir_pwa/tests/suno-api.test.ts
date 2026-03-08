/**
 * Tests for the Suno AI music generation API routes.
 *
 * These tests validate:
 * 1. /api/script — Lyrics + style generation from scripture
 * 2. /api/generate — Suno AI generation task submission + polling
 */

// Mock environment variables BEFORE imports
process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-gemini-key";
process.env.SUNO_API_KEY = "test-key";

// ─── Mock fetch globally ───
const originalFetch = global.fetch;
let mockFetchResponses: Array<{
  url: string | RegExp;
  response: any;
  ok?: boolean;
  status?: number;
}> = [];

function setupMockFetch() {
  global.fetch = jest.fn(async (url: any) => {
    const urlStr = typeof url === "string" ? url : url.toString();

    for (const mock of mockFetchResponses) {
      const matches =
        mock.url instanceof RegExp
          ? mock.url.test(urlStr)
          : urlStr.includes(mock.url as string);

      if (matches) {
        const isOk = mock.ok !== undefined ? mock.ok : true;
        const status = mock.status || (isOk ? 200 : 500);

        return {
          ok: isOk,
          status,
          json: async () => mock.response,
          text: async () => JSON.stringify(mock.response),
          headers: new Headers(),
          arrayBuffer: async () => new ArrayBuffer(0),
          blob: async () => new Blob(),
        } as any;
      }
    }

    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Not mocked: " + urlStr }),
      text: async () => "Not mocked: " + urlStr,
    } as any;
  }) as any;
}

// ─── Mock @google/generative-ai ───
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              lyrics:
                "[Verse 1]\nThe Lord is my shepherd\nI shall not want\n\n[Chorus]\nHe leadeth me beside still waters",
              style:
                "gospel worship, soulful female vocals, piano, strings, slow, peaceful",
              title: "The Lord Is My Shepherd",
            }),
        },
      }),
    }),
  })),
}));

// ─── Tests ───

describe("/api/script", () => {
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import("../src/app/api/script/route");
    POST = mod.POST;
  });

  it("should return 400 if no scripture text is provided", async () => {
    const req = new Request("http://localhost/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: "Peaceful", tempo: "Slow" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("No scripture provided");
  });

  it("should return valid lyrics, style, and title for valid input", async () => {
    const req = new Request("http://localhost/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "The Lord is my shepherd; I shall not want.",
        mood: "Peaceful",
        tempo: "Slow",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("lyrics");
    expect(data).toHaveProperty("style");
    expect(data).toHaveProperty("title");
    expect(data.lyrics.length).toBeGreaterThan(0);
    expect(data.lyrics.length).toBeLessThanOrEqual(3000);
    expect(data.style.length).toBeLessThanOrEqual(200);
    expect(data.title.length).toBeLessThanOrEqual(80);
  });

  it("should enforce character limits on style and title", async () => {
    const req = new Request("http://localhost/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Test scripture",
        mood: "Joyful",
        tempo: "Fast",
      }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(data.style.length).toBeLessThanOrEqual(200);
    expect(data.title.length).toBeLessThanOrEqual(80);
  });
});

describe("/api/generate", () => {
  let POST: (req: Request) => Promise<Response>;
  let POLL_CONFIG: any;

  beforeAll(async () => {
    const mod = await import("../src/app/api/generate/route");
    POST = mod.POST;
    POLL_CONFIG = mod.POLL_CONFIG;
    // Override sleep to be instant for testing
    POLL_CONFIG.sleep = async () => {};
    // Reduce max polls for faster tests
    POLL_CONFIG.maxPolls = 3;
  });

  beforeEach(() => {
    mockFetchResponses = [];
    setupMockFetch();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should return 500 if SUNO_API_KEY is not set", async () => {
    const savedKey = process.env.SUNO_API_KEY;
    delete process.env.SUNO_API_KEY;

    jest.resetModules();
    const freshMod = await import("../src/app/api/generate/route");
    // Also override sleep for fresh module
    freshMod.POLL_CONFIG.sleep = async () => {};
    freshMod.POLL_CONFIG.maxPolls = 3;

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyrics: "Test",
        style: "gospel",
        title: "Test",
      }),
    });

    const res = await freshMod.POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("SUNO_API_KEY");

    process.env.SUNO_API_KEY = savedKey;
  });

  it("should return 400 if lyrics are missing and not instrumental", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style: "gospel", title: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 if style is missing", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lyrics: "Test lyrics", title: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should submit a task and poll for results successfully", async () => {
    // IMPORTANT: record-info must be pushed FIRST so it matches before the
    // more-generic "api/v1/generate" pattern (since record-info URL also
    // contains "api/v1/generate").
    mockFetchResponses.push({
      url: "record-info",
      response: {
        code: 200,
        data: {
          taskId: "test-task-123",
          status: "SUCCESS",
          response: {
            sunoData: [
              {
                id: "track-1",
                audioUrl: "https://cdn.suno.ai/track1.mp3",
                streamAudioUrl: "https://cdn.suno.ai/stream-track1.mp3",
                imageUrl: "https://cdn.suno.ai/track1.jpg",
                title: "The Lord Is My Shepherd",
                tags: "gospel worship",
                duration: 180,
                prompt: "[Verse]\nThe Lord is my shepherd",
              },
            ],
          },
        },
      },
    });

    mockFetchResponses.push({
      url: "api/v1/generate",
      response: {
        code: 200,
        msg: "success",
        data: { taskId: "test-task-123" },
      },
    });

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyrics: "[Verse]\nThe Lord is my shepherd",
        style: "gospel worship, soulful vocals",
        title: "The Lord Is My Shepherd",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("SUCCESS");
    expect(data.taskId).toBe("test-task-123");
    expect(data.tracks).toHaveLength(1);
    expect(data.tracks[0].audioUrl).toContain("suno.ai");
    expect(data.tracks[0].streamUrl).toContain("stream");
    expect(data.tracks[0].title).toBe("The Lord Is My Shepherd");
  });

  it("should handle Suno generation errors gracefully", async () => {
    mockFetchResponses.push({
      url: "api/v1/generate",
      response: { error: "Rate limit exceeded" },
      ok: false,
      status: 429,
    });

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyrics: "Test",
        style: "gospel",
        title: "Test",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("should handle SENSITIVE_WORD_ERROR from Suno", async () => {
    mockFetchResponses.push({
      url: "record-info",
      response: {
        code: 200,
        data: {
          taskId: "test-sensitive-123",
          status: "SENSITIVE_WORD_ERROR",
          errorMessage: "Content contains restricted words",
        },
      },
    });

    mockFetchResponses.push({
      url: "api/v1/generate",
      response: {
        code: 200,
        data: { taskId: "test-sensitive-123" },
      },
    });

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyrics: "Sensitive content",
        style: "test",
        title: "Test",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toContain("restricted");
  });

  it("should return 408 on timeout when polling never succeeds", async () => {
    // Always return PENDING
    mockFetchResponses.push({
      url: "record-info",
      response: {
        code: 200,
        data: {
          taskId: "test-timeout-456",
          status: "PENDING",
        },
      },
    });

    mockFetchResponses.push({
      url: "api/v1/generate",
      response: {
        code: 200,
        data: { taskId: "test-timeout-456" },
      },
    });

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyrics: "Test lyrics",
        style: "gospel",
        title: "Test",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(408);
    const data = await res.json();
    expect(data.taskId).toBe("test-timeout-456");
  });
});
