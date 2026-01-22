'use client'

import { getSubjectColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie from "lottie-react";
import { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from "@/constants/soundwaves.json";
import { set } from "zod";
// enum for call status
enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINIHSED",
}

/**
 * A component representing a companion session.
 *
 * @param {CompanionComponentProps} props - The component props.
 * @param {string} props.companionId - The ID of the companion.
 * @param {string} props.subject - The subject of the companion.
 * @param {string} props.topic - The topic of the companion.
 * @param {string} props.name - The name of the companion.
 * @param {string} props.userName - The name of the user.
 * @param {string} props.userImage - The image of the user.
 * @param {string} props.voice - The voice of the user.
 * @param {string} props.style - The style of the user.
 */
const CompanionComponent = ({companionId, subject, topic, name, userName, userImage, voice, style}: CompanionComponentProps ) => {


    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE); // default call status
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
     //lottie
     const lottieRef = useRef<LottieRefCurrentProps>(null);

     useEffect(() => {

        if (lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play(); //play animation
            } else {
                lottieRef.current?.stop(); //stop animation
            }
        }
    }, [isSpeaking,lottieRef]);

    useEffect(() => {

        //vapi event handlers

        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessage = () => {}
        const onSpeachStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error:Error) => console.log(error);

    


        //vapi event listeners
        vapi.on('call-start', onCallStart); // listen for call start event
        vapi.on('call-end', onCallEnd); // listen for call end event
        vapi.on('message', onMessage); // listen for message event
        vapi.on('error', onError); // listen for error event
        vapi.on('speech-start', onSpeachStart); // listen for speech start event
        vapi.on('speech-end', onSpeechEnd); // listen for speech end event

        // clean up
        return () => {
            
            vapi.off('call-start', onCallStart); // listen for call start event
            vapi.off('call-end', onCallEnd); // listen for call end event
            vapi.off('message', onMessage); // listen for message event
            vapi.off('error', onError); // listen for error event
            vapi.off('speech-start', onSpeachStart); // listen for speech start event
            vapi.off('speech-end', onSpeechEnd); // listen for speech end event
        }

        
    }, []);

    /**
     * Toggles microphone mute on/off
     */
    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted); // toggle mute
        setIsMuted(!isMuted); // update state
        
    }

    const handleCall = async () => {
        
    }

    const handleDisconnect = () => {
        
    }

    // UI for companion session 
    return (
        <section className="flex flex-col h-[70vh]">
            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section">
                    <div className="companion-avatar" style = {{backgroundColor: getSubjectColor(subject)}}>
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse')}>
                            <Image src ={`/icons/${subject}.svg`} alt = {subject} width = {150} height = {150} className="max-sm:w-fit"></Image>

                        </div>
                        {/*show animation for when call is active */}
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            <Lottie lottieRef={lottieRef} animationData={soundwaves} autoPlay={false} className="companion-lottie"  />
                            

                        </div>

                    </div>
                    <p className="font-bold text-2xl">{name}</p>

                </div>
                {/* UI for user section (user icon placed next to companion) */}
                <div className="user-section">
                    <div className="user-avatar">
                        <Image src = {userImage} alt = {userName} width = {130} height = {130} className="rounded-lg"></Image>
                        <p className="font-bold text-2xl"> {userName}</p>


                    </div>
                    {/* UI for call buttons */}
                   
                    <button className="btn-mic" onClick={toggleMicrophone}>
                        {/* UI for mic icon */}
                        <Image src = {isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"} alt = "mic" width = {36} height = {36}/>
                        <p className="max-sm:hidden"> {isMuted ? "Unmute" : "Mute"}</p>
                    </button>
                    {/* connect with call*/}
                    <button className={cn('rounded-lg py-2 cursor-pointer, transition-colors w-full text-white', callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse'  )} onClick ={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall} >
                        {/* check call status*/}
                        {callStatus === CallStatus.ACTIVE ? "End Session" : callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Session"}
                    </button>


                </div>

            </section>
            {/* UI for transcript section */}
            
        </section>
    )
}

export default CompanionComponent