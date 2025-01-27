import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useState } from 'react'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [error, setError] = useState (null) // Add error state for showing errors to the user

  const handleClick = async () => {
    if (!user) {
      setError('You must be logged in to delete a workout.')
      return
    }

    try {
      const response = await fetch('/api/workouts/' + workout._id, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      // Check if response is empty (e.g., 204 No Content)
      if (response.status === 204) {
        // Handle empty response, workout is deleted
        dispatch({ type: 'DELETE_WORKOUT', payload: workout })
        return
      }

      // Handle responses with a body (usually JSON)
      if (!response.ok) {
        const json = await response.json()
        setError(json.error || 'Error deleting workout') // Display error message if any
        console.error('Error deleting workout:', json.error)
        return
      }

      // If response is successful, delete the workout from the state
      const json = await response.json()
      dispatch({ type: 'DELETE_WORKOUT', payload: json })

    } catch (err) {
      // Catch any errors like network issues or invalid JSON response
      setError(`Failed to delete workout: ${err.message || 'Unknown error'}`)
      console.error('Failed to delete workout:', err)
    }
  }

  // Check if workout.createdAt is a valid date string
  const createdAtDate = new Date(workout.createdAt)
  const isValidDate = !isNaN(createdAtDate.getTime())

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Reps: </strong>{workout.reps}</p>
      {/* Only format and display the date if it's valid */}
      <p>{isValidDate ? formatDistanceToNow(createdAtDate, { addSuffix: true }) : 'Invalid date'}</p>
      
      {/* Show the error if it exists */}
      {error && <div className="error">{error}</div>}
      
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default WorkoutDetails