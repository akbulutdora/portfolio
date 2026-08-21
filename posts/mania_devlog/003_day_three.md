# day three: handle-based entity system, reading game data from json

**Date**: 03.06.2025

**Session Duration**: 11:00 - 17:00

## Progress

1. **Handle-Based Entity System**
I implemented Karl Zylinski's [Static Handle Maps](https://www.youtube.com/watch?v=MzR1us2nZPY) for my entity system. I migrated my Player to be an Entity. The implementation isn't complete. I still need to migrate the animation, but that's another day's work.
```odin
Entity_Type :: enum {
	None,
	Player,
	Letter,
}

Entity_Type_Data :: union {
	Player_Data,
	Letter_Data,
}

Letter_Data :: struct {
	id:       string,
	response: string,
	content:  string,
	mood:     PlayerMood,
}

TextureName :: enum {
	Player,
	Letter,
}

Player_Data :: struct {
	state:         PlayerState,
	grounded:      bool,
	flipped:       bool,
	is_running:    bool,
	mood:          PlayerMood,
	idle_anim:     AnimatedSprite,
	run_anim:      AnimatedSprite,
	jump_anim:     AnimatedSprite,
	anim_instance: AnimationInstance,
}

Entity :: struct {
	handle:   Entity_Handle,
	type:     Entity_Type,
	pos:      Vec2,
	vel:      Vec2,
	size:     Vec2,
	color:    rl.Color,
	tex:      TextureName,
	// anim: Animation,
	collider: Rect,
	disabled: bool,
	data:     Entity_Type_Data,
}
```


2. **Reading Game Data From Json**
I needed the letters to contain data, and my current ASCII-based level data can't support this. Therefore I decided to store these as JSON.

Here is how I store the data for now:
```json
{
  "data": [
    {
      "level_id": 1,
      "letters": [
        {
          "id": "1_1",
          "pos": [4, 10],
          "content": "A",
          "mood": "angry",
          "response": "I am angry!"
        },
        {
          "id": "1_2",
          "pos": [5, 13],
          "content": "B",
          "mood": "inspired",
          "response": "I am happy!"
        }
      ]
    }
  ]
}
```

And here is how I load it.
```odin
LEVEL_COUNT :: 32
LETTER_COUNT :: 8

@(private = "file")
Letter_Data :: struct {
	id:       string,
	pos:      Vec2,
	content:  string,
	mood:     string,
	response: string,
}

@(private = "file")
Level_Data :: struct {
	level_id: int,
	letters:  [LETTER_COUNT]Letter_Data,
}

@(private = "file")
Level_Letter_Data :: struct {
	data: [LEVEL_COUNT]Level_Data,
}

parse_letter_data_json :: proc() -> Level_Letter_Data {
	abs_path, _ := path.abs("./", context.temp_allocator)
	file_name := fmt.tprintf("%v/assets/levels/letter_data.json", abs_path)

	data, ok := os.read_entire_file_from_filename(file_name)
	if !ok {
		panic("Failed to load the letter data file!")
	}
	defer delete(data)

	level_letter_data: Level_Letter_Data
	unmarshal_err := json.unmarshal(data, &level_letter_data, allocator = context.temp_allocator)
	if unmarshal_err != nil {
		panic("Failed to unmarshal letter json file!")
	}

	return level_letter_data
}
```

## Notes
- The structure of all this could change. I am still learning and figuring out how to do things.
- I am slightly aware that I could optimize game data loading by storing them as binary, since parsing JSON is slow. Maybe I do that as a pre-compilation step. But I think my game is too small for this.


## Next Steps
- Mood-based abilities (Still need to implement Inspired and Sad mood abilities. I think I'll do Sad the latest because it requires me to implement disabling collision temporarily)
- Collecting letters, displaying letter content
- One way platforms
- A second level that has one way platforms, and an animated enemy
- Level transitions
