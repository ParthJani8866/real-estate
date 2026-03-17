'use client'

import { useEffect, useState } from 'react'
import { Home, Users, Building2, MapPin, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<any>({})
  const [properties, setProperties] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchDashboard()
    fetchProperties()
    fetchUsers()
  }, [])

  const fetchDashboard = async () => {
    const res = await fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setStats(data)
  }

  const fetchProperties = async () => {
    const res = await fetch('/api/admin/properties', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    console.log(data);
    
    setProperties(Array.isArray(data) ? data : data.properties || []);
  }

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : data.users || [])
  }

  const deleteProperty = async (id: string) => {
    await fetch('/api/admin/properties', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
    fetchProperties()
  }

  const deleteUser = async (id: string) => {
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
    fetchUsers()
  }

  const SidebarItem = ({ icon: Icon, label, value }: any) => (
    <div
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-200 ${activeTab === value ? 'bg-gray-200 font-semibold' : ''}`}
    >
      <Icon size={18} />
      {label}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">DreamHouse Admin</h1>

          <SidebarItem icon={Home} label="Dashboard" value="dashboard" />
          <SidebarItem icon={Building2} label="Properties" value="properties" />
          <SidebarItem icon={Users} label="Users" value="users" />
          <SidebarItem icon={MapPin} label="Locations" value="locations" />
        </div>

        <button className="flex items-center gap-2 text-red-500">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">Users</p>
                <h2 className="text-2xl font-bold">{stats.users || 0}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">Properties</p>
                <h2 className="text-2xl font-bold">{stats.properties || 0}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500">Cities</p>
                <h2 className="text-2xl font-bold">{stats.cities || 0}</h2>
              </div>
            </div>
          </>
        )}

        {/* Properties */}
        {activeTab === 'properties' && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Properties</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">BHK</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.bhk}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteProperty(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
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

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
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

        {/* Locations Placeholder */}
        {activeTab === 'locations' && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold">City & Area Management (Coming Next)</h2>
          </div>
        )}

      </div>
    </div>
  )
}
