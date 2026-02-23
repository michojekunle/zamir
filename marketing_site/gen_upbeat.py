import wave, math, struct, random

def gen_upbeat(filename, duration, sample_rate):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        n_frames = int(duration * sample_rate)
        
        bpm = 125.0
        beat_dur = 60.0 / bpm
        
        for i in range(n_frames):
            t = i / float(sample_rate)
            beat_pos = (t % beat_dur) / beat_dur
            beat_idx = int(t / beat_dur)
            eight_dur = beat_dur / 2.0
            eight_pos = (t % eight_dur) / eight_dur
            
            # Kick (Four on the floor)
            kick_env = math.exp(-15 * beat_pos)
            kick_freq = 150 * kick_env + 40
            kick = math.sin(2 * math.pi * kick_freq * t) * kick_env * 0.9
            
            # Hi-hat (Offbeats)
            hh_env = math.exp(-20 * eight_pos)
            hh = (random.random() * 2 - 1) * hh_env
            if beat_pos > 0.5: hh *= 0.3
            else: hh *= 0.05
            
            # Bassline (Bouncing eighths)
            bass_root = 55.0 # A1
            bass_env = math.exp(-5 * eight_pos)
            bar_idx = beat_idx // 4
            if bar_idx % 4 == 0: bass_freq = bass_root
            elif bar_idx % 4 == 1: bass_freq = bass_root * (2**(3/12.0))
            elif bar_idx % 4 == 2: bass_freq = bass_root * (2**(7/12.0))
            else: bass_freq = bass_root * (2**(5/12.0))
            bass = math.sin(2 * math.pi * bass_freq * t) * bass_env * 0.5
            
            # Chords (Upbeat stabs on the offbeats)
            chord_env = math.exp(-8 * eight_pos)
            if beat_pos < 0.5: chord_env *= 0.2
            
            chord_vol = 0.15
            chord_root = bass_freq * 4
            c1 = math.sin(2 * math.pi * chord_root * t) * chord_env * chord_vol
            c2 = math.sin(2 * math.pi * chord_root * (2**(4/12.0)) * t) * chord_env * chord_vol
            if bar_idx % 4 == 0:
                c2 = math.sin(2 * math.pi * chord_root * (2**(3/12.0)) * t) * chord_env * chord_vol
            c3 = math.sin(2 * math.pi * chord_root * (2**(7/12.0)) * t) * chord_env * chord_vol
            
            chords = c1 + c2 + c3
            
            # Mix down
            left = kick * 0.7 + hh * 0.5 + bass * 0.6 + chords * 0.5
            right = kick * 0.7 + hh * 0.7 + bass * 0.6 + chords * 0.5
            
            # Master fade out
            if t > duration - 2.0:
                fade = max(0, 1.0 - (t - (duration - 2.0)) / 2.0)
                left *= fade
                right *= fade
            
            left = max(-1.0, min(1.0, left))
            right = max(-1.0, min(1.0, right))
            
            wav_file.writeframesraw(struct.pack('<hh', int(left * 32767), int(right * 32767)))

print("Generating lively upbeat track...")
gen_upbeat("public/lively_ad.wav", 19.0, 44100)
print("Done.")
