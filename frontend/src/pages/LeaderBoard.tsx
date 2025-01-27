"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, User, Loader2, Leaf } from "lucide-react"
import { Toaster } from "react-hot-toast"

interface LeaderboardUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  eco_score: number
  avatar?: string
}

const LeaderboardPage: React.FC = () => {
  // Hardcoded leaderboard data
  const [users, setUsers] = useState<LeaderboardUser[]>([
    { _id: "67924ff09f81db52be300e6f", username: "azlankhawar@gmail.com", firstName: "Azlan", lastName: "Khawar", eco_score: 9.2},
    { _id: "67926791bc21247ac2ee4dae", username: "elonmusk@gmail.com", firstName: "Elon", lastName: "Musk", eco_score: 8.6 },
    { _id: "679287492132e6bbd07bedc6", username: "joebiden@gmail.com", firstName: "Joe", lastName: "Biden", eco_score: 7.5},
    { _id: "67929283016c8f5babba6557", username: "scarlett@gmail.com", firstName: "Scarlett", lastName: "Johanson", eco_score: 7.5 },
    { _id: "6792a65349debf611462fc90", username: "john@gmail.com", firstName: "John", lastName: "Cena", eco_score: 7.4 },
    { _id: "67921b492a800c5e09763d66", username: "cristiano@gmail.com", firstName: "Cristiano", lastName: "Ronaldo", eco_score: 6.7 },
    { _id: "67921fd408232db70bcc6926", username: "varad@gmail.com", firstName: "Varad", lastName: "Sankhe", eco_score: 6.6 },
    { _id: "679220a508232db70bcc6929", username: "shubham@gmail.com", firstName: "Shubham", lastName: "Mourya", eco_score: 5.2 },
  ])

  const [loading, setLoading] = useState(false)

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-[#D6F32F]" />
      case 1:
        return <Medal className="h-6 w-6 text-[#D6F32F]" />
      case 2:
        return <Medal className="h-6 w-6 text-[#D6F32F]" />
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-[#D6F32F] text-[#151616] flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        )
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const renderLeaderboardItem = (user: LeaderboardUser, index: number) => (
    <motion.div
      key={user._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-6 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] mb-4 overflow-hidden transition-all hover:shadow-[2px_2px_0px_0px_#151616] hover:-translate-y-[2px] hover:-translate-x-[2px]"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{getPositionIcon(index)}</div>
        <div className="h-12 w-12 rounded-full bg-[#D6F32F] border-2 border-[#151616] flex items-center justify-center text-[#151616] font-bold">
          {user.avatar ? (
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.username}
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            getInitials(user.firstName, user.lastName)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#151616] truncate">{user.username}</p>
          <p className="text-xs text-[#151616]/70 truncate">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-[#D6F32F]" />
            <span className="text-sm font-bold text-[#151616]">{user.eco_score}</span>
          </div>
          <div className="w-24 sm:w-32 bg-[#151616] rounded-full h-2">
            <div className="bg-[#D6F32F] h-2 rounded-full" style={{ width: `${user.eco_score*10}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-24 bg-[#ffffff] relative overflow-hidden mt-16">
      <Toaster position="top-right" />
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-4"
            >
              <Trophy className="w-4 h-4 text-[#D6F32F]" />
              <span className="text-sm font-medium">Eco-Score Leaderboard</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] space-y-6"
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#D6F32F]" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-[#151616]">No users found</p>
            ) : (
              users.map((user, index) => renderLeaderboardItem(user, index))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LeaderboardPage
