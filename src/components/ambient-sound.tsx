"use client";

import React, { useEffect, useRef, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Volume2, VolumeX, Play, Pause, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AmbientSoundPlayer() {
  const { ambientSound, audioVolume, setAmbientSound, setAudioVolume } = useProductivityStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [synthSupported, setSynthSupported] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    } catch (e) {
      console.error("Web Audio API not supported", e);
      setSynthSupported(false);
    }
  };

  const stopAll = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.disconnect();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    if (filterNodeRef.current) {
      try {
        filterNodeRef.current.disconnect();
      } catch (e) {}
      filterNodeRef.current = null;
    }
    if (lfoNodeRef.current) {
      try {
        lfoNodeRef.current.stop();
        lfoNodeRef.current.disconnect();
      } catch (e) {}
      lfoNodeRef.current = null;
    }
    if (lfoGainRef.current) {
      try {
        lfoGainRef.current.disconnect();
      } catch (e) {}
      lfoGainRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (e) {}
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const startSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }
    if (!audioCtxRef.current) return;

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    stopAll();

    if (ambientSound === "none") return;

    const ctx = audioCtxRef.current;
    
    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(audioVolume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create White Noise Buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    if (ambientSound === "white_noise") {
      whiteNoise.connect(masterGain);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise as any;
      setIsPlaying(true);
    } else if (ambientSound === "rain") {
      // Filter for rain sound (Low-pass + Bandpass to simulate patter)
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(800, ctx.currentTime);

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, ctx.currentTime);
      bandpass.Q.setValueAtTime(1, ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(bandpass);
      bandpass.connect(masterGain);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise as any;
      filterNodeRef.current = lowpass;
      setIsPlaying(true);
    } else if (ambientSound === "ocean") {
      // Ocean: Noise modulated by LFO (Low Frequency Oscillator) to simulate waves
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.3, ctx.currentTime);

      // Create LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // 12 seconds per wavecycle

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.25, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(waveGain.gain);

      whiteNoise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);

      lfo.start();
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise as any;
      lfoNodeRef.current = lfo;
      lfoGainRef.current = lfoGain;
      setIsPlaying(true);
    } else if (ambientSound === "cafe" || ambientSound === "forest" || ambientSound === "ocean") {
      // Simulating other options with custom frequency patterns and filters
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(500, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

      // Modulate frequency to sound like movement
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.5, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);

      whiteNoise.connect(bandpass);
      bandpass.connect(masterGain);

      lfo.start();
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise as any;
      lfoNodeRef.current = lfo;
      lfoGainRef.current = lfoGain;
      setIsPlaying(true);
    }
  };

  // React to volume changes
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(audioVolume, audioCtxRef.current.currentTime);
    }
  }, [audioVolume]);

  // React to sound selection changes
  useEffect(() => {
    if (isPlaying) {
      startSound();
    } else if (ambientSound !== "none" && !isPlaying) {
      // Auto-start playing when sound option changes
      startSound();
    }
  }, [ambientSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const handlePlayToggle = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }
    if (isPlaying) {
      stopAll();
    } else {
      if (ambientSound === "none") {
        setAmbientSound("rain"); // Default to rain if none chosen
      } else {
        startSound();
      }
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] border-accent-glow animate-pulse" />
          <span className="text-sm font-medium tracking-wide">Synthesized Ambiance</span>
        </div>
        <button
          onClick={handlePlayToggle}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
          title={isPlaying ? "Pause Ambiance" : "Play Ambiance"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-xs">
        {(["none", "rain", "ocean", "white_noise", "cafe", "forest"] as const).map((sound) => (
          <button
            key={sound}
            onClick={() => {
              initAudio();
              setAmbientSound(sound);
            }}
            className={cn(
              "py-1.5 px-1 rounded-md text-center font-medium capitalize cursor-pointer transition-all border border-transparent",
              ambientSound === sound
                ? "bg-accent-gradient text-white shadow-md border-white/10"
                : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-white"
            )}
          >
            {sound.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5 mt-1">
        <button
          onClick={() => setAudioVolume(audioVolume === 0 ? 0.5 : 0)}
          className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
        >
          {audioVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audioVolume}
          onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
        />
        <span className="text-[10px] font-mono text-[var(--text-muted)] w-8 text-right">
          {Math.round(audioVolume * 100)}%
        </span>
      </div>

      {!synthSupported && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-400/10 p-2 rounded-md">
          <AlertCircle size={12} />
          <span>Web Audio API blocked or unsupported.</span>
        </div>
      )}
    </div>
  );
}
