"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Edit3, FileText, Settings } from "lucide-react"
import { WalkthroughTrigger } from "@/components/walkthrough"

interface EnvData {
  [envName: string]: {
    [key: string]: string
  }
}

interface AppState {
  currentEnvSelected: string
  data: EnvData
}

export default function EnvironmentCRM() {
  const [state, setState] = useState<AppState>({
    currentEnvSelected: "development",
    data: {
      development: {
        DATABASE_URL: "postgresql://localhost:5432/dev",
        API_KEY: "dev-api-key-123",
        DEBUG: "true",
      },
      staging: {
        DATABASE_URL: "postgresql://staging.db.com:5432/staging",
        API_KEY: "staging-api-key-456",
      },
      production: {
        DATABASE_URL: "postgresql://prod.db.com:5432/prod",
        API_KEY: "prod-api-key-789",
        DEBUG: "false",
      },
    },
  })

  const [isBulkMode, setIsBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [newEnvName, setNewEnvName] = useState("")
  const [editingVar, setEditingVar] = useState<{ key: string; value: string } | null>(null)
  const [newVar, setNewVar] = useState({ key: "", value: "" })

  const currentEnvData = state.data[state.currentEnvSelected] || {}

  const handleEnvChange = (envName: string) => {
    setState((prev) => ({ ...prev, currentEnvSelected: envName }))
  }

  const handleAddEnvironment = () => {
    if (newEnvName && !state.data[newEnvName]) {
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, [newEnvName]: {} },
        currentEnvSelected: newEnvName,
      }))
      setNewEnvName("")
    }
  }

  const handleAddVariable = () => {
    if (newVar.key && newVar.value) {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [prev.currentEnvSelected]: {
            ...prev.data[prev.currentEnvSelected],
            [newVar.key]: newVar.value,
          },
        },
      }))
      setNewVar({ key: "", value: "" })
    }
  }

  const handleDeleteVariable = (key: string) => {
    setState((prev) => {
      const newData = { ...prev.data }
      delete newData[prev.currentEnvSelected][key]
      return { ...prev, data: newData }
    })
  }

  const handleUpdateVariable = (oldKey: string, newKey: string, newValue: string) => {
    setState((prev) => {
      const newData = { ...prev.data }
      delete newData[prev.currentEnvSelected][oldKey]
      newData[prev.currentEnvSelected][newKey] = newValue
      return { ...prev, data: newData }
    })
    setEditingVar(null)
  }

  const handleBulkModeToggle = () => {
    if (!isBulkMode) {
      // Entering bulk mode - populate textarea
      const envVars = Object.entries(currentEnvData)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
      setBulkText(envVars)
    }
    setIsBulkMode(!isBulkMode)
  }

  const handleBulkSave = () => {
    try {
      const lines = bulkText.split("\n").filter((line) => line.trim())
      const newEnvData: { [key: string]: string } = {}

      lines.forEach((line) => {
        const [key, ...valueParts] = line.split("=")
        if (key && valueParts.length > 0) {
          newEnvData[key.trim()] = valueParts.join("=").trim()
        }
      })

      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [prev.currentEnvSelected]: newEnvData,
        },
      }))
      setIsBulkMode(false)
    } catch (error) {
      alert("Invalid format. Please use KEY=VALUE format, one per line.")
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Environment Variables</h1>
            <p className="text-muted-foreground text-lg">Manage your application configurations</p>
          </div>
          <div className="flex items-center gap-4">
            <WalkthroughTrigger />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Environment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Environment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="env-name">Environment Name</Label>
                    <Input
                      id="env-name"
                      value={newEnvName}
                      onChange={(e) => setNewEnvName(e.target.value)}
                      placeholder="e.g., testing, preview"
                    />
                  </div>
                  <Button onClick={handleAddEnvironment} className="w-full">
                    Create Environment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Environment Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Current Environment
              </CardTitle>
              <Button onClick={handleBulkModeToggle} variant={isBulkMode ? "default" : "outline"} size="sm">
                <FileText className="w-4 h-4 mr-2" />
                {isBulkMode ? "Table View" : "Bulk Editor"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Select value={state.currentEnvSelected} onValueChange={handleEnvChange}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(state.data).map((env) => (
                  <SelectItem key={env} value={env}>
                    {env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Main Content */}
        {isBulkMode ? (
          /* Bulk Editor Mode */
          <Card>
            <CardHeader>
              <CardTitle>Bulk Editor - {state.currentEnvSelected}</CardTitle>
              <p className="text-sm text-muted-foreground">Edit variables in KEY=VALUE format, one per line</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="DATABASE_URL=postgresql://localhost:5432/mydb&#10;API_KEY=your-api-key&#10;DEBUG=true"
              />
              <div className="flex gap-4">
                <Button onClick={handleBulkSave} size="lg">
                  Save Changes
                </Button>
                <Button onClick={() => setIsBulkMode(false)} variant="outline" size="lg">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Table View Mode */
          <Card>
            <CardHeader>
              <CardTitle>Variables - {state.currentEnvSelected}</CardTitle>
              <p className="text-sm text-muted-foreground">{Object.keys(currentEnvData).length} variables configured</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Variable */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card/50 rounded-lg border">
                <div>
                  <Label htmlFor="new-key">Variable Name</Label>
                  <Input
                    id="new-key"
                    value={newVar.key}
                    onChange={(e) => setNewVar((prev) => ({ ...prev, key: e.target.value }))}
                    placeholder="VARIABLE_NAME"
                  />
                </div>
                <div>
                  <Label htmlFor="new-value">Value</Label>
                  <Input
                    id="new-value"
                    value={newVar.value}
                    onChange={(e) => setNewVar((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="variable-value"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddVariable} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>
              </div>

              {/* Variables Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Variable Name</TableHead>
                      <TableHead className="font-semibold">Value</TableHead>
                      <TableHead className="font-semibold w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(currentEnvData).map(([key, value]) => (
                      <TableRow key={key} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono font-medium">{key}</TableCell>
                        <TableCell className="font-mono text-muted-foreground max-w-md truncate">
                          {editingVar?.key === key ? (
                            <Input
                              value={editingVar.value}
                              onChange={(e) =>
                                setEditingVar((prev) => (prev ? { ...prev, value: e.target.value } : null))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleUpdateVariable(key, key, editingVar.value)
                                }
                                if (e.key === "Escape") {
                                  setEditingVar(null)
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            value
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingVar({ key, value })}>
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteVariable(key)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {Object.keys(currentEnvData).length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">No environment variables configured yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
