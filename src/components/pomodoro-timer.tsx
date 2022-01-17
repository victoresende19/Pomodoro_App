import React, { useEffect, useCallback } from 'react'
import { useInterval } from '../hooks/use-interval'
import { Button } from './button'
import { Timer } from './timer'
import { secondsToTime } from '../tools/seconds-to-time'

const bellStart = require('../sounds/src_sounds_bell-start.mp3')
const bellFinish = require('../sounds/src_sounds_bell-finish.mp3')
const audioStartWorking = new Audio(bellStart)
const audioStopWorking = new Audio(bellFinish)

interface Props{
    defaultPomodoroTime: number,
    shortRestTime: number,
    longResTime: number,
    cycles: number
}

export function PomodoroTimer(props: Props): JSX.Element{
    const [mainTime, setMainTime] = React.useState(props.defaultPomodoroTime)
    const [timeCounting, setTimeCounting] = React.useState(false)
    const [working, setWorking] = React.useState(false)
    const [rest, setRest] = React.useState(false)
    const [cyclesQtdManager, setCyclesQtdManager] = React.useState(new Array(props.cycles - 1).fill(true))
    
    const [completedCycles, setCompletedCycles] = React.useState(0)
    const [fullWorkingTime, setFullWorkingTime] = React.useState(0)
    const [numPomodoros, setNumPomodoros] = React.useState(0)

    useInterval(()=>{
        setMainTime(mainTime- 1)
        if (working) setFullWorkingTime(fullWorkingTime + 1)
    }, timeCounting ? 1000: null, )

    const configureWork = useCallback(() =>{
        setTimeCounting(true)
        setWorking(true)
        setRest(false)
        setMainTime(props.defaultPomodoroTime)
        audioStartWorking.play()
    }, [setTimeCounting, setWorking, setRest,  setMainTime, props.defaultPomodoroTime])

    const configureRest = useCallback((long: boolean) =>{
        setTimeCounting(true)
        setWorking(false)
        setRest(true)

        if(long){
            setMainTime(props.longResTime)
        }else{
            setMainTime(props.shortRestTime)
        }

        audioStopWorking.play()
    }, [setTimeCounting, setWorking, setRest, setMainTime, props.longResTime, props.shortRestTime])
    
    useEffect(()=>{
        if(working) document.body.classList.add('working')
        if(rest) document.body.classList.remove('working')

        if(mainTime > 0) return;

        if (working && cyclesQtdManager.length > 0){
            configureRest(false)
            cyclesQtdManager.pop()
        }else if(working &&  cyclesQtdManager.length <= 0){
            configureRest(true)
            setCyclesQtdManager(new Array(props.cycles - 1).fill(true))
            setCompletedCycles(completedCycles + 1)
        } 
        if(working) setNumPomodoros(numPomodoros+1)
        if(rest) configureWork()
    }, [working, rest, mainTime, configureRest, setCyclesQtdManager, configureWork, cyclesQtdManager, numPomodoros, props.cycles, completedCycles])

    return(
        <div className='pomodoro'>
            <h2>Você está {working ? 'trabalhando': 'descansando'}...</h2>
            <Timer mainTime={mainTime}/>

            <div className="controls">
                <Button text='Work' onClick={()=> configureWork()}/>
                <Button text='Rest' onClick={()=> configureRest(false)}/>
                
                
                <Button
                 className={!working && !rest ? 'hidden': ''}
                 text={timeCounting ? 'Pause': 'Play'}
                 onClick={()=> setTimeCounting(!timeCounting)}/>
            </div>

            <div className="details">
               <p>Ciclos concluídos: {completedCycles}</p>
               <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
               <p>Pomodoros concluídos: {numPomodoros}</p>
            </div>
        </div>
    )

}