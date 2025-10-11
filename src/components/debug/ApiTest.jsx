import React, { useState } from 'react'
import { busAPI } from '../../services/api'
import { useUser } from '../../contexts/UserContext'
import { showToast } from '../../utils/toast'

const ApiTest = () => {
  const { user } = useUser()
  const [testResults, setTestResults] = useState([])

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, { test, success, message, data, timestamp: new Date().toISOString() }])
  }

  const testApiEndpoint = async (endpointName, apiCall) => {
    try {
      console.log(`Testing ${endpointName}...`)
      const response = await apiCall()
      
      console.log(`${endpointName} Response:`, response)
      
      addResult(endpointName, true, 'Success', response)
      showToast.success(`${endpointName} test passed`)
    } catch (error) {
      console.error(`${endpointName} Error:`, error)
      
      addResult(endpointName, false, error.message, error.response?.data)
      showToast.error(`${endpointName} test failed: ${error.message}`)
    }
  }

  const testGetAllBuses = () => testApiEndpoint('Get All Buses', () => busAPI.getAllBuses({ limit: 10 }))
  
  const testCreateBus = () => testApiEndpoint('Create Bus', () => busAPI.createBus({
    busNumber: 'TEST-123',
    busName: 'Test Bus',
    type: 'AC',
    totalSeats: 40,
    availableSeats: 40,
    amenities: [],
    status: 'active',
    features: { wifi: true, charging: false, blankets: false, water: false, snacks: false },
    fuelCapacity: 100,
    currentFuel: 50,
    totalKm: 0,
    lastServiceKm: 0
  }))

  const runAllTests = async () => {
    setTestResults([])
    
    // Test authentication
    addResult('Authentication', !!user?.token, user?.token ? `Authenticated as ${user?.role}` : 'Not authenticated')
    
    // Test API calls
    await testGetAllBuses()
    
    if (user?.role && (user.role === 'admin' || user.role === 'operator')) {
      await testCreateBus()
    } else {
      addResult('Create Bus', false, 'Missing admin/operator permissions')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-600 mb-6">API Test Console</h1>
          
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Current User:</h3>
            <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testGetAllBuses}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary border-0 hover:border-0"
            >
              Test Get All Buses
            </button>
            
            {user?.role && (user.role === 'admin' || user.role === 'operator') && (
              <button
                onClick={testCreateBus}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 border-0 hover:border-0"
              >
                Test Create Bus
              </button>
            )}
            
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 border-0 hover:border-0"
            >
              Run All Tests
            </button>
            
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 border-0 hover:border-0"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>
            
            {testResults.length === 0 ? (
              <p className="text-gray-600">No tests run yet</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <h4 className="font-semibold">{result.test}</h4>
                    </div>
                    <span className="text-sm text-gray-600">{result.timestamp}</span>
                  </div>
                  <p className={`mt-1 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600">View Response Data</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTest
