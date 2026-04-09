import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { AlarmPhase } from '@/data/types';
import type { AlarmIntensity } from '@/store/useSettingsStore';

let player: AudioPlayer | null = null;
let hapticInterval: ReturnType<typeof setInterval> | null = null;
let currentPhase: AlarmPhase = 'none';
let currentIntensity: AlarmIntensity = 'normal';

export function setIntensity(intensity: AlarmIntensity): void {
  currentIntensity = intensity;
}

async function ensurePlayer(): Promise<void> {
  if (player) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
    player = createAudioPlayer(require('@/assets/sounds/alarm.wav'));
  } catch {
    player = null;
  }
}

function clearHapticInterval(): void {
  if (hapticInterval) {
    clearInterval(hapticInterval);
    hapticInterval = null;
  }
}

function stopSound(): void {
  if (!player) return;
  try {
    player.pause();
    player.seekTo(0);
  } catch {
    // ignore
  }
}

export async function triggerGentle(): Promise<void> {
  if (currentPhase === 'gentle') return;
  currentPhase = 'gentle';
  await dismiss();

  const config = {
    soft:   { style: Haptics.ImpactFeedbackStyle.Light,  interval: 3000, cycles: 2 },
    normal: { style: Haptics.ImpactFeedbackStyle.Light,  interval: 2000, cycles: 3 },
    loud:   { style: Haptics.ImpactFeedbackStyle.Medium, interval: 1500, cycles: 4 },
  }[currentIntensity];

  let count = 0;
  hapticInterval = setInterval(() => {
    if (count >= config.cycles) {
      clearHapticInterval();
      return;
    }
    Haptics.impactAsync(config.style);
    count++;
  }, config.interval);
}

export async function triggerWarning(): Promise<void> {
  if (currentPhase === 'warning') return;
  currentPhase = 'warning';
  await dismiss();

  const config = {
    soft:   { style: Haptics.ImpactFeedbackStyle.Medium, interval: 2000, volume: 0.15 },
    normal: { style: Haptics.ImpactFeedbackStyle.Heavy,  interval: 1500, volume: 0.3 },
    loud:   { style: Haptics.ImpactFeedbackStyle.Heavy,  interval: 1000, volume: 0.5 },
  }[currentIntensity];

  hapticInterval = setInterval(() => {
    Haptics.impactAsync(config.style);
  }, config.interval);

  await ensurePlayer();
  if (player) {
    try {
      player.volume = config.volume;
      player.loop = true;
      player.play();
    } catch {
      // ignore
    }
  }
}

export async function triggerFull(): Promise<void> {
  if (currentPhase === 'full') return;
  currentPhase = 'full';
  await dismiss();

  const config = {
    soft:   { interval: 800, volume: 0.6 },
    normal: { interval: 500, volume: 1.0 },
    loud:   { interval: 300, volume: 1.0 },
  }[currentIntensity];

  hapticInterval = setInterval(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, config.interval);

  await ensurePlayer();
  if (player) {
    try {
      player.volume = config.volume;
      player.loop = true;
      player.play();
    } catch {
      // ignore
    }
  }
}

export async function dismiss(): Promise<void> {
  clearHapticInterval();
  stopSound();
  currentPhase = 'none';
}

export async function triggerPhase(phase: AlarmPhase): Promise<void> {
  switch (phase) {
    case 'gentle':
      return triggerGentle();
    case 'warning':
      return triggerWarning();
    case 'full':
      return triggerFull();
    case 'none':
      return dismiss();
  }
}

export async function preload(): Promise<void> {
  await ensurePlayer();
}
