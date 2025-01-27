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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text() // Get the response text if not JSON
        setIsLoading(false)
        setError(errorText || `Something went wrong: ${response.status}`)
        return
      }

      // Handle successful response and try to parse the JSON
      let json = {}
      try {
        json = await response.json()
      } catch (e) {
        setIsLoading(false)
        setError('Invalid JSON response from the server.')
        return
      }

      // Save user data to localStorage and dispatch the login action
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })

      // Update loading state
      setIsLoading(false)
    } catch (err) {
      // Handle any unexpected errors (e.g., network issues)
      setIsLoading(false)
      setError('An error occurred during signup.')
    }
  }

  return { signup, isLoading, error }
}