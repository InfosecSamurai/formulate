"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, Copy, Download, FileText, Crown } from "lucide-react"
import Image from "next/image"

const letterTypes = ["Credit Dispute", "Job Resignation", "Tenant Complaint", "Debt Validation", "Legal Notice"]

const letterTemplates = {
  "Credit Dispute": `Dear {recipientName},

I am writing to formally dispute an item on my credit report. After reviewing my credit report, I have identified an error that needs to be corrected.

{situationDetails}

I am requesting that this item be investigated and removed from my credit report if it cannot be verified as accurate and complete.

Please provide me with written confirmation of the results of your investigation within 30 days as required by the Fair Credit Reporting Act.

Sincerely,
{senderName}
{date}`,

  "Job Resignation": `Dear {recipientName},

Please accept this letter as my formal notice of resignation from my position. My last day of work will be {date}.

{situationDetails}

I am committed to ensuring a smooth transition and will do everything possible to complete my current projects and assist in training my replacement.

Thank you for the opportunities for professional and personal growth during my time here.

Sincerely,
{senderName}`,

  "Tenant Complaint": `Dear {recipientName},

I am writing to bring to your attention an issue with my rental property that requires immediate attention.

{situationDetails}

As my landlord, I am requesting that you address this matter promptly. Please contact me to discuss a resolution and timeline for repairs.

I look forward to your prompt response.

Sincerely,
{senderName}
Tenant
{date}`,

  "Debt Validation": `Dear {recipientName},

This letter is in response to your recent collection notice. I am requesting validation of this debt as allowed under the Fair Debt Collection Practices Act.

{situationDetails}

Please provide:
1. Proof that you own this debt
2. Copy of the original signed agreement
3. Complete payment history
4. Verification of the debt amount

Until this debt is validated, please cease all collection activities.

Sincerely,
{senderName}
{date}`,

  "Legal Notice": `Dear {recipientName},

This letter serves as formal notice regarding the following matter:

{situationDetails}

Please be advised that failure to respond appropriately within a reasonable time may result in further legal action.

I request your immediate attention to this matter.

Sincerely,
{senderName}
{date}`,
}

export default function FormulateApp() {
  const [letterType, setLetterType] = useState("")
  const [senderName, setSenderName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [situationDetails, setSituationDetails] = useState("")
  const [includeAddress, setIncludeAddress] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const generateLetter = () => {
    if (!letterType || !letterTemplates[letterType as keyof typeof letterTemplates]) return ""

    let template = letterTemplates[letterType as keyof typeof letterTemplates]
    template = template.replace(/{senderName}/g, senderName || "[Your Name]")
    template = template.replace(/{recipientName}/g, recipientName || "[Recipient Name]")
    template = template.replace(/{date}/g, date)
    template = template.replace(/{situationDetails}/g, situationDetails || "[Please describe your situation in detail]")

    return template
  }

  const handleCopyLetter = async () => {
    const letter = generateLetter()
    await navigator.clipboard.writeText(letter)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    const letter = generateLetter()
    const blob = new Blob([letter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${letterType || "letter"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePremiumUpgrade = () => {
    // In a real app, this would integrate with Stripe
    alert("Premium upgrade coming soon! This would integrate with Stripe Checkout.")
  }

  return (
    <div className="min-h-screen bg-[#1e2a38] text-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="border-b border-[#273746] bg-[#1e2a38]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Formulate Logo" width={32} height={32} />
            <h1 className="text-2xl font-bold">Formulate</h1>
          </div>
          <Button
            onClick={handlePremiumUpgrade}
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium transition-colors"
          >
            <Crown className="w-4 h-4 mr-2" />
            Premium Upgrade
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Generate Custom Letters Instantly</h2>
          <p className="text-xl text-[#d0d0d0] mb-8 max-w-2xl mx-auto">
            Dispute, resign, and communicate professionally in seconds.
          </p>
          <Button
            size="lg"
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium px-8 py-3 text-lg transition-colors"
            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start Now
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div id="form-section" className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-[#273746] border-[#273746] shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Letter Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Letter Type */}
              <div className="space-y-2">
                <Label htmlFor="letter-type" className="text-white font-medium">
                  Letter Type
                </Label>
                <Select value={letterType} onValueChange={setLetterType}>
                  <SelectTrigger className="bg-[#1e2a38] border-[#1e2a38] text-white">
                    <SelectValue placeholder="Select letter type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e2a38] border-[#273746]">
                    {letterTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-[#273746]">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sender Name */}
              <div className="space-y-2">
                <Label htmlFor="sender-name" className="text-white font-medium">
                  Your Name
                </Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-[#1e2a38] border-[#1e2a38] text-white placeholder:text-[#d0d0d0] focus:border-[#2ecc71]"
                />
              </div>

              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="recipient-name" className="text-white font-medium">
                  Recipient Name
                </Label>
                <Input
                  id="recipient-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's name"
                  className="bg-[#1e2a38] border-[#1e2a38] text-white placeholder:text-[#d0d0d0] focus:border-[#2ecc71]"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white font-medium">
                  Date
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-[#1e2a38] border-[#1e2a38] text-white focus:border-[#2ecc71]"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#d0d0d0] pointer-events-none" />
                </div>
              </div>

              {/* Situation Details */}
              <div className="space-y-2">
                <Label htmlFor="situation" className="text-white font-medium">
                  Situation Details
                </Label>
                <Textarea
                  id="situation"
                  value={situationDetails}
                  onChange={(e) => setSituationDetails(e.target.value)}
                  placeholder="Describe your situation in detail..."
                  rows={4}
                  className="bg-[#1e2a38] border-[#1e2a38] text-white placeholder:text-[#d0d0d0] focus:border-[#2ecc71] resize-none"
                />
              </div>

              {/* Include Address Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-address"
                  checked={includeAddress}
                  onCheckedChange={setIncludeAddress}
                  className="data-[state=checked]:bg-[#2ecc71]"
                />
                <Label htmlFor="include-address" className="text-white font-medium">
                  Include address block
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="bg-[#273746] border-[#273746] shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-6 rounded-lg min-h-[400px] font-mono text-sm leading-relaxed">
                <pre className="whitespace-pre-wrap">{generateLetter()}</pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleCopyLetter}
                  variant="outline"
                  className="flex-1 border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Letter
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="flex-1 border-[#2ecc71] text-[#2ecc71] hover:bg-[#2ecc71] hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handlePremiumUpgrade}
                  className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium transition-colors"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Unlock Premium Templates
                </Button>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="mt-4 p-3 bg-[#2ecc71] text-white rounded-lg text-center font-medium">
                  Letter copied to clipboard!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#273746] py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-[#d0d0d0] text-sm">© 2024 Formulate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
