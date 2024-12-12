# JacobBot - Discord Music and Gaming Bot

JacobBot is a versatile Discord bot designed for **music playback**, **playlist creation**, and **interactive games**. 

---

## Features

### Music Playback
- **Play Music**: Use `/play` to play music directly from YouTube links in your voice channel.
  - Example: `/play url:https://www.youtube.com/watch?v=example`
- **Queue Management**: Automatically manages a song queue, allowing seamless transitions between tracks.
- **Skip Songs**: Use `/skip` to move to the next song in the queue.
- **Stop Music**: Clear the queue and stop playback with `/stop`.

### Playlist Management
- Create and manage server-wide playlists during voice calls.
- Songs are automatically queued for uninterrupted playback.
- Displays track titles for each song played.

### Interactive Games
- **Kill Command**: A game-like feature allowing users to "kill" (kick from the server) others in voice channels.
  - **1/6 Chance of Backfire**: The initiator risks becoming the target.
  - **Escape Mechanic**: Targets can evade if they leave the call within one second.
  - **Role Restoration**: Kicked users’ roles are automatically restored if they rejoin within 30 seconds.
  - Example: `/kill target:@username`

---

## Commands Overview

| Command    | Description                                                  |
|------------|--------------------------------------------------------------|
| `/play`    | Play a YouTube song in the current voice channel.            |
| `/skip`    | Skip the currently playing song.                             |
| `/stop`    | Stop the music and clear the queue.                          |
| `/kill`    | Initiate an assassination attempt.                           |
| `/speak`   | JacobBot responds with a predefined message.                 |

---

