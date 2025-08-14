"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Languages, ArrowRightLeft, Copy, Trash2, Volume2, CheckCircle, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// SERVER_HOST

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

interface TranslationResult {
  translatedText: string
  detectedSourceLang?: string
  confidence?: number
  charactersTranslated?: number
}

export function TranslationCard() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("vi")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null)
  const { toast } = useToast()

  const languages = [
    { code: "auto", name: "Auto-detect", flag: "🌐" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
  ]

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return languages.find((lang) => lang.code === code)?.flag || "🌐"
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to translate",
        variant: "destructive",
      })
      return
    }

    if (sourceLang !== "auto" && sourceLang === targetLang) {
      toast({
        title: "Error",
        description: "Source and target languages cannot be the same",
        variant: "destructive",
      })
      return
    }

    console.log("sourceText", [sourceText])

    setIsTranslating(true)
    setTranslationResult(null)

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [sourceText],
          // source_lang: sourceLang,
          target_lang: targetLang,
        }),
      })

      const data = await response.json()

      console.log("data", data)

      if (!response.ok) {
        throw new Error(data.error || "Translation failed")
      }

      console.log("data", data.translations[0].text)

      setTranslatedText(data.translations[0].text)
      setTranslationResult(data)

      toast({
        title: "Translation Complete",
        description: `Successfully translated ${data.charactersTranslated} characters`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    if (sourceLang === "auto") {
      toast({
        title: "Cannot swap",
        description: "Cannot swap when auto-detect is selected",
        variant: "destructive",
      })
      return
    }

    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)

    const tempText = sourceText
    setSourceText(translatedText)
    setTranslatedText(tempText)
    setTranslationResult(null)
  }

  const copyToClipboard = async () => {
    if (!translatedText) return

    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const clearAll = () => {
    setSourceText("")
    setTranslatedText("")
    setTranslationResult(null)
  }

  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "auto" ? "en" : lang
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-2 glow-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Languages className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI Translation Tool
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {sourceText.length}/5000
            </Badge>
            {translationResult && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {Math.round((translationResult.confidence || 0) * 100)}% confident
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>Enter your text below and select languages for instant AI-powered translation</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Language Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">From</label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={swapLanguages}
            className="mt-6 bg-transparent hover:bg-primary/10 transition-colors"
            disabled={isTranslating || sourceLang === "auto"}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">To</label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter((lang) => lang.code !== "auto")
                  .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto-detected language info */}
        {translationResult?.detectedSourceLang && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Detected language: {getLanguageName(translationResult.detectedSourceLang)}
            </span>
          </div>
        )}

        {/* Text Areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Source Text ({sourceLang === "auto" ? "Auto-detect" : getLanguageName(sourceLang)})
              </label>
              <div className="flex items-center gap-2">
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(sourceText, sourceLang)}
                    className="h-8 w-8 p-0"
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[200px] resize-none text-base"
              maxLength={5000}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Translation ({getLanguageName(targetLang)})</label>
              <div className="flex items-center gap-2">
                {translatedText && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(translatedText, targetLang)}
                      className="h-8 w-8 p-0"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
                      {copied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Textarea
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[200px] resize-none bg-muted/50 text-base"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating || (sourceLang !== "auto" && sourceLang === targetLang)}
            size="lg"
            className="px-8 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isTranslating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Translating...
              </>
            ) : (
              <>
                <Languages className="h-4 w-4 mr-2" />
                Translate
              </>
            )}
          </Button>

          {(sourceText || translatedText) && (
            <Button variant="outline" onClick={clearAll} size="lg" className="w-full sm:w-auto bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Translation Info */}
        {translationResult && (
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Translation completed • {translationResult.charactersTranslated} characters</p>
            {translationResult.confidence && <p>Confidence: {Math.round(translationResult.confidence * 100)}%</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
