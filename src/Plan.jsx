import { useMemo, useState } from 'react'
import './Plan.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TIME_SLOTS = [
	'06:00',
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00',
	'21:00',
	'22:00',
]

const toCellKey = (day, time) => `${day}|${time}`

const Plan = () => {
	const [title, setTitle] = useState('')
	const [day, setDay] = useState(DAYS[1])
	const [time, setTime] = useState(TIME_SLOTS[3])
	const [plans, setPlans] = useState([])

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

	const handleSubmit = (event) => {
		event.preventDefault()
		const trimmed = title.trim()
		if (!trimmed) return

		setPlans((prev) => [
			...prev,
			{
				id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
				title: trimmed,
				day,
				time,
			},
		])
		setTitle('')
	}

	return (
		<section className="plan">
			<div className="plan-header">
				<div>
					<h1 className="plan-title">Weekly Plan</h1>
					<p className="plan-subtitle">
						Create time blocks for school, health, and errands.
					</p>
				</div>
				<form className="plan-form" onSubmit={handleSubmit}>
					<label className="plan-label">
						Title
						<input
							className="plan-input"
							type="text"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="Hydration, workout, study..."
							maxLength={48}
						/>
					</label>
					<label className="plan-label">
						Day
						<select
							className="plan-select"
							value={day}
							onChange={(event) => setDay(event.target.value)}
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
							value={time}
							onChange={(event) => setTime(event.target.value)}
						>
							{TIME_SLOTS.map((slot) => (
								<option key={slot} value={slot}>
									{slot}
								</option>
							))}
						</select>
					</label>
					<button className="plan-button" type="submit">
						Add plan
					</button>
				</form>
			</div>

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
								<div className="timetable-cell" role="gridcell" key={key}>
									{cellPlans.map((plan) => (
										<div className="timetable-chip" key={plan.id}>
											{plan.title}
										</div>
									))}
								</div>
							)
						})}
					</div>
				))}
			</div>
		</section>
	)
}

export default Plan
