import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      // Check if response is OK (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text() // Read response as text
        setIsLoading(false)
        setError(errorText || `Something went wrong: ${response.status}`)
        return
      }

      // If the response is empty (e.g., 204 No Content), handle it
      if (response.status === 204) {
        setIsLoading(false)
        setError('No content returned from the server.')
        return
      }

      // Handle the response JSON
      let json = {}
      try {
        // Parse response only if it's not empty
        const text = await response.text()
        json = text ? JSON.parse(text) : {} // If response is empty, default to empty object
      } catch (e) {
        setIsLoading(false)
        setError('Invalid JSON response from the server.')
        return
      }

      // Save the user data to localStorage
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json })

      // Update loading state
      setIsLoading(false)
    } catch (err) {
      // Handle network or unexpected errors
      setIsLoading(false)
      setError('An error occurred during signup.')
    }
  }

  return { signup, isLoading, error }
}