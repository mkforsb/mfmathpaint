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
mfMathPaint.Modules.UnitCircle = function(host)
{
	this.host = host;
	
	this.painting = false;
	this.mx = 0;
	this.my = 0;
	this.defaultObj = {'x1':0, 'y1':0, 'x2':0, 'y2':0, 'xmin':-1.3, 'xmax':1.3, 'ymin':-1.3, 'ymax':1.3};
	
	this.objectCache = {};
	this.pointedObject = false;
	
	this.iconUnitCircleOn = new Image();
	this.iconUnitCircleOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIUEwkB+f7SoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAGYSURBVFjD5ZmxccUgDIaFjj1YIhfXr8kCmYM+I+RSmjle4wVe7TGYxClyODwODAhE7ItasPTxI2QZCwDY4AImAQDWdT015DRNP6AAAB+vXyQnD3HPzrlt72TIt8+XX0Vb4ay1AACgtQYhBMzzvI8ppZ7mU6ElFdDBhbZtW3QRIXQtsOwFWGLuWQowlkJaa5sgQ2DnqyTHs6A+JIfVwGILpFJqGCz+JWQNLOYepo5TYYtBS5Oby1LxkUMtrTVorbuqilQ1XY4e5SoVOMaBVDVdLYzNN8aAMeYJuFVV5Mw3H5iibBSU8xBRYEMe5Cw5PUsVjgremgIIFzHJ4TSnGkXV/6moXztbbVmWcyha230hV+vWAhkbxx6ftL1buhjPZQ4TcnbuPdMCe91oUGBSUDEOmXLE+d5P+T7aTex5T9TDUvFxxFdmj5KFR6saXVePdhNzW8ANWwKZraPcsKWQRQXfh+0F7PsqPbyy5iQ+xH0PQClf/kJZ7kePgHPQ4S4MuXGOBQuha2rj0MZ51AtiB3V/H85qAi7yQ+wbU2jT3IyTDd8AAAAASUVORK5CYII=';
	
	this.iconUnitCircleOff = new Image();
	this.iconUnitCircleOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIUEwgebe3uFQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFwSURBVFjD5ZnREYMgDIZDjiF8cwynYhnZwQHcwjGYxD70aNHDAiFBueY5hO9+QoCgAGCHDkwDAGzb9mjIaZreoAAAwzCQgozjmPRxzpEhl2X5KloL50GMMaCUgnmeD76hPxVaUwGvJtz3/VLNELoUWHMB5pgfSwHGXEjnXBXkGTiErgalLhNFYTJoDmSuGhyweCdkCSxSax93OqTioaRSnAcISqhljAFjDKuqSFXT+/4aQwWOxUSqmr4WxvyttWCtPQDXqoqS+RYCU5SNgkpuIgrsmQclSw5nqcJWk9emAEInpiWCplSjqPqfioa1s9bWdX2GoqXlEGsGS0H+PEJb1tCcuc4+3WymPu+jrZY/dUWMceirQJLQV7GL3kx3X0yK76Otc5X0XC7tYnBBZr+Z7oDN7cYgV8tFEjKr4Mc6cByApX0tXbITa/qb55UR6Y+m1C3pUTXpOMcmy0kJjtpcfXFudUB8QP3vw1NNQScfYi8aGtXcOksvDwAAAABJRU5ErkJggg==';
	
	this.buttonUnitCircle = new mfMathPaint.Button(42, 42, 'Unit Circle');
	this.buttonUnitCircle.AddGraphic('on', this.iconUnitCircleOn);
	this.buttonUnitCircle.AddGraphic('off', this.iconUnitCircleOff);
	this.buttonUnitCircle.OnClick = this.ButtonUnitCircleClicked.bind(this);
	this.buttonUnitCircle.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonUnitCircle.SetActiveGraphic('off');
	
	this.host.AddButton(this.buttonUnitCircle);
	
	this.host.RegisterHandler('UCIR1', this);
	this.host.RegisterHandler('UCIR2', this);
}

