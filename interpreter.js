function Brainfuck(instruction_callback, input_callback, output_callback)
{
	var instructions = [];
	var next = 0;
	var skiploop = 0;
	var loops_start = [];
	var data = [];
	var data_ptr = 0;
	var waiting_for_input = false;
	var waiting_for_instruction = false;
	
	var get_instruction = function(inst)
	{
		if(waiting_for_instruction === true)
		{
			instructions.push(inst);
			waiting_for_instruction = false;
		}
	}
	
	var get_input = function(input)
	{
		if(waiting_for_input === true)
		{
			data[data_ptr] = input;
			waiting_for_input = false;
		}
	}
	
	this.run = function()
	{
		while(waiting_for_input === false && waiting_for_instruction === false)
		{
			var current_inst = instructions[next];
			if(current_inst === undefined)
			{
				waiting_for_instruction = true;
				instruction_callback(get_instruction);
			}
			else
			{
				next++;
				if(skiploop > 0)
				{
					switch(current_inst)
					{
						case "[":
							skiploop++;
							break;
						case "]":
							skiploop--;
							break;
					}
				}
				else
				{
					switch(current_inst)
					{
						case ">":
							data_ptr++;
							break;
						case "<":
							data_ptr--;
							break;
						case "+":
							if(data[data_ptr] === undefined) data[data_ptr] = 1;
							else data[data_ptr] = (data[data_ptr] + 1) % 256;
							break;
						case "-":
							if(data[data_ptr] === undefined) data[data_ptr] = 255;
							else data[data_ptr] = (data[data_ptr] - 1) % 256;
							break;
						case ".":
							output_callback(data[data_ptr]);
							break;
						case ",":
							waiting_for_input = true;
							input_callback(get_input);
							return;
							break;
						case "[":
							if(data[data_ptr] === 0 || data[data_ptr] === undefined) skiploop = 1;
							else loops_start.push(next-1);
							break;
						case "]":
							var loop_pos = loops_start.pop();
							if(data[data_ptr] !== 0 && data[data_ptr] !== undefined) next = loop_pos;
							break;
					}
				}
				
			}
		}
	}
}