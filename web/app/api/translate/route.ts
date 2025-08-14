import { type NextRequest, NextResponse } from "next/server";

// Mock translation data for demonstration
const mockTranslations: Record<string, Record<string, string>> = {
	en: {
		vi: "Xin chào, đây là bản dịch tiếng Việt",
		zh: "你好，这是中文翻译",
		ja: "こんにちは、これは日本語の翻訳です",
		ko: "안녕하세요, 이것은 한국어 번역입니다",
		fr: "Bonjour, ceci est une traduction française",
		de: "Hallo, das ist eine deutsche Übersetzung",
		es: "Hola, esta es una traducción al español",
		it: "Ciao, questa è una traduzione italiana",
		pt: "Olá, esta é uma tradução em português",
		ru: "Привет, это русский перевод",
		ar: "مرحبا، هذه ترجمة عربية",
	},
	vi: {
		en: "Hello, this is an English translation",
		zh: "你好，这是中文翻译",
		ja: "こんにちは、これは日本語の翻訳です",
		ko: "안녕하세요, 이것은 한국어 번역입니다",
		fr: "Bonjour, ceci est une traduction française",
		de: "Hallo, das ist eine deutsche Übersetzung",
		es: "Hola, esta es una traducción al español",
	},
};

// Language detection patterns
const languagePatterns: Record<string, RegExp[]> = {
	vi: [
		/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
	],
	zh: [/[\u4e00-\u9fff]/],
	ja: [/[\u3040-\u309f\u30a0-\u30ff]/],
	ko: [/[\uac00-\ud7af]/],
	ar: [/[\u0600-\u06ff]/],
	ru: [/[а-яё]/i],
};

function detectLanguage(text: string): string {
	for (const [lang, patterns] of Object.entries(languagePatterns)) {
		if (patterns.some((pattern) => pattern.test(text))) {
			return lang;
		}
	}
	return "en"; // Default to English
}

function simulateTranslation(
	text: string,
	sourceLang: string,
	targetLang: string
): string {
	// If we have mock data, use it
	if (mockTranslations[sourceLang]?.[targetLang]) {
		const translatedText = `${
			mockTranslations[sourceLang][targetLang]
		} (${text.slice(0, 20)}...)`;
		console.log("translatedText", translatedText);
		return translatedText;
	}

	// Otherwise, create a realistic mock translation
	const prefixes: Record<string, string> = {
		vi: "Bản dịch tiếng Việt:",
		zh: "中文翻译:",
		ja: "日本語翻訳:",
		ko: "한국어 번역:",
		fr: "Traduction française:",
		de: "Deutsche Übersetzung:",
		es: "Traducción al español:",
		it: "Traduzione italiana:",
		pt: "Tradução em português:",
		ru: "Русский перевод:",
		ar: "الترجمة العربية:",
		en: "English translation:",
	};

	const prefix = prefixes[targetLang] || "Translation:";
	return `${prefix} ${text}`;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { text, sourceLang, targetLang } = body;

		// Validation
		if (!text || !sourceLang || !targetLang) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		if (text.length > 5000) {
			return NextResponse.json(
				{ error: "Text too long. Maximum 5000 characters." },
				{ status: 400 }
			);
		}

		if (sourceLang === targetLang) {
			return NextResponse.json(
				{ error: "Source and target languages cannot be the same" },
				{ status: 400 }
			);
		}

		// Auto-detect language if source is 'auto'
		let detectedSourceLang = sourceLang;
		if (sourceLang === "auto") {
			detectedSourceLang = detectLanguage(text);
		}

		// Simulate API delay
		// await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

		// Simulate translation
		const translatedText = simulateTranslation(
			text,
			detectedSourceLang,
			targetLang
		);

		// Simulate occasional errors for realism
		if (Math.random() < 0.05) {
			return NextResponse.json(
				{ error: "Translation service temporarily unavailable" },
				{ status: 503 }
			);
		}

		return NextResponse.json({
			translatedText,
			detectedSourceLang:
				sourceLang === "auto" ? detectedSourceLang : undefined,
			confidence: 0.95 + Math.random() * 0.05, // Mock confidence score
			charactersTranslated: text.length,
		});
	} catch (error) {
		console.error("Translation API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
