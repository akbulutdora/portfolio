# day two: automatic hot reload, smashing jump, player states

**Date**: 31.05.2025

**Session Duration**: 18:00 - 20:30

## Progress

1. **Automatic Hot Reloads**

- using entr to automatically reload the game when source files change

  `find . -name "*.odin" | entr -c ./build_hot_reload.sh`

2. **Player States and Targeted Jump**
- Added states for the player. The player can press E to jump and destroy a tile when angry.
```odin
PlayerState :: union {
	PlayerStateNormal,
	PlayerStateJumping,
	PlayerStateSmashing,
	PlayerStateDashing,
}

PlayerStateNormal :: struct {
}
PlayerStateJumping :: struct {
}
PlayerStateSmashing :: struct {
	smash_start_pos: Vec2,
	smash_progress:  f32,
	target_tile:     ^Tile,
	smash_peak:      Vec2,
}
```

## Notes

- I am not happy with the smashing jump trajectory math. I don't really understand the maths behind it and I don't like the way it looks.

## Next Steps
- Handle based entity system
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
