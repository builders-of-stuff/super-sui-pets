export class SoundManager {
    ctx: AudioContext | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    play(type: 'attack' | 'faint' | 'buy' | 'sell' | 'roll' | 'freeze') {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        switch (type) {
            case 'attack':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'faint':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'buy':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.setValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'sell':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.setValueAtTime(400, now + 0.1);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'roll':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(200, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'freeze':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
        }
    }
}

export const sounds = new SoundManager();
