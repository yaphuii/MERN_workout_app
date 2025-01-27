import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // Check if the response status is OK (200-299)
      if (!response.ok) {
        const errorText = await response.text() // Get error response as text
        setIsLoading(false)
        setError(errorText || `Something went wrong: ${response.status}`)
        return
      }

      // If the response is OK, try to parse the JSON
      let json = {}
      try {
        json = await response.json()
      } catch (e) {
        setIsLoading(false)
        setError('Invalid response format from server.')
        return
      }

      // Save user data to localStorage and update the auth context
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })

      // Set loading to false
      setIsLoading(false)
    } catch (err) {
      // Handle network or other unexpected errors
      setIsLoading(false)
      setError('An error occurred during login.')
    }
  }

  return { login, isLoading, error }
}