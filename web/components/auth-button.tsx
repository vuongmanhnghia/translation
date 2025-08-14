"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogIn, LogOut, Loader2 } from "lucide-react"

export function AuthButton() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAuth = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!isSignedIn) {
        setIsSignedIn(true)
        toast({
          title: "Signed in successfully!",
          description: "Welcome to TranslateAI",
        })
      } else {
        setIsSignedIn(false)
        toast({
          title: "Signed out",
          description: "You have been signed out",
        })
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 glow-effect"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : isSignedIn ? (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Sign in with Google
        </>
      )}
    </Button>
  )
}
