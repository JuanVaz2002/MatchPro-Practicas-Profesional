"use client"
import { useAuth } from "../../contexts/AuthContext"
import {
  User,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Upload,
  Search,
  FolderOpen,
  Linkedin,
  UserPlus,
  UsersRound,
  Building2
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth()

  const candidateMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "upload-cv", label: "Upload CV", icon: Upload },
    { id: "job-search", label: "Job Search", icon: Search },
  ]

  const employerMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "clients", label: "Clients", icon: Building2 },
    { id: "post-job", label: "Post Job", icon: Briefcase },
    { id: "open-positions", label: "Open Positions", icon: FolderOpen },
    { id: "candidates", label: "Candidates", icon: UsersRound },
    { id: "referred", label: "Referred", icon: UserPlus },
    { id: "report", label: "Reports", icon: BarChart3 },
    { id: "linkedin-searh", label: "LinkedIn Search", icon: Linkedin }
  ]

  const menuItems = user?.role === "candidate" ? candidateMenuItems : employerMenuItems

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MatchPro</h1>
            <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
