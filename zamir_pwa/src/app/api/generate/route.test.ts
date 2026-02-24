import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock global fetch to intercept ElevenLabs API calls
global.fetch = jest.fn();

describe("POST /api/generate", () => {
  const mockApiUrl = "https://api.elevenlabs.io/v1/text-to-speech/";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ELEVENLABS_API_KEY = "test_api_key";
  });

  const createMockRequest = (body: Record<string, any>) => {
    return new NextRequest("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify(body),
    }) as unknown as Request;
  };

  it("should generate audio with default voiceId when not provided", async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => mockArrayBuffer,
    });

    const req = createMockRequest({ text: "Hello world" });
    const res = await POST(req);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}21m00Tcm4TlvDq8ikWAM`, // Default voiceId
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": "test_api_key",
        },
        body: JSON.stringify({
          text: "Hello world",
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(res.headers.get("Content-Length")).toBe(
      mockArrayBuffer.byteLength.toString(),
    );
  });

  it("should generate audio with provided voiceId", async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => mockArrayBuffer,
    });

    const req = createMockRequest({
      text: "Hello world",
      voiceId: "custom_voice_id",
    });
    const res = await POST(req);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}custom_voice_id`,
      expect.any(Object),
    );

    expect(res.status).toBe(200);
  });

  it("should return 500 when ElevenLabs API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    });

    const req = createMockRequest({ text: "Hello world" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("ElevenLabs API error: Unauthorized");
  });

  it("should return 500 when fetch throws an network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network failure"),
    );

    const req = createMockRequest({ text: "Hello world" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("Network failure");
  });
});
