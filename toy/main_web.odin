package toy

import "base:runtime"
import "core:c"
import "core:mem"

@(private="file")
web_context: runtime.Context

@export
main_start :: proc "c" () {
	context = runtime.default_context()
	context.allocator = emscripten_allocator()
	runtime.init_global_temporary_allocator(1*mem.Megabyte)
	context.logger = create_emscripten_logger()
	web_context = context
	init()
}

@export
main_update :: proc "c" () -> bool {
	context = web_context
	free_all(context.temp_allocator)
	update()
	return true
}

@export
main_end :: proc "c" () {
	context = web_context
	shutdown()
}

@export
web_window_size_changed :: proc "c" (w, h: c.int) {
	context = web_context
	resize(int(w), int(h))
}
