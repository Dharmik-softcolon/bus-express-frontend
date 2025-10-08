import React, { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { busAPI } from '../../services/api'
import { showToast } from '../../utils/toast'

const BusApiTest = () => {
  const { user } = useUser()
  const [buses, setBuses] = useState([])
  const [testBus, setTestBus] = useState(null)
  const [results, setResults] = useState([])

  const addResult = (test, success, message, data = null) => {
    const result = { test, success, message, data, timestamp: new Date().toISOString() }
    setResults(prev => [...prev, result])
    console.log(`Test Result - ${test}:`, result)
  }

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      console.log('=== TESTING GET ALL BUSES ===')
      const response = await busAPI.getAllBuses({ limit: 10 })
      console.log('Fetch buses response:', response)
      
      if (response.success && response.data?.buses) {
        setBuses(response.data.buses)
        addResult('Get All Buses', true, `Found ${response.data.buses.length} buses`)
        
        if (response.data.buses.length > 0) {
          setTestBus(response.data.buses[0])
          console.log('Set test bus for operations:', response.data.buses[0])
        }
      } else {
        addResult('Get All Buses', false, 'No buses in response or failed')
      }
    } catch (error) {
      console.error('Fetch buses error:', error)
      addResult('Get All Buses', false, error.message)
    }
  }

  const testCreateBus = async () => {
    try {
      console.log('=== TESTING CREATE BUS ===')
      console.log('Current user:', user)
      
      const busData = {
        busNumber: `TEST-${Date.now()}`,
        busName: 'Test Bus for API',
        type: 'AC',
        totalSeats: 40,
        availableSeats: 40,
        amenities: ['wifi'],
        status: 'active',
        features: { wifi: true, charging: false, blankets: false, water: false, snacks: false },
        fuelCapacity: 100,
        currentFuel: 50,
        totalKm: 0,
        lastServiceKm: 0
      }
      
      console.log('Creating bus with data:', busData)
      const response = await busAPI.createBus(busData)
      console.log('Create bus response:', response)
      
      if (response.success) {
        addResult('Create Bus', true, 'Bus created successfully')
        fetchBuses()
      } else {
        addResult('Create Bus', false, response.message || 'Create failed')
      }
    } catch (error) {
      console.error('Create bus error:', error)
      addResult('Create Bus', false, error.message)
    }
  }

  const testUpdateBus = async () => {
    try {
      console.log('=== TESTING UPDATE BUS ===')
      
      if (!testBus) {
        addResult('Update Bus', false, 'No test bus available')
        return
      }
      
      console.log('Updating bus:', testBus._id)
      console.log('User ID:', user?.id)
      console.log('Bus operator:', testBus.operator)
      console.log('Operator type:', typeof testBus.operator)
      console.log('User type:', typeof user?.id)
      
      const updateData = {
        busName: `${testBus.busName} (Updated ${new Date().getTime()})`,
        totalSeats: 45
      }
      
      console.log('Update data:', updateData)
      const response = await busAPI.updateBus(testBus._id, updateData)
      console.log('Update bus response:', response)
      
      if (response.success) {
        addResult('Update Bus', true, 'Bus updated successfully')
        fetchBuses()
      } else {
        addResult('Update Bus', false, response.message || 'Update failed')
      }
    } catch (error) {
      console.error('Update bus error:', error)
      addResult('Update Bus', false, error.message)
    }
  }

  const testDeleteBus = async () => {
    try {
      console.log('=== TESTING DELETE BUS ===')
      
      if (!testBus) {
        addResult('Delete Bus', false, 'No test bus available')
        return
      }
      
      console.log('Deleting bus:', testBus._id)
      const response = await busAPI.deleteBus(testBus._id)
      console.log('Delete bus response:', response)
      
      if (response.success) {
        addResult('Delete Bus', true, 'Bus deleted successfully')
        setTestBus(null)
        fetchBuses()
      } else {
        addResult('Delete Bus', false, response.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete bus error:', error)
      addResult('Delete Bus', false, error.message)
    }
  }

  const runAllTests = async () => {
    setResults([])
    addResult('Authentication Check', !!user?.token, user?.token ? `Authenticated as ${user?.role}` : 'Not authenticated')
    
    await fetchBuses()
    await testCreateBus()
    await testUpdateBus()
    await testDeleteBus()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-[#6A0066] mb-6">Bus API Test Console</h1>
          
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Current User Info:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>ID:</strong> {user?.id}</div>
              <div><strong>Role:</strong> {user?.role}</div>
              <div><strong>Authenticated:</strong> {user?.token ? 'Yes' : 'No'}</div>
              <div><strong>Token:</strong> {user?.token ? `${user.token.substring(0, 20)}...` : 'None'}</div>
            </div>
          </div>

          {/* Test Bus Info */}
          {testBus && (
            <div className="mb-6 p-4 bg-blue-100 rounded-lg">
              <h3 className="font-semibold mb-2">Test Bus Info:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Bus ID:</strong> {testBus._id}</div>
                <div><strong>Bus Number:</strong> {testBus.busNumber}</div>
                <div><strong>Bus Name:</strong> {testBus.busName}</div>
                <div><strong>Operator:</strong> {typeof testBus.operator === 'object' ? testBus.operator?.name : testBus.operator}</div>
                <div><strong>Operator Type:</strong> {typeof testBus.operator}</div>
                <div><strong>User Role:</strong> {user?.role}</div>
              </div>
            </div>
          )}

          {/* Available Buses */}
          {buses.length > 0 && (
            <div className="mb-6 p-4 bg-green-100 rounded-lg">
              <h3 className="font-semibold mb-2">Available Buses ({buses.length}):</h3>
              <div className="max-h-40 overflow-y-auto text-sm">
                {buses.map((bus, index) => (
                  <div key={bus._id} className="mb-1 flex justify-between">
                    <span>{bus.busNumber} - {bus.busName}</span>
                    <span className="text-gray-600">
                      Op: {typeof bus.operator === 'object' ? bus.operator?.name : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={fetchBuses} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 border-0 hover:border-0">
              Test Get All Buses
            </button>
            <button onClick={testCreateBus} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 border-0 hover:border-0">
              Test Create Bus
            </button>
            <button onClick={testUpdateBus} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 border-0 hover:border-0">
              Test Update Bus
            </button>
            <button onClick={testDeleteBus} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 border-0 hover:border-0">
              Test Delete Bus
            </button>
            <button onClick={runAllTests} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 border-0 hover:border-0">
              Run All Tests
            </button>
            <button onClick={() => setResults([])} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 border-0 hover:border-0">
              Clear Results
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            
            {results.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <h4 className="font-semibold">{result.test}</h4>
                    </div>
                    <span className="text-sm text-gray-500">
                      {result.timestamp.split('T')[1].split('.')[0]}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusApiTest
