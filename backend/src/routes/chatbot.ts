import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product";

const router = Router();

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000)
});

const chatbotSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(chatMessageSchema).max(8).optional()
});

type AzureResponsesApiResponse = {
  output?: Array<{
    type?: string;
    role?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

router.post("/", async (req, res, next) => {
  try {
    const data = chatbotSchema.parse(req.body);
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!endpoint || !apiKey || !deployment) {
      res.status(503).json({ message: "Chatbot is not configured" });
      return;
    }

    // Retrieve active products from database to ground the LLM
    const dbProducts = await Product.find({}).select(
      "name price brand category description specs slug"
    );

    const catalogSummary = dbProducts
      .map(
        (p) =>
          `- Tên: ${p.name} | Slug: ${p.slug} | Thương hiệu: ${p.brand} | Giá: ${p.price.toLocaleString("vi-VN")} VND | Phân khúc: ${p.category} | Nổi bật: ${p.description} | Specs: Màn hình ${p.specs.display}, Chip ${p.specs.chip}, Camera ${p.specs.camera}, Pin ${p.specs.battery}, Chất liệu ${p.specs.material}`
      )
      .join("\n");

    const instructions = `
Bạn là nhân viên tư vấn bán điện thoại thân thiện, nhiệt tình tại cửa hàng HeliCorp. 

Đây là danh sách TOÀN BỘ sản phẩm thực tế đang kinh doanh:
${catalogSummary}

QUY TẮC PHẢN HỒI:
1. Bạn CHỈ được giới thiệu các sản phẩm có trong danh sách trên. TUYỆT ĐỐI không giới thiệu hay bịa đặt bất kỳ sản phẩm nào khác không nằm trong danh sách.
2. Trả lời cực kỳ ngắn gọn, tự nhiên, văn phong như tư vấn viên trực tiếp tại cửa hàng. Mỗi câu trả lời phải dưới 120 từ.
3. KHÔNG sử dụng định dạng Markdown tiêu đề (#, ##, ###), bảng biểu, danh sách quá dài, hoặc viết văn quá dài dòng.
4. Khi tư vấn sản phẩm, chỉ hiển thị tối đa 3 sản phẩm phù hợp nhất. Với mỗi sản phẩm, chỉ nêu rõ tên sản phẩm, điểm nổi bật và lý do nên chọn trong 1-2 câu ngắn, kèm giá tiền rõ ràng.
5. Nếu giới thiệu sản phẩm, bạn bắt buộc phải đính kèm thẻ sản phẩm vào cuối câu trả lời bằng cách viết cú pháp: [ProductCard: <slug-san-pham>] (ví dụ: [ProductCard: iphone-16-pro]). Bạn có thể đính kèm tối đa 3 thẻ sản phẩm trong một phản hồi.
6. Cuối mỗi câu trả lời luôn kết thúc bằng một câu hỏi gợi mở ngắn gọn (ví dụ hỏi về thương hiệu yêu thích, khoảng giá, màu sắc hoặc nhu cầu sử dụng) để khuyến khích khách hàng tiếp tục tương tác.
7. Trả lời cùng ngôn ngữ khách hàng dùng (mặc định tiếng Việt).
`;

    const input = [
      ...(data.history ?? []),
      {
        role: "user",
        content: data.message
      }
    ];

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        model: deployment,
        instructions,
        input,
        temperature: 0.3,
        max_output_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chatbot provider error:", response.status, errorText);
      res.status(502).json({ message: "Chatbot provider failed", status: response.status, details: errorText });
      return;
    }

    const result = (await response.json()) as AzureResponsesApiResponse;
    const replyObj = result.output?.[0]?.content?.find((c: any) => c.type === "output_text");
    const reply = replyObj?.text?.trim();

    if (!reply) {
      res.status(502).json({ message: "Chatbot provider returned an empty response" });
      return;
    }

    res.json({ reply });
  } catch (error) {
    next(error);
  }
});

export default router;
