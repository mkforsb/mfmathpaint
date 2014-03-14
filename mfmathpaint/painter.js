/**
 * This file is part of mfMathPaint
 * Copyright (C) 2014  Mikael Forsberg <mikael@liveforspeed.se>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
mfMathPaint.Painter = function(host)
{
	this.host = host;
	
	this.painting = false;
	this.tool = 'pencil';
	this.shiftKey = false;
	this.mx = 0;
	this.my = 0;
	
	this.iconPencilOn = new Image();
	this.iconPencilOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIMCA0L+JnNWgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAE1SURBVFjD5dm9DYMwEAXgZ0QFY7BCCHWaLJANMkVGiDIEG2SG1IgZGANap4hMyJ8w9t3ZKK4QIPHp3R3IQgHQWMFKAaBpmqiRVVU9oABw2l7EHnxTVwDATh9m792fN89EpYFDewQAZKq2BqeSSAM0awqewyahkEtXEsOwDO1xbItgUIo0o0k0KwP3KFWaUSRqkyYrlDJNNqgt0jbNoKVfgmSBUpc8aKJL0ySHcqVJCuUYoOi+TGJQ7jRFE/VBkkA5B0g8Ud80vaFSaXpBJQZIrPRUSGeoZMm9t8tZWX/d+nKk6QQ1u0Xddy/nVV6wpuxU+nckZ2+SD5Puu492iPqFz5GmM1Tlxc9rHEivqTdY3XfjMRfSCzoFcwJJoBJAL6gk0HmYQiD/b88k2qPm70OsS2ElP8TumV+KbLwK5o0AAAAASUVORK5CYII=';
	
	this.iconPencilOff = new Image();
	this.iconPencilOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIMCAwyvod0EwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEsSURBVFjD5dlLDkRAEAbg38SKC9hZOIO4j4NZuos4g4VDsO1ZTNqYV+iuR7dMrwSJL39VkY4EgMEFVgoAwzBEjWya5gEFgKIo1B5cliUAYJ7nw3v7vn8mqg1cxxYAkDmAU02kBdq1Bx9hb6GQrusWw7CsY7u1RTAoR5rRJJrVXdge5UozikTPpCkK5UxTDHoWeTbNoKV3QYpAuUseNFHXNNmhUmmyQiUGKLovkxpUOk3VRClIFqjkAKknSk2TDNVKkwTVGCC10nMhvaGaJSdvl7O6+7r1lUjTC2p3i2aZXs4neSWaslfp35GSvck+TGaZPtoh6he+RJre0CSvfl6TQJKm3mLNMm3HUkgSdA+WBLJANYAkqCbQe5hCIP9vz6Tao/bvQ6wrwUV+iN0BMN+P6uv8YVwAAAAASUVORK5CYII=';
	
	this.buttonPencil = new mfMathPaint.Button(42, 42, 'Pencil');
	this.buttonPencil.AddGraphic('on', this.iconPencilOn);
	this.buttonPencil.AddGraphic('off', this.iconPencilOff);
	this.buttonPencil.OnClick = this.ButtonPencilClicked.bind(this);
	this.buttonPencil.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonPencil.SetActiveGraphic('on');
	
	this.iconLineOn = new Image();
	this.iconLineOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIMCCUdURDWoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEJSURBVFjD7dm9DYMwEAXg54iRUKhpWIBlskFQdskM1ExFiiTIsbAw9v1ZynXg5tNxV/DsAKyooBoAWJbFNLLrujcUAG7XhwnU7J7o13F7HqYWAHBBJfWHsiyTxhyG1a/j9t4/H+6tHtRflj38z/lk6NNHkZZmNETujYU6NKWT6tAzSDXoWaQK9AhpYplyOikOLUGKQUuRIlAKJDuUCskKpUSyQamRLFAOJDmUC0kK5USSQbmRJFAJZDFUClkElURmQ6WRWVANZBQa+8HSQp7qqCYyGaqNTIJaQB5CrSCj0DCx0EYmbb0FJOCleUdRoDa82QP4ObqVjtaXOH9vH4BPyjvZgjpUciH2ApUygkA3XLP6AAAAAElFTkSuQmCC';
	
	this.iconLineOff = new Image();
	this.iconLineOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIMCCUK0sNTZgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEDSURBVFjD7djNCYUwEATg8WERuVmGtVmBnVhG7ikjlfgOgoRgMJr9C7g39fKx7BycAcCODmYEgBCCaeQ8zwcUAJxzJlDTNCHGeD5v2wYA+KGT+aAsYdK4w3xijOf79Pu6rnrQNCxXeLNhKiFN3WiOvDoLdWjNJtWhT5Bq0KdIFegd0kSY3mxSHNqCFIO2IkWgFEh2KBWSFUqJZINSI1mgHEhyKBeSFMqJJINyI0mgEshmqBSyCSqJfA2VRr6CaiCL0NIPlhby0UY1kdVQbWQV1ALyFmoFWYTmjYU2sir1FpBA0ubdVYHa8PEKkPboVjbaTeM8ANhDCPDem0Uuy3JAe9joH0ZCib8gFUVRAAAAAElFTkSuQmCC';
	
	this.buttonLine = new mfMathPaint.Button(42, 42, 'Line');
	this.buttonLine.AddGraphic('on', this.iconLineOn);
	this.buttonLine.AddGraphic('off', this.iconLineOff);
	this.buttonLine.OnClick = this.ButtonLineClicked.bind(this);
	this.buttonLine.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonLine.SetActiveGraphic('off');
	
	this.iconEraserOn = new Image();
	this.iconEraserOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIKEQAiORnsWAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFVSURBVFjD7ZlBDoIwEEX/kB5JZO3GC3gADsHGIxgTD+EBOANr4qHqwkgQsXTKjG2Ns4IQyONP/7SdEgCLDMIAQN/3SUNWVfUABYDj9pwk5P60AQAUyCT+oCpmkoiO2uF6Zw9pgnbU4nK9DfcNlS/PJcCNRprG0FLgRlpNLXATwxifwF3AhbaaIeDJlqemLvVApdRs6lJPUSnIbGYmXzWDQGOoGVXRsZpNXS7W0iK2mj6QLFBJSM7YZIGOV0bfTjl7CrXWgojYM0qUZZ61rxtWLnioml6gHbVvgFLg0dajvuBcNRfN5FLTF3z6fgikE3Qt5FdnpmnqQoKIhh8OVXNxjM6VpFgqm7UGcYGP1Vy7GzXSzp4DlxhCRrMkSampYqZpSSIi3QbE8+PZmGmqBtdMUn0o9hhdAx7VTC5wya6eeEtHo+WYTKfkp0CH1D9PH1INQiYHYneE1MI/Iyh70wAAAABJRU5ErkJggg==';
	
	this.iconEraserOff = new Image();
	this.iconEraserOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIKEDIlS89HvQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFLSURBVFjD7ZnBcYQwDEW/GBfBTVUwlEMR1JEicqEXJlVQiXPILEMcYiwjre2d1YkLzONbX7JlAuDRQDgAWNe1ashxHH9AAaDv+yohl2UBAHRoJN6gJmbSCGben7dtqxOUmfHx+XUKrQXuLJbpCK0F7rTVtAJ3JYzxH3gMuLNWMwe82vI0T4MdqJaa8zTYKaoF2UxnSlUzC7SEmkUVPao5T8NlLe1Kq5kCKQLVhJTkpgg0bHnPXHJxC/Xeg4jEHaXINs/73wdWKXiumkmgzPwHUAu82H40FVyq5qWZYmqmgofv50BGQe9CPrUzhUuXE0S0/3Cumpc5elaSSqns7hokBn5U8+5p1Gk7+wxcI4WcZUnSUtPETGFJIiLbAcTj482YKVRDaiatOZQ4R++AFzVTDFxzqqc+0rEYOVYzKXkp0H3pH7cPtQahkQuxb2x9y4/oBKEYAAAAAElFTkSuQmCC';
	
	this.buttonEraser = new mfMathPaint.Button(42, 42, 'Eraser');
	this.buttonEraser.AddGraphic('on', this.iconEraserOn);
	this.buttonEraser.AddGraphic('off', this.iconEraserOff);
	this.buttonEraser.OnClick = this.ButtonEraserClicked.bind(this);
	this.buttonEraser.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonEraser.SetActiveGraphic('off');
	
	this.host.AddButton(this.buttonPencil);
	this.host.AddButton(this.buttonLine);
	this.host.AddButton(this.buttonEraser);
	
	this.host.RegisterHandler('LINE', this, true);
}

mfMathPaint.Painter.prototype.ButtonPencilClicked = function()
{
	this.buttonPencil.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
	this.tool = 'pencil';
}

mfMathPaint.Painter.prototype.ButtonLineClicked = function()
{
	this.buttonLine.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
	this.tool = 'line';
}

mfMathPaint.Painter.prototype.ButtonEraserClicked = function()
{
	this.buttonEraser.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
	this.tool = 'eraser';
}

mfMathPaint.Painter.prototype.handleEvent = function(event)
{
	if (event.type == 'mousedown')
	{
		this.painting = true;
		this.mx = event.pageX;
		this.my = event.pageY;
		
		// paint a dot
		if (this.tool == 'pencil')
		{
			this.PaintLine(this.host.ctxMiddle, this.mx, this.my, this.mx + 2, this.my + 1, this.host.color);
			this.host.SendInstruction('LINE', 0, this.mx, this.my, this.mx + 2, this.my + 1, this.host.color);
		}
	}
	else if (event.type == 'mousemove' && this.painting)
	{
		if (this.tool == 'pencil')
		{
			// don't paint if mouse didn't actually move
			if (this.mx != event.pageX || this.my != event.pageY)
			{
				this.PaintLine(this.host.ctxMiddle, this.mx, this.my, event.pageX, event.pageY, this.host.color);
				this.host.SendInstruction('LINE', 0, this.mx, this.my, event.pageX, event.pageY, this.host.color);
			}
		}
		else if (this.tool == 'line')
		{
			this.host.ClearTopLayer();
			this.PaintLine(this.host.ctxTop, this.mx, this.my, event.pageX, event.pageY, this.host.color);
		}
		else if (this.tool == 'eraser')
		{
			this.host.ClearTopLayer();
			
			var needsRepaint = false;
			var ctx = this.host.ctxTop;
			
			ctx.lineWidth = 1.0;
			ctx.beginPath();
			ctx.arc(event.pageX, event.pageY, 20.0, 0, 7, false);
			ctx.stroke();
			ctx.closePath();
			
			for (var key in this.host.instructionCache)
			{
				var instr = this.host.instructionCache[key];
				
				if (instr.instrName != 'LINE')
				{
					continue;
				}
				
				var x1, y1, x2, y2;
				
				x1 = instr.data1;
				y1 = instr.data2;
				x2 = instr.data3;
				y2 = instr.data4;
				
				var k;
				
				if (x1 - x2 == 0)
				{
					x1 += 0.0001;
				}
				
				if (y1 - y2 == 0)
				{
					y1 += 0.0001;
				}
				
				k = (y1 - y2) / (x1 - x2);
				
				var m = y1 - k * x1;
				var x = (event.pageX - (k * m) + (k * event.pageY)) / (1 + (k * k));
				
				if (x < Math.min(x1, x2))
				{
					x = Math.min(x1, x2);
				}
				else if (x > Math.max(x1, x2))
				{
					x = Math.max(x1, x2);
				}
				
				var d = Math.sqrt(Math.pow((x - event.pageX), 2) + Math.pow(k * x + m - event.pageY, 2));
				
				if (d < 20.0)
				{
					this.host.DeleteInstruction(key, true);
					needsRepaint = true;
				}
			}
			
			if (needsRepaint)
			{
				this.host.Repaint();
			}
		}
		
		if (this.tool == 'pencil' || this.tool == 'eraser')
		{
			this.mx = event.pageX;
			this.my = event.pageY;
		}
	}
	else if (this.painting && event.type == 'mouseup')
	{
		this.painting = false;
		
		if (this.tool == 'line' || (this.tool == 'pencil' && (this.mx != event.pageX || this.my != event.pageY)))
		{
			this.PaintLine(this.host.ctxMiddle, this.mx, this.my, event.pageX, event.pageY, this.host.color);
			this.host.SendInstruction('LINE', 0, this.mx, this.my, event.pageX, event.pageY, this.host.color);
		}
		
		if (this.tool == 'line' || this.tool == 'eraser')
		{
			this.host.ClearTopLayer();
		}
	}
	else if (this.tool == 'pencil' && event.type == 'keydown' && event.keyCode && event.keyCode == 16)
	{
		this.shiftKey = true;
		this.tool = 'line';
	}
	else if (this.shiftKey == true && event.type == 'keyup' && event.keyCode && event.keyCode == 16)
	{
		this.shiftKey = false;
		this.tool = 'pencil';
	}
}

mfMathPaint.Painter.prototype.PaintLine = function(ctx, x1, y1, x2, y2, color)
{
	if (typeof color == undefined)
	{
		color = '#000000';
	}
	
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}

mfMathPaint.Painter.prototype.HandleInstruction = function(instr)
{
	this.PaintLine(this.host.ctxMiddle, instr.data1, instr.data2, instr.data3, instr.data4, instr.text);
}

mfMathPaint.Painter.prototype.Repaint = function()
{
	for (var key in this.host.instructionCache)
	{
		var instr = this.host.instructionCache[key];
		
		if (instr.instrName == 'LINE')
		{
			this.HandleInstruction(instr);
		}
	}
}
