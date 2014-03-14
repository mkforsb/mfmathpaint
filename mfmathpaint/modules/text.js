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
mfMathPaint.Modules.Text = function(host)
{
	this.host = host;
	
	this.font = '14pt "Verdana", sans-serif';
	this.fontHeight = 14;
	this.color = '#000';
	
	this.placing = false;
	this.input = '';
	
	this.iconTextOn = new Image();
	this.iconTextOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMBAQQOmepIfgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAC7SURBVFjD7ZnBDYMwEATHESWh+M0nDdAMJUTphRrydlXOI+JnIDKHOEd7T1tYo11ze5IDkGmgOoCUkmvIGOMXFGC6v1xCPp49ADcaKYEKVKACFahBhFrUO8zF9SGPst5Mzb09KVqrmIWqak+uQEuWDnkstqSj9st6N6Brtm8l0hH7/zvr15T5tafW5L9+pstBLeKw5gyTeXTvzinrz54ta87qLC22/k7tSaACFahAT5hHl9cHrxVo5EHsA5+lLwNe0jDYAAAAAElFTkSuQmCC';
	
	this.iconTextOff = new Image();
	this.iconTextOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMBAQMsA8ufXQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACzSURBVFjD7ZnBDcQgDAQnpxTBjzLomF4ow5VcHqf7keREHMWc1k9Q0GiXeC2xAG8mqBWgtRYaspTyAQVIKYWErLUC8GKSEqhABSpQgTpEqEflnLvrZibr3dQ825Oio4p5qKr2FAq0Z6mZdVvSVftlfRjQPduPEumK/f+d9XvK/NpTR/JfP9PjoB5xOHKGyzx6dueU9XfPliNnrZ4We3+n9iRQgQpUoDfMo9/Xh6i1MMmD2AaHOydzfoHzGgAAAABJRU5ErkJggg==';
	
	this.btnText = new mfMathPaint.Button(42, 42, 'Text');
	this.btnText.AddGraphic('on', this.iconTextOn);
	this.btnText.AddGraphic('off', this.iconTextOff);
	this.btnText.OnClick = this.ButtonTextClicked.bind(this);
	this.btnText.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.btnText.SetActiveGraphic('off');
	
	this.host.AddButton(this.btnText);
	
	this.host.RegisterHandler('TEXT', this);
}

mfMathPaint.Modules.Text.prototype.ButtonTextClicked = function()
{
	this.btnText.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
}

mfMathPaint.Modules.Text.prototype.handleEvent = function(event)
{
	if (!this.placing && event.type == 'mousedown')
	{
		this.input = prompt('Text');
		
		if (this.input)
		{
			this.placing = true;
			this.host.ClearTopLayer();
			this.Render(this.host.ctxTop, this.input, event.pageX, event.pageY);
		}
	}
	else if (this.placing && event.type == 'mousemove')
	{
		this.host.ClearTopLayer();
		this.Render(this.host.ctxTop, this.input, event.pageX, event.pageY);
	}
	else if (this.placing && event.type == 'mousedown')
	{
		this.host.ClearTopLayer();
		
		var id = this.host.GetNextObjectId();
		this.SendAndHandle('TEXT', id, event.pageX, event.pageY, 0, 0, btoa(this.input));
		
		this.placing = false;
		this.input = false;
	}
}

mfMathPaint.Modules.Text.prototype.Render = function(ctx, text, x, y)
{
	ctx.font = this.font
	ctx.fillStyle = this.color;
	ctx.fillText(text, x, y + this.fontHeight);
}

mfMathPaint.Modules.Text.prototype.Measure = function(ctx, text)
{
	ctx.font = this.font;
	return ctx.measureText(text).width;
}

mfMathPaint.Modules.Text.prototype.HandleInstruction = function(instr)
{
	var text = atob(instr.text);
	
	var o = new mfMathPaint.Object(instr.data1, instr.data2, this.Measure(this.host.ctxTop, text), this.fontHeight, 8);
	o.SetOrigin(instr.data1, instr.data2);
	o.SetResizable(false);
	o.SetHasPropertyEditor(true);
	
	this.Render(o.image.getContext('2d'), text, instr.data1, instr.data2);
	this.host.AddObject(instr.objectId, o);
}

mfMathPaint.Modules.Text.prototype.Clear = function()
{
}

mfMathPaint.Modules.Text.prototype.OnObjectDeleted = function(data)
{
}

mfMathPaint.Modules.Text.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	this.SendAndHandle('TEXT', id, data[0].data1 + dx, data[0].data2 + dy, data[0].data3 + dx, data[0].data4 + dy, data[0].text);
}

mfMathPaint.Modules.Text.prototype.CommitResize = function(data, oldObject, dx, dy)
{
}

mfMathPaint.Modules.Text.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	editor.AddProperty('objectId', data[0].objectId, true);
	editor.AddProperty('Text', atob(data[0].text));
	editor.AddProperty('X', data[0].data1);
	editor.AddProperty('Y', data[0].data2);
	
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.Text.prototype.ApplyProperties = function(props)
{
	this.host.DeleteObject(parseInt(props.objectId), true);
	this.host.Repaint();
	
	var id = this.host.GetNextObjectId();
	
	var x1 = parseInt(props.X);
	var y1 = parseInt(props.Y);
	
	var text = btoa(props.Text);
	
	this.SendAndHandle('TEXT', id, x1, y1, 0, 0, text);
}

mfMathPaint.Modules.Text.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
