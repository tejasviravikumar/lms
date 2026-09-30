import { useEffect, useRef } from 'react'
import { api } from '../api'

let playerApiPromise
function loadPlayerApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!playerApiPromise) playerApiPromise = new Promise(resolve => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT) }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(script)
    }
  })
  return playerApiPromise
}

export function YouTubeLesson({ videoId, assignmentId, module, initialWatched = 0, initialPosition = 0, onProgress, notify }) {
  const host = useRef(null)
  const player = useRef(null)
  const onProgressRef = useRef(onProgress)
  const notifyRef = useRef(notify)
  onProgressRef.current = onProgress
  notifyRef.current = notify
  useEffect(() => {
    let timer
    let active = true
    let lastPosition = initialPosition
    let lastTick = 0
    let watchedSeconds = initialWatched
    loadPlayerApi().then(YT => {
      if (!active || !host.current) return
      player.current = new YT.Player(host.current, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: () => { if (initialPosition > 0) player.current.seekTo(initialPosition, true) },
          onStateChange: event => {
            if (event.data === YT.PlayerState.PLAYING && !timer) {
              lastPosition = player.current.getCurrentTime() || 0
              lastTick = Date.now()
              timer = window.setInterval(async () => {
                if (!active || !player.current?.getDuration) return
                const now = Date.now(); const position = player.current.getCurrentTime() || 0; const duration = player.current.getDuration() || module.durationSeconds || 0
                const elapsed = Math.max(0, (now - lastTick) / 1000)
                const watchedDelta = Math.min(Math.max(0, position - lastPosition), elapsed + 2)
                watchedSeconds = Math.min(duration, watchedSeconds + watchedDelta)
                lastPosition = position; lastTick = now
                if (!duration) return
                try {
                  const result = await api.put(`/assignments/${assignmentId}/modules/${module._id}/progress`, { watchedSeconds, lastPositionSeconds: position, durationSeconds: duration })
                  if (result.data?.progress?.completed) { onProgressRef.current?.(); if (timer) window.clearInterval(timer); timer = null; player.current.pauseVideo() }
                } catch (error) { notifyRef.current?.({ message: error.message || 'Could not save video progress', type: 'error' }) }
              }, 10_000)
            } else if (timer) { window.clearInterval(timer); timer = null }
          },
        },
      })
    }).catch(() => notifyRef.current?.({ message: 'YouTube player could not be loaded', type: 'error' }))
    return () => { active = false; if (timer) window.clearInterval(timer); player.current?.destroy?.(); player.current = null }
  }, [videoId, assignmentId, module._id, module.durationSeconds])
  return <div className="video-frame"><div ref={host}/></div>
}
