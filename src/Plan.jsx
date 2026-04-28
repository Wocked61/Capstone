import { useEffect, useMemo, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './Plan.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TIME_SLOTS = [
	'00:00',
	'01:00',
	'02:00',
	'03:00',
	'04:00',
	'05:00',
	'06:00',
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00'
]

const toCellKey = (day, time) => `${day}|${time}`

const Plan = () => {
	const [title, setTitle] = useState('')
	const [selectedDay, setSelectedDay] = useState(DAYS[1])
	const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[3])
	const [plans, setPlans] = useState([])
	const [accessToken, setAccessToken] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [showForm, setShowForm] = useState(false)
	const [aiSchedule, setAiSchedule] = useState("");

	// Load plans from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('taskfast_plans')
		if (saved) {
			try {
				setPlans(JSON.parse(saved))
			} catch (err) {
				console.error('Failed to load saved plans:', err)
			}
		}
	}, [])

	// Save plans to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem('taskfast_plans', JSON.stringify(plans))
	}, [plans])

	// Google Login hook
	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			setAccessToken(codeResponse.access_token)
			setIsLoggedIn(true)
			await fetchCalendarEvents(codeResponse.access_token)
		},
		onError: () => {
			setError('Failed to login with Google')
		},
		scope: 'https://www.googleapis.com/auth/calendar',
		flow: 'implicit',
	})

	// Fetch events from Google Calendar
	const fetchCalendarEvents = async (token) => {
		if (!token) return

		try {
			setLoading(true)
			const now = new Date()
			const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			const timeMax = new Date(timeMin)
			timeMax.setDate(timeMax.getDate() + 7)

			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
				`timeMin=${timeMin.toISOString()}&` +
				`timeMax=${timeMax.toISOString()}&` +
				`singleEvents=true&` +
				`orderBy=startTime`,
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)

			if (!response.ok && response.status === 401) {
				setIsLoggedIn(false)
				setAccessToken(null)
				setError('Session expired. Please login again.')
				return
			}

			const data = await response.json()
			const eventsData = data.items || []

			// Parse Google Calendar events to fit the timetable
			const parsedEvents = eventsData.map((event) => {
				const startTime = new Date(event.start.dateTime || event.start.date)
				const dayIndex = startTime.getDay()
				const dayName = DAYS[dayIndex]
				const hours = String(startTime.getHours()).padStart(2, '0')
				const time = `${hours}:00`

				return {
					id: event.id,
					title: event.summary,
					day: dayName,
					time: time,
					googleEventId: event.id,
				}
			})

			setPlans(parsedEvents)
			setError('')
		} catch (err) {
			console.error('Error fetching calendar events:', err)
			setError('Failed to fetch calendar events')
		} finally {
			setLoading(false)
		}
	}

	// Refresh calendar events when access token changes
	useEffect(() => {
		if (accessToken && isLoggedIn) {
			fetchCalendarEvents(accessToken)
		}
	}, [accessToken, isLoggedIn])

	async function getSchedule(input) {

  		const res = await fetch("http://localhost:4000/api/gemini/chat", {
    		method: "POST",
    		headers: {

      			"Content-Type": "application/json",
    		},
    		body: JSON.stringify({ message: input }),
  		});

  		const data = await res.json();
  		return data.reply;
	}

	function formatPlansForAI(plans) {
  		return plans.map(p => `${p.day} ${p.time}: ${p.title}`).join("\n");
	}

	const handleGenerateAI = async () => {
		console.log("CLICKED");

  		const input = formatPlansForAI(plans);
  		const result = await getSchedule(input);
  		setAiSchedule(result);
	};


	const plansByCell = useMemo(() => {
		const map = new Map()
		plans.forEach((plan) => {
			const key = toCellKey(plan.day, plan.time)
			if (!map.has(key)) {
				map.set(key, [])
			}
			map.get(key).push(plan)
		})
		return map
	}, [plans])

	const handleSubmit = async (event) => {
		event.preventDefault()
		const trimmed = title.trim()
		if (!trimmed) return

		try {
			setLoading(true)

			// Create new plan
			const newPlan = {
				id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
				title: trimmed,
				day: selectedDay,
				time: selectedTime,
			}

			// If logged in with Google, also add to Google Calendar
			if (accessToken && isLoggedIn) {
				const dayIndex = DAYS.indexOf(selectedDay)
				const [hours, minutes] = selectedTime.split(':').map(Number)

				const now = new Date()
				const startDate = new Date(now)
				const dayDiff = dayIndex - now.getDay()
				startDate.setDate(startDate.getDate() + dayDiff)
				startDate.setHours(hours, minutes, 0, 0)

				const endDate = new Date(startDate)
				endDate.setHours(startDate.getHours() + 1)

				const eventBody = {
					summary: trimmed,
					start: {
						dateTime: startDate.toISOString(),
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					},
					end: {
						dateTime: endDate.toISOString(),
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					},
				}

				const response = await fetch(
					'https://www.googleapis.com/calendar/v3/calendars/primary/events',
					{
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(eventBody),
					}
				)

				if (!response.ok) {
					throw new Error(`Failed to create event: ${response.status}`)
				}

				const createdEvent = await response.json()
				newPlan.googleEventId = createdEvent.id
			}

			setPlans((prev) => [...prev, newPlan])
			setTitle('')
			setShowForm(false)
			setError('')
		} catch (err) {
			console.error('Error creating event:', err)
			setError('Failed to create plan')
		} finally {
			setLoading(false)
		}
	}

	const handleCellClick = (day, time) => {
		setSelectedDay(day)
		setSelectedTime(time)
		setTitle('')
		setShowForm(true)
	}

	const handleDeletePlan = (planId) => {
		setPlans((prev) => prev.filter((plan) => plan.id !== planId))
	}

	return (
		<section className="plan">
			<div className="plan-header">
				<div>
					<h1 className="plan-title">Weekly Plan</h1>
					<p className="plan-subtitle">
						Click a cell to add a plan or use the form below
					</p>
				</div>

				<div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
					{!isLoggedIn ? (
						<button
							className="plan-button"
							onClick={() => login()}
							style={{
								padding: '10px 20px',
								marginBottom: '0px',
							}}
						>
							Sync with Google Calendar
						</button>
					) : (
						<button
							className="plan-button"
							onClick={() => {
								setIsLoggedIn(false)
								setAccessToken(null)
								setPlans([])
							}}
							style={{
								padding: '10px 20px',
								marginBottom: '0px',
								backgroundColor: '#7a8f94',
							}}
						>
							Logout
						</button>
					)}
					
					<button
  						className="plan-button"
  						onClick={handleGenerateAI}
  						style={{
    						padding: '10px 20px',
    						marginBottom: '0px',
    						backgroundColor: '#4caf50'
  						}}
					>
  						Generate AI Schedule
					</button>
				</div>
			</div>

			{showForm && (
				<form className="plan-form" onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
					<label className="plan-label">
						Title
						<input
							className="plan-input"
							type="text"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Enter plan title..."
							maxLength={48}
							disabled={loading}
							autoFocus
						/>
					</label>
					<label className="plan-label">
						Day
						<select
							className="plan-select"
							value={selectedDay}
							onChange={(event) => setSelectedDay(event.target.value)}
							disabled={loading}
						>
							{DAYS.map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
					</label>
					<label className="plan-label">
						Time
						<select
							className="plan-select"
							value={selectedTime}
							onChange={(event) => setSelectedTime(event.target.value)}
							disabled={loading}
						>
							{TIME_SLOTS.map((slot) => (
								<option key={slot} value={slot}>
									{slot}
								</option>
							))}
						</select>
					</label>
					<button className="plan-button" type="submit" disabled={loading}>
						{loading ? 'Adding...' : 'Add'}
					</button>
					<button
						className="plan-button"
						type="button"
						onClick={() => setShowForm(false)}
						style={{ backgroundColor: '#7a8f94' }}
						disabled={loading}
					>
						Cancel
					</button>
				</form>
			)}

			{error && (
				<div
					style={{
						color: '#c41e3a',
						padding: '12px',
						marginBottom: '16px',
						backgroundColor: '#ffe0e6',
						borderRadius: '8px',
						fontSize: '0.9rem',
					}}
				>
					{error}
				</div>
			)}

			{loading ? (
				<div
					style={{
						textAlign: 'center',
						padding: '40px',
						color: '#6b7a7f',
					}}
				>
					Loading...
				</div>
			) : (
				<div className="timetable" role="grid" aria-label="Weekly timetable">
					<div className="timetable-row timetable-header" role="row">
						<div className="timetable-time" role="columnheader">
							Time
						</div>
						{DAYS.map((item) => (
							<div className="timetable-day" role="columnheader" key={item}>
								{item}
							</div>
						))}
					</div>
					{TIME_SLOTS.map((slot) => (
						<div className="timetable-row" role="row" key={slot}>
							<div className="timetable-time" role="rowheader">
								{slot}
							</div>
							{DAYS.map((dayName) => {
								const key = toCellKey(dayName, slot)
								const cellPlans = plansByCell.get(key) || []
								return (
									<div
										className="timetable-cell"
										role="gridcell"
										key={key}
										onClick={() => handleCellClick(dayName, slot)}
										style={{ cursor: 'pointer' }}
										title="Click to add a plan"
									>
										{cellPlans.map((plan) => (
											<div
												className="timetable-chip"
												key={plan.id}
												onClick={(e) => e.stopPropagation()}
												style={{ position: 'relative' }}
											>
												{plan.title}
												<button
													onClick={(e) => {
														e.stopPropagation()
														handleDeletePlan(plan.id)
													}}
													style={{
														marginLeft: '4px',
														background: 'none',
														border: 'none',
														color: '#2b1a0f',
														cursor: 'pointer',
														fontSize: '0.8rem',
														padding: '0',
													}}
													title="Delete plan"
												>
													✕
												</button>
											</div>
										))}
									</div>
								)
							})}
						</div>
					))}
				</div>
			)}

			{aiSchedule && (
				<div style={{ marginTop: '20px' }}>
					<h3>AI Optimized Schedule</h3>
					<pre style={{ whiteSpace: 'pre-wrap' }}>
						{aiSchedule}
					</pre>
				</div>
			)}

		</section>
	)
}

export default Plan