mfMathPaint.Modules.UnitCircle.prototype.ButtonUnitCircleClicked = function()
{
	this.host.SetActiveModule(this);
	this.buttonUnitCircle.SetActiveGraphic('on');
}

mfMathPaint.Modules.UnitCircle.prototype.handleEvent = function(event)
{
	if (!this.pointedObject && event.type == 'mousedown')
	{
		this.painting = true;
		this.mx = event.pageX;
		this.my = event.pageY;
	}
	else if (this.painting && (event.type == 'mousemove' || event.type == 'mouseup'))
	{
		this.host.ClearTopLayer();
		
		var o = this.defaultObj;
		
		o.x1 = Math.min(this.mx, event.pageX);
		o.y1 = Math.min(this.my, event.pageY);
		o.x2 = Math.max(this.mx, event.pageX);
		o.y2 = Math.max(this.my, event.pageY);
		
		if (o.x2 != o.x1 && o.y2 != o.y1)
		{
			if (event.type == 'mousemove')
			{
				this.Render(this.host.ctxTop, o);
			}
			else
			{
				this.painting = false;
				
				var id = this.host.GetNextObjectId();
				this.SendAndHandle('UCIR1', id, o.x1, o.y1, o.x2, o.y2, '');
			}
		}
		else if (event.type == 'mouseup')
		{
			this.painting = false;
		}
	}
	else if (!this.painting && event.type == 'mousemove')
	{
		this.pointedObject = false;
		
		for (var id in this.objectCache)
		{
			var o = this.objectCache[id][0];
			
			if (event.pageX > o.data1 && event.pageX < o.data3 && event.pageY > o.data2 && event.pageY < o.data4)
			{
				this.pointedObject = id;
				break;
			}
		}
		
		if (this.pointedObject && this.host.GetObjectInstructions(this.pointedObject).length == 0)
		{
			this.pointedObject = false;
		}
		
		if (this.pointedObject)
		{
			this.host.ClearTopLayer();
			var ctx = this.host.ctxTop;
			
			var o = this.objectCache[this.pointedObject][0];
			
			var cx = o.data1 + (Math.abs(o.data1 - o.data3) / 2);
			var cy = o.data2 + (Math.abs(o.data2 - o.data4) / 2);
			
			var rad = Math.abs(o.data2 - o.data4) / (2.6);
			var dx = Math.sqrt(Math.pow(cx - event.pageX, 2) + Math.pow(cy - event.pageY, 2));
			
			if (Math.abs(dx - rad) < 20)
			{
				var angle = Math.atan2(event.pageY - cy, event.pageX - cx);
				this.RenderSelectedAngle(ctx, cx, cy, rad, angle);
			}
		}
	}
	else if (this.pointedObject && event.type == 'mousedown')
	{
		var o = this.objectCache[this.pointedObject][0];
		
		var cx = o.data1 + (Math.abs(o.data1 - o.data3) / 2);
		var cy = o.data2 + (Math.abs(o.data2 - o.data4) / 2);
		var angle = Math.atan2(event.pageY - cy, event.pageX - cx);
		
		var id = this.pointedObject;
		
		if (typeof(this.objectCache[this.pointedObject][1]) !== undefined)
		{
			id = this.host.GetNextObjectId();
			this.host.DeleteObject(this.pointedObject, true);
			this.SendAndHandle('UCIR1', id, o.data1, o.data2, o.data3, o.data4, o.text);
		}
		
		this.SendAndHandle('UCIR2', id, Math.ceil(angle * 1000), 0, 0, 0, '');
		
		this.host.ClearTopLayer();
	}
}

