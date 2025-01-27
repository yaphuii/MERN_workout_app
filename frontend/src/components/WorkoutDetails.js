import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
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

      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json })
      } else {
        console.error('Error deleting workout:', json.error)
      }
    } catch (err) {
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
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default WorkoutDetails