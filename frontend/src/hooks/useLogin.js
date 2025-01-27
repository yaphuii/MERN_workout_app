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
        body: JSON.stringify({ email, password })
      })

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text() // Get the error message as text
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
        const text = await response.text()  // Get the response text
        json = text ? JSON.parse(text) : {} // Parse the response text into JSON (if not empty)
      } catch (e) {
        setIsLoading(false)
        setError('Invalid JSON response from the server.')
        return
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json })

      // Update loading state
      setIsLoading(false)
    } catch (err) {
      // Handle unexpected errors (e.g., network issues)
      setIsLoading(false)
      setError('An error occurred during login.')
    }
  }

  return { login, isLoading, error }
}