"use client"

import { Languages } from "lucide-react"
import { TranslationCard } from "@/components/translation-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { Toaster } from "@/components/ui/toaster"

export default function TranslationPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      <div className="absolute inset-0 bg-dots-pattern opacity-20"></div>
      <div className="absolute inset-0 gradient-overlay-1"></div>
      <div className="floating-shapes"></div>

      {/* Header */}
      <header className="relative z-10 border-b glass-effect transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 glow-effect">
              <Languages className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              TranslateAI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Translate Text Instantly
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto transition-colors duration-300 leading-relaxed">
              Powered by advanced AI for accurate, natural translations across 12+ languages. Fast, reliable, and
              completely free to use.
            </p>
          </div>

          <div className="mb-16">
            <TranslationCard />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl glass-effect transition-all duration-300 hover:scale-105 glow-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Languages className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">12+ Languages</h3>
              <p className="text-muted-foreground transition-colors duration-300 leading-relaxed">
                Support for major world languages with high accuracy and natural context understanding
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl glass-effect transition-all duration-300 hover:scale-105 glow-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Powered</h3>
              <p className="text-muted-foreground transition-colors duration-300 leading-relaxed">
                Advanced neural networks for natural, contextual translations that understand nuance
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl glass-effect transition-all duration-300 hover:scale-105 glow-effect">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 border-3 border-primary rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
              <p className="text-muted-foreground transition-colors duration-300 leading-relaxed">
                Get translations in seconds with real-time processing and lightning-fast responses
              </p>
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