mfMathPaint.Modules.UnitCircle.prototype.RenderSelectedAngle = function(ctx, x, y, rad, angle)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#f00';
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
	ctx.stroke();
	
	ctx.strokeStyle = '#00f';
	ctx.beginPath();
	ctx.arc(x + rad * Math.cos(angle), y + rad * Math.sin(angle), 5, 0, 7, false);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x, y, 30, 0, angle, true);
	ctx.stroke();
	
	ctx.lineWidth = 1.0;
	ctx.strokeStyle = '#000';
	
	ctx.beginPath();
	ctx.moveTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
	ctx.lineTo(x, y + rad * Math.sin(angle));
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
	ctx.lineTo(x + rad * Math.cos(angle), y);
	ctx.stroke();
	
	if (angle < 0)
	{
		angle = -angle;
	}
	else
	{
		angle = 2 * Math.PI - angle;
	}
	
	var angleText = (angle.toFixed(2) * (180 / Math.PI)).toFixed(1) + ' deg. ('+ angle.toFixed(2) + ' rad.)';
	var sinText = Math.sin(angle).toFixed(2);
	var cosText = Math.cos(angle).toFixed(2);
	
	this.RenderTextbox(ctx, x + 20, y - 20, angleText);
	this.RenderTextbox(ctx, x, y - rad * Math.sin(angle), sinText);
	this.RenderTextbox(ctx, x + rad * Math.cos(angle), y, cosText);
}

mfMathPaint.Modules.UnitCircle.prototype.RenderTextbox = function(ctx, x, y, text)
{
	ctx.font = '10pt "Verdana", sans-serif';
	
	ctx.globalAlpha = 0.6;
	ctx.lineWidth = 1.0;
	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#000';
	ctx.fillRect(x - 4, y - 14, ctx.measureText(text).width + 8, 18);
	ctx.strokeRect(x - 4, y - 14, ctx.measureText(text).width + 8, 18);
	
	ctx.globalAlpha = 1.0;
	
	ctx.fillStyle = '#000';
	ctx.fillText(text, x, y);
}

mfMathPaint.Modules.UnitCircle.prototype.HandleInstruction = function(instr)
{
	if (instr.instrName == 'UCIR1')
	{
		var x = instr.data1;
		var y = instr.data2;
		var w = instr.data3 - instr.data1;
		var h = instr.data4 - instr.data2;
		
		var ob = new mfMathPaint.Object(x, y, w, h);
		ob.SetHasPropertyEditor(false);
		
		this.Render(ob.image.getContext('2d'), {'x1':0, 'y1':0, 'x2':w, 'y2':h, 'xmin':-1.3, 'xmax':1.3, 'ymin':-1.3, 'ymax':1.3});
		this.host.AddObject(instr.objectId, ob);
		
		this.objectCache[instr.objectId] = new Array(instr);
	}
	else if (instr.instrName == 'UCIR2')
	{
		var o = this.host.GetObject(instr.objectId);
		var ctx = o.image.getContext('2d');
		
		var my = this.objectCache[instr.objectId][0];
		var rad = Math.abs(my.data2 - my.data4) / (2.6);
		
		this.RenderSelectedAngle(ctx, Math.abs(my.data1 - my.data3) / 2, Math.abs(my.data2 - my.data4) / 2, rad, instr.data1 / 1000);
		this.host.Repaint();
	}
}

