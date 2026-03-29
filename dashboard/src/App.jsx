import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Box, Sphere } from '@react-three/drei';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Activity, Users, TrendingUp, Zap, Globe, Shield, Database, Cloud, Cpu, MemoryStick } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://api.zeroscale.dev/api/v1';

function App() {
  const [metrics, setMetrics] = useState({
    requests: 0,
    errors: 0,
    avgResponseTime: 0,
    uptime: '99.9%',
    memoryUsage: 65,
    cpuUsage: 42,
    activeUsers: 1247,
    totalHosts: 542,
    totalReviews: 3847
  });

  const [hosts, setHosts] = useState([]);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        requests: prev.requests + Math.floor(Math.random() * 10),
        avgResponseTime: 120 + Math.random() * 80,
        memoryUsage: 60 + Math.random() * 20,
        cpuUsage: 35 + Math.random() * 25,
        activeUsers: 1200 + Math.floor(Math.random() * 100)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const FloatingMetrics = ({ icon: Icon, value, label, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center space-x-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
          <p className="text-white/80 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* 3D Background Animation */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Float speed={2} rotationIntensity={0.5}>
            <Box
              args={[3, 3, 3]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={1.5}
            >
              <meshStandardMaterial color="#8b5cf6" />
            </Box>
          </Float>
          
          {/* Floating Spheres */}
          {Array.from({ length: 20 }).map((_, i) => (
            <Sphere
              key={i}
              args={[0.5, 0.5, 0.5]}
              position={[
                Math.sin(i * 0.5) * 10,
                Math.cos(i * 0.3) * 8,
                Math.sin(i * 0.7) * 5
              ]}
            >
              <meshStandardMaterial color="#60a5fa" />
            </Sphere>
          ))}
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Main Dashboard */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-black/30 backdrop-blur-xl border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ZeroScale Dashboard
                  </h1>
                  <p className="text-white/60 text-sm">Advanced API Analytics Platform</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedView === 'overview' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedView === 'analytics' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {selectedView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <FloatingMetrics icon={Activity} value={metrics.requests.toLocaleString()} label="Total Requests" color="text-blue-400" />
                <FloatingMetrics icon={Users} value={metrics.activeUsers.toLocaleString()} label="Active Users" color="text-green-400" />
                <FloatingMetrics icon={Database} value={metrics.totalHosts} label="Total Hosts" color="text-purple-400" />
                <FloatingMetrics icon={TrendingUp} value={metrics.totalReviews} label="Total Reviews" color="text-yellow-400" />
              </motion.div>
            )}

            {selectedView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Performance Charts */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Cpu className="w-6 h-6 mr-2 text-blue-400" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white/80 mb-2">Response Time Trend</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={[
                          { time: '00:00', responseTime: 150 },
                          { time: '04:00', responseTime: 120 },
                          { time: '08:00', responseTime: 180 },
                          { time: '12:00', responseTime: 140 },
                          { time: '16:00', responseTime: 160 },
                          { time: '20:00', responseTime: 130 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                            labelStyle={{ color: '#f3f4f6' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="responseTime" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-white/80 mb-2">System Resources</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { name: 'Memory', value: metrics.memoryUsage, fill: '#8b5cf6' },
                          { name: 'CPU', value: metrics.cpuUsage, fill: '#10b981' }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                            labelStyle={{ color: '#f3f4f6' }}
                          />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>

                {/* Error Distribution */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-red-400" />
                    Error Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Success', value: 85, fill: '#10b981' },
                          { name: 'Client Error', value: 10, fill: '#ef4444' },
                          { name: 'Server Error', value: 5, fill: '#f59e0b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                        labelStyle={{ color: '#f3f4f6' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
