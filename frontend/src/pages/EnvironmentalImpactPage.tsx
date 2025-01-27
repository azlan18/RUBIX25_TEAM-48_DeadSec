import React, { useState, useEffect } from "react"
import { Leaf, ChartNoAxesCombined } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "framer-motion"

const EnvironmentalImpactPage = () => {
  const [purchaseData, setPurchaseData] = useState([])
  const [error, setError] = useState(null)
  const [averageEcoScore, setAverageEcoScore] = useState(null)

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const userId = localStorage.getItem("userId")

        if (!userId) {
          throw new Error("No user ID found")
        }

        const response = await fetch(`https://greengauge-zw9a.onrender.com/purchase-history/${userId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Full response:", data)

        setPurchaseData(data.purchases)

        // Calculate average eco score
        const totalEcoScore = data.purchases.reduce((sum, purchase) => {
          return sum + purchase.purchased.eco_score
        }, 0)
        const avgScore = totalEcoScore / data.purchases.length
        setAverageEcoScore(avgScore.toFixed(1))
      } catch (err) {
        console.error("Fetch Error:", err)
        setError(err.message)
      }
    }

    fetchPurchaseHistory()
  }, [])

  // Determine eco score rating
  const getEcoScoreRating = (score) => {
    if (score >= 8) return "Excellent"
    if (score >= 6) return "Good"
    if (score >= 4) return "Average"
    if (score >= 2) return "Poor"
    return "Very Poor"
  }

  const renderEcoScoreContainer = () => {
    if (averageEcoScore === null) {
      return <Skeleton className="w-full h-[200px] mb-6" />
    }

    const rating = getEcoScoreRating(parseFloat(averageEcoScore))

    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Your Eco Impact</CardTitle>
          <Leaf className="h-8 w-8 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-green-600">{averageEcoScore}</div>
            <div className="ml-4 text-lg text-muted-foreground">
              Average Eco Score
              <p className="text-sm text-green-500">{rating} Impact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const prepareMetricData = (metricKey) => {
    return purchaseData.map((purchase, index) => ({
      name: `Purchase ${index + 1}`,
      purchased: purchase.purchased[metricKey],
      alternative: purchase.alternative[metricKey],
    }))
  }

  const renderMetricChart = (metricKey, title, description) => {
    const chartData = prepareMetricData(metricKey)

    return (
      <Card key={metricKey} className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              purchased: {
                label: "Purchased Product",
                color: "hsl(var(--chart-1))",
              },
              alternative: {
                label: "Alternative Product",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-purchased)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-purchased)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorAlternative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-alternative)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-alternative)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="purchased"
                  stroke="var(--color-purchased)"
                  fillOpacity={1}
                  fill="url(#colorPurchased)"
                  name="Purchased Product"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="alternative"
                  stroke="var(--color-alternative)"
                  fillOpacity={1}
                  fill="url(#colorAlternative)"
                  name="Alternative Product"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-16">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-4"
        >
          <ChartNoAxesCombined className="w-4 h-4 text-[#D6F32F]" />
          <span className="text-sm font-medium">Metrics</span>
        </motion.div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Environmental Impact Comparison</h1>

      {renderEcoScoreContainer()}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {purchaseData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMetricChart(
            "eco_score",
            "Eco Score Comparison",
            "Compare the eco scores of purchased and alternative products",
          )}
          {renderMetricChart(
            "water_usage",
            "Water Usage Comparison",
            "Compare the water usage of purchased and alternative products",
          )}
          {renderMetricChart(
            "carbon_footprint",
            "Carbon Footprint Comparison",
            "Compare the carbon footprint of purchased and alternative products",
          )}
          {renderMetricChart(
            "waste_generated",
            "Waste Generation Comparison",
            "Compare the waste generated by purchased and alternative products",
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      )}
    </div>
  )
}

export default EnvironmentalImpactPage
