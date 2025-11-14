'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Lobby {
  id: string
  lobbyCode: string
  name: string
  status: string
  playerCount: number
  createdAt: string
}

interface PlayerStats {
  playerId: string
  username: string
  gamesPlayed: number
  gamesWon: number
  minigamesWon: number
  totalLivesLost: number
  createdAt: string
}

const ADMIN_PASSWORD = 'micromadness2024' // Simple password protection

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'lobbies' | 'stats' | 'cleanup'>('lobbies')
  
  const [lobbies, setLobbies] = useState<Lobby[]>([])
  const [stats, setStats] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [editingStats, setEditingStats] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PlayerStats>>({})

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'lobbies') {
        fetchLobbies()
      } else if (activeTab === 'stats') {
        fetchStats()
      }
    }
  }, [isAuthenticated, activeTab])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
      setPassword('')
    } else {
      setMessage('Incorrect password')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const fetchLobbies = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/lobbies')
      if (res.ok) {
        const data = await res.json()
        setLobbies(data.lobbies || [])
      }
    } catch (error) {
      console.error('Error fetching lobbies:', error)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
    setLoading(false)
  }

  const deleteLobby = async (lobbyId: string) => {
    if (!confirm('Are you sure you want to delete this lobby?')) return
    
    try {
      const res = await fetch('/api/admin/lobbies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lobbyId }),
      })
      
      if (res.ok) {
        setMessage('Lobby deleted successfully')
        fetchLobbies()
      } else {
        setMessage('Failed to delete lobby')
      }
    } catch (error) {
      setMessage('Error deleting lobby')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const cleanupOldLobbies = async () => {
    if (!confirm('Delete all lobbies older than 2 hours?')) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/lobbies/cleanup', {
        method: 'POST',
      })
      
      if (res.ok) {
        const data = await res.json()
        setMessage(`Cleaned up ${data.deleted} old lobbies`)
        fetchLobbies()
      } else {
        setMessage('Failed to cleanup lobbies')
      }
    } catch (error) {
      setMessage('Error during cleanup')
    }
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const startEditStats = (stat: PlayerStats) => {
    setEditingStats(stat.playerId)
    setEditForm({
      gamesPlayed: stat.gamesPlayed,
      gamesWon: stat.gamesWon,
      minigamesWon: stat.minigamesWon,
      totalLivesLost: stat.totalLivesLost,
    })
  }

  const cancelEdit = () => {
    setEditingStats(null)
    setEditForm({})
  }

  const saveStats = async (playerId: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, ...editForm }),
      })
      
      if (res.ok) {
        setMessage('Stats updated successfully')
        setEditingStats(null)
        setEditForm({})
        fetchStats()
      } else {
        setMessage('Failed to update stats')
      }
    } catch (error) {
      setMessage('Error updating stats')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteStats = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player\'s stats?')) return
    
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      })
      
      if (res.ok) {
        setMessage('Stats deleted successfully')
        fetchStats()
      } else {
        setMessage('Failed to delete stats')
      }
    } catch (error) {
      setMessage('Error deleting stats')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6">Admin Panel</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
              />
            </div>
            <button onClick={handleLogin} className="btn-primary w-full">
              Login
            </button>
            {message && (
              <div className="text-red-500 text-center">{message}</div>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="game-card mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
            <button onClick={() => router.push('/')} className="btn-secondary">
              Back to Game
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="game-card mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('lobbies')}
              className={`px-4 py-2 rounded ${activeTab === 'lobbies' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Lobbies
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded ${activeTab === 'stats' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Player Stats
            </button>
            <button
              onClick={() => setActiveTab('cleanup')}
              className={`px-4 py-2 rounded ${activeTab === 'cleanup' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Cleanup Tools
            </button>
          </div>
        </div>

        {activeTab === 'lobbies' && (
          <div className="game-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Lobbies</h2>
              <button onClick={fetchLobbies} className="btn-secondary">
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : lobbies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No lobbies found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Players</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lobbies.map((lobby) => (
                      <tr key={lobby.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2 font-mono">{lobby.lobbyCode}</td>
                        <td className="px-4 py-2">{lobby.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            lobby.status === 'waiting' ? 'bg-yellow-200 text-yellow-800' :
                            lobby.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {lobby.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{lobby.playerCount}</td>
                        <td className="px-4 py-2">
                          {new Date(lobby.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => deleteLobby(lobby.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="game-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Player Statistics</h2>
              <button onClick={fetchStats} className="btn-secondary">
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : stats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No player stats found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Games Played</th>
                      <th className="px-4 py-2 text-left">Games Won</th>
                      <th className="px-4 py-2 text-left">Minigames Won</th>
                      <th className="px-4 py-2 text-left">Lives Lost</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat) => (
                      <tr key={stat.playerId} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{stat.username}</td>
                        {editingStats === stat.playerId ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={editForm.gamesPlayed}
                                onChange={(e) => setEditForm({...editForm, gamesPlayed: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={editForm.gamesWon}
                                onChange={(e) => setEditForm({...editForm, gamesWon: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={editForm.minigamesWon}
                                onChange={(e) => setEditForm({...editForm, minigamesWon: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={editForm.totalLivesLost}
                                onChange={(e) => setEditForm({...editForm, totalLivesLost: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2">{stat.gamesPlayed}</td>
                            <td className="px-4 py-2">{stat.gamesWon}</td>
                            <td className="px-4 py-2">{stat.minigamesWon}</td>
                            <td className="px-4 py-2">{stat.totalLivesLost}</td>
                          </>
                        )}
                        <td className="px-4 py-2">
                          {new Date(stat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {editingStats === stat.playerId ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveStats(stat.playerId)}
                                className="text-green-500 hover:text-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditStats(stat)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteStats(stat.playerId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cleanup' && (
          <div className="game-card">
            <h2 className="text-xl font-bold mb-4">Cleanup Tools</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <h3 className="font-bold mb-2">Clean Old Lobbies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Delete all lobbies that are older than 2 hours
                </p>
                <button
                  onClick={cleanupOldLobbies}
                  disabled={loading}
                  className="btn-danger"
                >
                  {loading ? 'Cleaning...' : 'Clean Old Lobbies'}
                </button>
              </div>

              <div className="p-4 border rounded">
                <h3 className="font-bold mb-2">Database Info</h3>
                <div className="text-sm space-y-2">
                  <p>Total Lobbies: {lobbies.length}</p>
                  <p>Total Players with Stats: {stats.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