mfMathPaint.Modules.UnitCircle.prototype.Render = function(ctx, obj)
{
	if (obj.y1 == obj.y2 || obj.x1 == obj.x2)
	{
		return;
	}
	
	var xrange = 1 / (Math.abs(obj.y1 - obj.y2) / ((obj.ymax - obj.ymin) * Math.abs(obj.x1 - obj.x2)));
	
	obj.xmin = -(xrange / 2);
	obj.xmax = xrange / 2;
	
	var p1 = {};
	var p2 = {};
	
	// draw vertical grid lines
	for (var i = Math.ceil(obj.xmin * 10) / 10; i < obj.xmax; i += 0.1)
	{
		p1 = this.Conv(obj, i, obj.ymin, 'screen');
		p2 = this.Conv(obj, i, obj.ymax, 'screen');
		
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = '#dedede';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// draw horizontal grid lines
	for (var i = obj.ymin; i < obj.ymax; i += 0.1)
	{
		p1 = this.Conv(obj, obj.xmin, i, 'screen');
		p2 = this.Conv(obj, obj.xmax, i, 'screen');
		
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = '#dedede';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// draw x-axis
	p1 = this.Conv(obj, obj.xmin, 0, 'screen');
	p2 = this.Conv(obj, obj.xmax, 0, 'screen');
	
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
	
	p1 = this.Conv(obj, obj.xmax, 0, 'screen');
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p1.x - 8, p1.y - 4);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p1.x - 8, p1.y + 4);
	ctx.stroke();
	
	if ((obj.x2 - obj.x1) > 300)
	{
		ctx.fillStyle = '#000';
		ctx.font = '10pt sans-serif';
		ctx.fillText('x = cos(v)', p1.x - 80, p1.y + 22);
	}
	
	// draw y-axis
	p1 = this.Conv(obj, 0, obj.ymin, 'screen');
	p2 = this.Conv(obj, 0, obj.ymax, 'screen');
	
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.closePath();
	ctx.stroke();
	
	p1 = this.Conv(obj, 0, obj.ymax, 'screen');
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p1.x - 4, p1.y + 8);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p1.x + 4, p1.y + 8);
	ctx.stroke();
	
	if ((obj.x2 - obj.x1) > 300)
	{
		ctx.fillStyle = '#000';
		ctx.font = '10pt sans-serif';
		ctx.fillText('y = sin(v)', p1.x + 12, p1.y + 22);
	}
	
	// draw the circle
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#00f';
	
	p1 = this.Conv(obj, 0, 0, 'screen');
	p2 = this.Conv(obj, 0, 1, 'screen');
	
	ctx.beginPath();
	ctx.arc(p1.x, p1.y, Math.abs(p1.y - p2.y), 0, 7, false);
	ctx.closePath();
	ctx.stroke();
	
	// draw frame
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.strokeStyle = '#ddd';
	
	ctx.beginPath();
	ctx.moveTo(obj.x1, obj.y1);
	ctx.lineTo(obj.x2, obj.y1);
	ctx.lineTo(obj.x2, obj.y2);
	ctx.lineTo(obj.x1, obj.y2);
	ctx.lineTo(obj.x1, obj.y1);
	ctx.closePath();
	ctx.stroke();
}

mfMathPaint.Modules.UnitCircle.prototype.Conv = function(obj, x, y, target)
{
	var result = {};
	
	var left   = obj.x1;
	var top    = obj.y1;
	var width  = obj.x2 - obj.x1;
	var height = obj.y2 - obj.y1;
	var x_min  = obj.xmin;
	var x_max  = obj.xmax;
	var y_min  = obj.ymin;
	var y_max  = obj.ymax;
	
	if (target == 'screen')
	{
		result.x = left + width * ((x - x_min) / (x_max - x_min));
		result.y = top + height * ((y_max - y) / (y_max - y_min));
	}
	else if (target == 'internal')
	{
		result.x = x_min + ((x - left) / width * (x_max - x_min));
		result.y = y_max - (y - top) / height * (y_max - y_min);
	}
	
	return result;
}

mfMathPaint.Modules.UnitCircle.prototype.Clear = function()
{
	this.objectCache = {};
	this.pointedObject = false;
}

mfMathPaint.Modules.UnitCircle.prototype.OnObjectDeleted = function(data)
{
	delete this.objectCache[data[0].objectId];
	
	if (this.pointedObject && data[0].objectId == this.pointedObject)
	{
		this.pointedObject = false;
	}
}

mfMathPaint.Modules.UnitCircle.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('UCIR1', id, data[0].data1 + dx, data[0].data2 + dy, data[0].data3 + dx, data[0].data4 + dy, '');
	
	if (data[1])
	{
		this.SendAndHandle('UCIR2', id, data[1].data1, data[1].data2, data[1].data3, data[1].data4, '');
	}
}

mfMathPaint.Modules.UnitCircle.prototype.CommitResize = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('UCIR1', id, data[0].data1, data[0].data2, data[0].data3 + dx, data[0].data4 + dy, data[0].text);
	
	if (data[1])
	{
		this.SendAndHandle('UCIR2', id, data[1].data1, data[1].data2, data[1].data3, data[1].data4, data[1].text);
	}
}

mfMathPaint.Modules.UnitCircle.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId,
		'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}

mfMathPaint.Modules.UnitCircle.prototype.ConfigurePropertiesEditor = function(editor, data)
{
}
