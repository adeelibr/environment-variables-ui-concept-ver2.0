"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, HelpCircle, Settings, Plus, FileText, Edit3, Trash2 } from "lucide-react"

interface WalkthroughStep {
  title: string
  content: string
  icon: React.ReactNode
  targetSelector?: string
  position?: "top" | "bottom" | "left" | "right" | "center"
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "Welcome to Environment Variables Manager",
    content: "This application helps you manage environment variables across different environments like development, staging, and production. Let's take a quick tour of the key features!",
    icon: <HelpCircle className="w-6 h-6" />,
    position: "center",
  },
  {
    title: "Environment Selection",
    content: "Use the environment selector to switch between different environments. Each environment has its own set of variables. You can also create new environments using the 'Add Environment' button.",
    icon: <Settings className="w-6 h-6" />,
    targetSelector: "[data-walkthrough='environment-selector']",
    position: "bottom",
  },
  {
    title: "Adding New Environments",
    content: "Click the 'Add Environment' button to create new environments like 'testing' or 'preview'. This helps organize your variables by deployment stage.",
    icon: <Plus className="w-6 h-6" />,
    targetSelector: "[data-walkthrough='add-environment']",
    position: "bottom",
  },
  {
    title: "Managing Variables",
    content: "Add new environment variables using the form below the environment selector. Enter a variable name (like API_KEY) and its value, then click 'Add Variable'.",
    icon: <Edit3 className="w-6 h-6" />,
    targetSelector: "[data-walkthrough='add-variable-form']",
    position: "top",
  },
  {
    title: "Editing & Deleting Variables",
    content: "In the variables table, you can edit values by clicking the edit icon, or delete variables using the trash icon. Click away or press Enter to save changes.",
    icon: <Trash2 className="w-6 h-6" />,
    targetSelector: "[data-walkthrough='variables-table']",
    position: "top",
  },
  {
    title: "Bulk Editor Mode",
    content: "For managing many variables at once, use the 'Bulk Editor' mode. This allows you to edit variables in a simple KEY=VALUE format, one per line.",
    icon: <FileText className="w-6 h-6" />,
    targetSelector: "[data-walkthrough='bulk-editor-toggle']",
    position: "bottom",
  },
]

interface WalkthroughProps {
  isOpen: boolean
  onClose: () => void
}

interface TargetElementInfo {
  x: number
  y: number
  width: number
  height: number
}

export function Walkthrough({ isOpen, onClose }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<TargetElementInfo | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    setTargetElement(null)
    onClose()
  }

  // Calculate target element position and update state
  useEffect(() => {
    if (!isOpen) return

    const currentStepData = walkthroughSteps[currentStep]
    if (currentStepData.targetSelector) {
      const element = document.querySelector(currentStepData.targetSelector) as HTMLElement
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetElement({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        })
      }
    } else {
      setTargetElement(null)
    }
  }, [currentStep, isOpen])

  // Calculate dialog position based on target element and step position
  const getDialogPosition = () => {
    const currentStepData = walkthroughSteps[currentStep]
    if (!targetElement || currentStepData.position === "center") {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }
    }

    const dialogWidth = 600 // Approximate dialog width
    const dialogHeight = 300 // Approximate dialog height
    const margin = 20

    let top = targetElement.y
    let left = targetElement.x
    let transform = ""

    switch (currentStepData.position) {
      case "top":
        top = targetElement.y - dialogHeight - margin
        left = targetElement.x + targetElement.width / 2
        transform = "translateX(-50%)"
        break
      case "bottom":
        top = targetElement.y + targetElement.height + margin
        left = targetElement.x + targetElement.width / 2
        transform = "translateX(-50%)"
        break
      case "left":
        top = targetElement.y + targetElement.height / 2
        left = targetElement.x - dialogWidth - margin
        transform = "translateY(-50%)"
        break
      case "right":
        top = targetElement.y + targetElement.height / 2
        left = targetElement.x + targetElement.width + margin
        transform = "translateY(-50%)"
        break
    }

    return {
      position: "fixed" as const,
      top: Math.max(margin, Math.min(window.innerHeight - dialogHeight - margin, top)),
      left: Math.max(margin, Math.min(window.innerWidth - dialogWidth - margin, left)),
      transform,
      zIndex: 9999,
    }
  }

  const currentStepData = walkthroughSteps[currentStep]

  if (!isOpen) return null

  return (
    <>
      {/* Dark overlay with spotlight effect */}
      {targetElement && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9998]"
          style={{
            background: `radial-gradient(
              circle at ${targetElement.x + targetElement.width / 2}px ${targetElement.y + targetElement.height / 2}px,
              transparent ${Math.max(targetElement.width, targetElement.height) / 2 + 10}px,
              rgba(0, 0, 0, 0.7) ${Math.max(targetElement.width, targetElement.height) / 2 + 40}px
            )`,
          }}
        />
      )}
      
      {/* Walkthrough Dialog */}
      <div
        ref={dialogRef}
        style={getDialogPosition()}
        className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                {currentStepData.icon}
              </div>
              <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-center space-x-2">
              {walkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Step content */}
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="text-foreground leading-relaxed">
                  {currentStepData.content}
                </p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {walkthroughSteps.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                {currentStep === walkthroughSteps.length - 1 ? (
                  <Button onClick={handleClose}>
                    Get Started
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function WalkthroughTrigger() {
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsWalkthroughOpen(true)}
        className="flex items-center gap-2"
      >
        <HelpCircle className="w-4 h-4" />
        Take Tour
      </Button>
      <Walkthrough
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />
    </>
  )
}