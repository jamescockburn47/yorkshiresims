import { events, Season } from '../game/events'
import { getTodayEvents, onEventsChanged } from '../game/state/events'

class AudioManagerImpl {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private windGain: GainNode | null = null
  private windFilter: BiquadFilterNode | null = null
  private lfo: OscillatorNode | null = null
  private lfoGain: GainNode | null = null
  private started = false
  private pubGain: GainNode | null = null
  private pubFilter: BiquadFilterNode | null = null
  private pubNoise: AudioBufferSourceNode | null = null
  private sheepTimer: number | null = null
  private processedEventIds: Set<string> = new Set()

  async start() {
    if (this.started) return
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.18
    this.masterGain.connect(this.ctx.destination)

    // Wind: filtered noise with gentle LFO on amplitude
    const noise = this.createNoiseBufferSource()
    this.windFilter = this.ctx.createBiquadFilter()
    this.windFilter.type = 'lowpass'
    this.windFilter.frequency.value = 1200
    this.windFilter.Q.value = 0.0001

    this.windGain = this.ctx.createGain()
    this.windGain.gain.value = 0.6

    // LFO to wind gain for gusts
    this.lfo = this.ctx.createOscillator()
    this.lfo.frequency.value = 0.05
    this.lfoGain = this.ctx.createGain()
    this.lfoGain.gain.value = 0.15
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.windGain.gain)

    noise.connect(this.windFilter)
    this.windFilter.connect(this.windGain)
    this.windGain.connect(this.masterGain)

    noise.start()
    this.lfo.start()

    // React to season changes
    events.on('seasonChanged', (s) => this.applySeason(s))
    events.on('timeUpdated', (t) => this.applyTimeMod(t))
    onEventsChanged(() => this.checkEventSounds())

    this.startSheepLoop()

    this.started = true
  }

  private createNoiseBufferSource() {
    const ctx = this.ctx!
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Pink-ish noise approximation by averaging white noise samples
      const white = Math.random() * 2 - 1
      data[i] = (data[i - 1] || 0) * 0.98 + white * 0.02
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    return src
  }

  private applySeason(season: Season) {
    if (!this.windFilter || !this.windGain) return
    // Adjust wind tone and level subtly per season
    switch (season) {
      case 'Spring':
        this.windFilter.frequency.setTargetAtTime(1400, this.ctx!.currentTime, 0.5)
        this.windGain.gain.setTargetAtTime(0.55, this.ctx!.currentTime, 0.5)
        break
      case 'Summer':
        this.windFilter.frequency.setTargetAtTime(1200, this.ctx!.currentTime, 0.5)
        this.windGain.gain.setTargetAtTime(0.45, this.ctx!.currentTime, 0.5)
        break
      case 'Autumn':
        this.windFilter.frequency.setTargetAtTime(1000, this.ctx!.currentTime, 0.5)
        this.windGain.gain.setTargetAtTime(0.6, this.ctx!.currentTime, 0.5)
        break
      case 'Winter':
        this.windFilter.frequency.setTargetAtTime(800, this.ctx!.currentTime, 0.5)
        this.windGain.gain.setTargetAtTime(0.7, this.ctx!.currentTime, 0.5)
        break
    }
  }

  private applyTimeMod(time01: number) {
    if (!this.lfo) return
    // Slightly vary LFO rate over the day
    const base = 0.04
    const span = 0.03
    const rate = base + span * Math.sin(time01 * Math.PI * 2)
    this.lfo.frequency.setTargetAtTime(rate, this.ctx!.currentTime, 0.5)
  }

  // Pub ambience (toggle)
  enablePubAmbience(on: boolean) {
    if (!this.ctx || !this.masterGain) return
    if (on) {
      if (this.pubGain) return
      this.pubGain = this.ctx.createGain()
      this.pubGain.gain.value = 0.0
      this.pubFilter = this.ctx.createBiquadFilter()
      this.pubFilter.type = 'bandpass'
      this.pubFilter.frequency.value = 300
      this.pubFilter.Q.value = 0.7
      this.pubNoise = this.createNoiseBufferSource()
      this.pubNoise.connect(this.pubFilter)
      this.pubFilter.connect(this.pubGain)
      this.pubGain.connect(this.masterGain)
      this.pubNoise.start()
      // fade in
      this.pubGain.gain.setTargetAtTime(0.25, this.ctx.currentTime, 1.0)
    } else {
      if (!this.pubGain) return
      this.pubGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.5)
      setTimeout(() => {
        this.pubNoise?.stop()
        this.pubNoise?.disconnect()
        this.pubFilter?.disconnect()
        this.pubGain?.disconnect()
        this.pubNoise = null
        this.pubFilter = null
        this.pubGain = null
      }, 800)
    }
  }

  // Sheep bleat one-shot
  private bleat() {
    if (!this.ctx || !this.masterGain) return
    const o1 = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o1.type = 'triangle'
    o1.frequency.value = 440 + Math.random() * 60
    g.gain.value = 0
    o1.connect(g)
    g.connect(this.masterGain)
    const now = this.ctx.currentTime
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.15, now + 0.05)
    g.gain.linearRampToValueAtTime(0.0, now + 0.35)
    o1.start()
    o1.stop(now + 0.4)
  }

  private startSheepLoop() {
    if (!this.ctx) return
    const schedule = () => {
      const delay = 7000 + Math.random() * 15000
      this.sheepTimer = window.setTimeout(() => {
        this.bleat()
        schedule()
      }, delay)
    }
    schedule()
  }

  private trainWhistle() {
    if (!this.ctx || !this.masterGain) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 520
    g.gain.value = 0
    o.connect(g)
    g.connect(this.masterGain)
    const now = this.ctx.currentTime
    // two-tone whistle
    o.frequency.setValueAtTime(520, now)
    o.frequency.linearRampToValueAtTime(760, now + 0.6)
    o.frequency.linearRampToValueAtTime(520, now + 1.2)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.35, now + 0.1)
    g.gain.linearRampToValueAtTime(0.0, now + 1.4)
    o.start()
    o.stop(now + 1.5)
  }

  private checkEventSounds() {
    const today = getTodayEvents()
    for (const e of today) {
      if (e.title.includes('Steam Gala') && !this.processedEventIds.has(e.id)) {
        this.trainWhistle()
        this.processedEventIds.add(e.id)
      }
    }
  }
}

export const AudioManager = new AudioManagerImpl()


