"use client"
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Tab from "@/app/component/Tab";
import { formatTime } from "@/utils/misc";
import Button from "./component/Button";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [match, setMatch] = useState<Match>({
    state: "auton",
    started: false,
    time: 150,
    score: 0,
    amplified: false
  });

  const [countdown, setCountdown] = useState<number | null>(null);
  const scoreControl = useAnimation();

  useEffect(() => {
    scoreControl.start({ scale: 1.2, transition: { duration: 0.2 } });
    setTimeout(() => scoreControl.start({ scale: 1 }), 200);
  }, [match.score, scoreControl]);

  useEffect(() => {
    if (match.started) {
      const interval = setInterval(() => {
        setMatch(prevMatch => {
          let newTime = prevMatch.time - 1;
          if (prevMatch.state === "auton" && newTime === 135) {
            return { ...prevMatch, state: "teleop", time: 135 };
          } else if (prevMatch.state === "teleop" && newTime === 30) {
            return { ...prevMatch, state: "endgame", time: 30 };
          } else if (newTime === 0) {
            clearInterval(interval);
            return { ...prevMatch, state: "endgame", time: 0 };
          } else {
            return { ...prevMatch, time: newTime };
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [match.started]);

  useEffect(() => {
    if (countdown !== null) {
      const interval = setInterval(() => {
        if ((countdown - 1) === 0) {
          setCountdown(null);
          setMatch({ ...match, started: true });
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, match]);

  const handleStart = () => {
    setCountdown(3);
  };

  function addScore(type: string) {
    let points = 0;
    switch(type) {
      case "speaker": {
        if(match.state === "auton" || match.amplified) points += 5;
        else points += 2;
        break;
      }
      case "taxi": {
        points += 2;
        break;
      }
      case "climb":
      case "amp":
      case "trap":
      case "park": {
        points += 1;
        break;
      }
    }
    setMatch({
      ...match,
      score: match.score + points
    });
  }

  const amplify = () => {
    toast.success("Amplified period started!");
    setMatch(prevMatch => ({ ...prevMatch, amplified: true }));
    setTimeout(() => {
      setMatch(prevMatch => ({ ...prevMatch, amplified: false }));
      toast.success("Amplified period ended!");
    }, 10000);
  };
  

  return (
    <div className="h-screen w-full flex flex-col gap-2 p-4 bg-tertiary">
      <Toaster />
      <div className="mt-3 p-2 flex w-full bg-secondary border-2 border-pborder rounded-md">
        <Tab text={"Auton"} active={match.state === "auton"} />
        <Tab text={"Teleop"} active={match.state === "teleop"} />
        <Tab text={"Endgame"} active={match.state === "endgame"} />
      </div>
      {!match.started && countdown !== null && (
        <div className="flex items-center justify-center w-full h-full">
          <motion.div
            className="text-5xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            key={countdown}
          >
            {countdown}
          </motion.div>
        </div>
      )}
      {!match.started && countdown === null && (
        <div className="flex items-center justify-center w-full h-full">
          <button
            className="bg-primary shadow-lg rounded-md px-6 py-3 text-black font-bold"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      )}
      {match.started && match.time === 0 && (
        <div className="flex items-center justify-center w-full h-full">
            <h1 className="text-5xl font-bold text-white">{match.score}</h1>
            <button
            className="bg-primary shadow-lg rounded-md px-6 py-3 text-black font-bold"
            onClick={() => {
              setMatch({
                state: "auton",
                started: false,
                time: 150,
                score: 0,
                amplified: false
              })
              setCountdown(3)
            }}
          >
            Restart
          </button>
        </div>
      )}
      {match.started && match.time > 0 && (
        <>
          <motion.div
            className="text-5xl font-bold text-white mt-3 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            key={"match-timer"}
          >
            {formatTime(match.time > 135 ? match.time - 135 : match.time)}
          </motion.div>
          <motion.div
            className="w-full h-full p-4 text-5xl text-white flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={scoreControl}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1>{match.score}</h1>
          </motion.div>
          <div className="flex justify-center mt-5">
            <Button text={"Amp"} disabled={!match.started} type={"amp"} onClick={() => addScore("amp")} />
            <Button text={"Speaker"} disabled={!match.started} type={"speaker"} onClick={() => addScore("speaker")} />
            <Button text={"Taxi"} disabled={match.state !== "auton"} type={"taxi"} onClick={() => addScore("taxi")} />
          </div>
          <div className="flex justify-center mt-5">
            <Button text={"Climb"} disabled={!match.started} type={"climb"} onClick={() => addScore("climb")} />
            <Button text={"Trap"} disabled={!match.started} type={"trap"} onClick={() => addScore("trap")} />
            <Button text={"Park"} disabled={match.state !== "endgame"} type={"park"} onClick={() => addScore("park")} />
          </div>
          <div className="flex justify-center mt-5">
            <Button text={"Amplify"} disabled={match.amplified} type={"amplified"} onClick={amplify} />
          </div>
        </>
      )}
    </div>
  );
}
