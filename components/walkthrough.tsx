"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, HelpCircle, Settings, Plus, FileText, Edit3, Trash2 } from "lucide-react"

interface WalkthroughStep {
  title: string
  content: string
  icon: React.ReactNode
  highlight?: string
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "Welcome to Environment Variables Manager",
    content: "This application helps you manage environment variables across different environments like development, staging, and production. Let's take a quick tour of the key features!",
    icon: <HelpCircle className="w-6 h-6" />,
  },
  {
    title: "Environment Selection",
    content: "Use the environment selector to switch between different environments. Each environment has its own set of variables. You can also create new environments using the 'Add Environment' button.",
    icon: <Settings className="w-6 h-6" />,
    highlight: "environment-selector",
  },
  {
    title: "Adding New Environments",
    content: "Click the 'Add Environment' button to create new environments like 'testing' or 'preview'. This helps organize your variables by deployment stage.",
    icon: <Plus className="w-6 h-6" />,
    highlight: "add-environment",
  },
  {
    title: "Managing Variables",
    content: "Add new environment variables using the form below the environment selector. Enter a variable name (like API_KEY) and its value, then click 'Add Variable'.",
    icon: <Edit3 className="w-6 h-6" />,
    highlight: "add-variable-form",
  },
  {
    title: "Editing & Deleting Variables",
    content: "In the variables table, you can edit values by clicking the edit icon, or delete variables using the trash icon. Click away or press Enter to save changes.",
    icon: <Trash2 className="w-6 h-6" />,
    highlight: "variables-table",
  },
  {
    title: "Bulk Editor Mode",
    content: "For managing many variables at once, use the 'Bulk Editor' mode. This allows you to edit variables in a simple KEY=VALUE format, one per line.",
    icon: <FileText className="w-6 h-6" />,
    highlight: "bulk-editor-toggle",
  },
]

interface WalkthroughProps {
  isOpen: boolean
  onClose: () => void
}

export function Walkthrough({ isOpen, onClose }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)

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
    onClose()
  }

  const currentStepData = walkthroughSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                {currentStepData.icon}
              </div>
              <span>{currentStepData.title}</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
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