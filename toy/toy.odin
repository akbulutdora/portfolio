// A small interactive canvas for the portfolio page. No engine: raylib for
// drawing and input, everything else is hand-written. All motion uses dt, so
// it runs the same at 30, 60, or 144 Hz.
package toy

import rl "vendor:raylib"
import "core:math"
import "core:math/rand"
import "core:fmt"

Ball :: struct {
	pos, vel: rl.Vector2,
	r:        f32,
	col:      rl.Color,
}

MAX_BALLS :: 256
GRAVITY   :: 1800.0
BOUNCE    :: 0.82

balls:      [dynamic]Ball
w, h:       f32 = 960, 540
show_stats: bool = true
palette := [?]rl.Color{
	{0xF2, 0x5F, 0x4C, 255}, {0xF2, 0xB1, 0x34, 255}, {0x3E, 0xB4, 0x89, 255},
	{0x3F, 0x88, 0xC5, 255}, {0xA1, 0x5E, 0xC9, 255}, {0xEE, 0xEE, 0xEE, 255},
}

init :: proc() {
	rl.SetConfigFlags({.VSYNC_HINT, .WINDOW_RESIZABLE})
	rl.InitWindow(i32(w), i32(h), "toy")
	balls = make([dynamic]Ball, 0, MAX_BALLS)
	for _ in 0..<12 do spawn({rand.float32() * w, rand.float32() * h * 0.5})
}

spawn :: proc(at: rl.Vector2) {
	if len(balls) >= MAX_BALLS do ordered_remove(&balls, 0)
	a := rand.float32() * math.TAU
	s := 200 + rand.float32() * 400
	append(&balls, Ball{
		pos = at,
		vel = {math.cos(a) * s, math.sin(a) * s},
		r   = 8 + rand.float32() * 18,
		col = palette[rand.int_max(len(palette))],
	})
}

update :: proc() {
	dt := min(rl.GetFrameTime(), 1.0 / 20.0) // clamp so a paused tab does not explode

	if rl.IsMouseButtonDown(.LEFT) do spawn(rl.GetMousePosition())
	if rl.IsKeyPressed(.SPACE)     do clear(&balls)
	if rl.IsKeyPressed(.S)         do show_stats = !show_stats

	for &b in balls {
		b.vel.y += GRAVITY * dt
		b.pos   += b.vel * dt
		if b.pos.y + b.r > h { b.pos.y = h - b.r; b.vel.y = -b.vel.y * BOUNCE; b.vel.x *= 0.99 }
		if b.pos.x - b.r < 0 { b.pos.x = b.r;     b.vel.x = -b.vel.x * BOUNCE }
		if b.pos.x + b.r > w { b.pos.x = w - b.r; b.vel.x = -b.vel.x * BOUNCE }
	}

	rl.BeginDrawing()
	rl.ClearBackground({0x10, 0x10, 0x12, 255})
	for b in balls {
		rl.DrawCircleV(b.pos + {0, 3}, b.r, {0, 0, 0, 90})
		rl.DrawCircleV(b.pos, b.r, b.col)
	}
	if show_stats {
		txt := fmt.ctprintf("%d balls   dt %.1f ms   %d fps", len(balls), dt * 1000, rl.GetFPS())
		rl.DrawText(txt, 12, 12, 16, {200, 200, 200, 255})
		rl.DrawText("click or drag to spawn   space clears   s hides this", 12, 32, 16, {120, 120, 120, 255})
	}
	rl.EndDrawing()
}

shutdown :: proc() {
	delete(balls)
	rl.CloseWindow()
}

resize :: proc(nw, nh: int) {
	w, h = f32(nw), f32(nh)
	rl.SetWindowSize(i32(nw), i32(nh))
}
