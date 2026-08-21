# day one: dev environment, camera zoom, frame-rate independence, mood states

**Date**: 30.05.2025

**Session Duration**: 10:00 - 14:00

## Progress
1. **Environment**
    - Migrated to Zed editor (AI features disabled for focused learning)
    - Ported project to updated Odin/Raylib template (Karl's latest)
2. **Core Systems**
    - Fixed camera zoom:
        - Always shows full game height
        - Window resize doesn't affect visible area in y axis
    - Frame-rate independence:
        - Player never falls through platforms during resize
        - Physics stable at any FPS
3. **Mood System**
    - Implemented mood states: `Sad | Angry | Inspired`
    - Visual feedback:
        - Player tint (Red=Angry, Blue=Inspired, Gray=Sad)
        - Breakable walls highlight red when angry
        - Target tile highlights green (direction-facing)
    - Special action bound to "E" key

## Notes
- Later on, I will need to fit the whole level to the window no matter what size. Is this called pixel perfection? Idk yet.
- Right now, I don't have any system for collision detection, entities ([Handles are the better pointers
](https://floooh.github.io/2018/06/17/handles-vs-pointers.html)), loading resources,

## Next Steps
- Player state machine transition: `Grounded → Breaking` on "E" key press
- Tile removal when broken
- Breaking jump trajectory math
- Letter data
```odin
Letter :: struct {
    id: int,
    content: string,
    mood: Mood,
    read_count: int,
    player_response: string,
}
```

- Storing level data in a better way, since current implementation is very limited
```
.........................
.........................
.........................
...............B.........
...............B.........
...............B.........
.........B.....B#........
.........B.....B#........
.........B##...B#........
.........B.....B#........
....L....B##...B#........
....#############........
....#....................
.S..#L............X......
#########################
```
