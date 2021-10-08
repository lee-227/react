import React, { FC } from 'react'

interface PipeLine {
  stages: Stage[]
}
interface Stage {
  title: string
  jobs: Job[]
}
interface Job {
  name: string
  status: 'success' | 'fail'
  time: number
}

const PipeLineFn: FC<{ pipeline: PipeLine }> = ({ pipeline }) => {
  if (!pipeline || !pipeline.stages || !pipeline.stages.length) return null
  return (
    <div>
      {pipeline.stages.map((stage) => (
        <StageFn key={stage.title} stage={stage}></StageFn>
      ))}
    </div>
  )
}

const StageFn: FC<{ stage: Stage }> = ({ stage }) => {
  if (!stage) return null
  return (
    <div style={{ float: 'left', margin: '0 10px' }}>
      <h3>{stage.title}</h3>
      {stage.jobs &&
        stage.jobs.length &&
        stage.jobs.map((job) => <JobFn job={job} key={job.name}></JobFn>)}
    </div>
  )
}

const JobFn: FC<{ job: Job }> = ({ job }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        border: '1px solid black',
        borderRadius: '20px',
        margin: '5px',
      }}
    >
      {job.status === 'success' ? <span>✔</span> : <span>✖</span>}
      <span style={{ marginLeft: '10px' }}>{job.name}</span>
      <span style={{ marginLeft: '20px' }}>{job.time}</span>
    </div>
  )
}

export default PipeLineFn
