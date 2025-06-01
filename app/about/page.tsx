"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const { tString } = useLanguage()

  const teamMembers = [
    {
      name: "Alisher Usmanov",
      role: tString("ceo"),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Malika Karimova",
      role: tString("designDirector"),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Rustam Azimov",
      role: tString("marketingManager"),
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Nilufar Rakhimova",
      role: tString("customerService"),
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const milestones = [
    {
      year: "2015",
      title: tString("foundingYear"),
      description: tString("foundingDesc"),
    },
    {
      year: "2017",
      title: tString("expansionYear"),
      description: tString("expansionDesc"),
    },
    {
      year: "2019",
      title: tString("onlineYear"),
      description: tString("onlineDesc"),
    },
    {
      year: "2022",
      title: tString("internationalYear"),
      description: tString("internationalDesc"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("aboutUs")}  
              </span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">{tString("aboutHeroText")}</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {tString("ourStory")}
                </span>
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>{tString("storyParagraph1")}</p>
                <p>{tString("storyParagraph2")}</p>
                <p>{tString("storyParagraph3")}</p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image src="/about.png" alt="Our Store" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("ourValues")}
              </span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{tString("valuesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tString("qualityValue")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tString("qualityDesc")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tString("customerValue")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tString("customerFocusDesc")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tString("excellenceValue")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tString("excellenceDesc")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tString("innovationValue")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tString("innovationDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("ourTeam")}
              </span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{tString("teamSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("ourJourney")}
              </span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{tString("journeySubtitle")}</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-600 to-pink-600" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
                >
                  <div className="md:w-1/2 p-4">
                    <div className={`md:${index % 2 === 0 ? "text-right md:pr-12" : "text-left md:pl-12"} space-y-2`}>
                      <div className="text-3xl font-bold text-purple-600">{milestone.year}</div>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 my-4 md:my-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-900" />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{tString("joinUs")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">{tString("joinUsDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                {tString("shopNow")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                {tString("contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
