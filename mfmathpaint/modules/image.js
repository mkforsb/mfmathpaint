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
mfMathPaint.Modules.Image = function(host)
{
	this.host = host;
	
	this.placing = false;
	this.inputUrl = false;
	this.placingImage = false;
	
	this.iconImageOn = new Image();
	this.iconImageOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QAVABkAErtBxkGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIVEhIrMg3dvwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEKSURBVFjD7dktD4JAGAfwP+5m0a4RGoFRdBJpGtxs+g0MzmH2IzgjjORHsLn5AYgEihabmW5wFg2Ks7DBycsxnqfe7e63e+51JwF4ogLBAMD3faGRhmG8oQCwHmyFRA43fQBAAxUJghKUoHWDsriC9uRRCuh2aKaDAsA1XBaKVDpujeZo4FkIPIu7I1W384f+Anmwqm5jvzvi7I+4wbmnPkJGwQtmSSr1TOc7kj3TSZ3u6XwcW345rbKD8gKF3fBV3U6NTFqfZQUs7WQCAHm2SNTI/U+ErH768TS6lBA01Rztaq1CMaFHqScoQctd9aGriA+Ne2RR6glKUIIStOInU/T7IGpIqMiH2Au5VzwIQxkW7AAAAABJRU5ErkJggg==';
	
	this.iconImageOff = new Image();
	this.iconImageOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QAVABkAErtBxkGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIVEhIXHWKhOAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAECSURBVFjD7dmrEoJAFAbgH2ebDyARGoGhEIhEg1nfwOAIPgyXZKeYfQAigaLFZuYNbBoUx8IMu3LZHc6pu7P7zZ69zmoAnlAgGAAURSE10vO8NxQAdF2XEpllGQBgBkWCoAQl6NSgrKkgCIJRQEmS8EEB4F7tB0Wai3RCc7TMQ5R5KNyR5UT9Q3+BIljLiXA6nnEtlsLg3lNfI+sQBbM2lVw//o6k68fc6V5vV43lt8uhO6goUNoN33IibmTb+qwr4GgnEwAYm12rRh5/Igzr009u06WEoFxzVLfng2KqnFJPUIKOu+qr1JQf2vTIotQTlKAEJajiJ1P9+yBraFDkQ+wFyHY9CO4yVucAAAAASUVORK5CYII=';
	
	this.btnImage = new mfMathPaint.Button(42, 42, 'Image');
	this.btnImage.AddGraphic('on', this.iconImageOn);
	this.btnImage.AddGraphic('off', this.iconImageOff);
	this.btnImage.OnClick = this.ButtonImageClicked.bind(this);
	this.btnImage.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.btnImage.SetActiveGraphic('off');
	
	this.host.AddButton(this.btnImage);
	
	this.host.RegisterHandler('IMAGE', this);
}

mfMathPaint.Modules.Image.prototype.PromptForInput = function()
{
	this.inputUrl = prompt('Image URL');
	
	if (this.inputUrl)
	{
		this.placingImage = new Image();
		this.placingImage.onload = function() { this.placing = true; }.bind(this);
		
		this.placingImage.src = this.inputUrl;
	}
}

mfMathPaint.Modules.Image.prototype.ButtonImageClicked = function()
{
	this.btnImage.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
	// this.PromptForInput();
}

mfMathPaint.Modules.Image.prototype.handleEvent = function(event)
{
	if (!this.placing && event.type == 'mousedown')
	{
		this.PromptForInput();
	}
	else if (this.placing && event.type == 'mousemove')
	{
		this.host.ClearTopLayer();
		this.host.ctxTop.drawImage(this.placingImage, event.pageX - this.placingImage.width / 2, event.pageY - this.placingImage.height / 2);
	}
	else if (this.placing && event.type == 'mousedown')
	{
		var id = this.host.GetNextObjectId();
		
		this.host.ClearTopLayer();
		
		var x1 = event.pageX - this.placingImage.width / 2;
		var y1 = event.pageY - this.placingImage.height / 2;
		var x2 = x1 + this.placingImage.width;
		var y2 = y1 + this.placingImage.height;
		
		this.SendAndHandle('IMAGE', id, x1, y1, x2, y2, btoa(this.inputUrl));
		
		this.placing = false;
		this.inputUrl = false;
		this.placingImage = false;
	}
}

mfMathPaint.Modules.Image.prototype.HandleInstruction = function(instr)
{
	var img = new Image();
	var host = this.host;
	
	img.onload = function()
	{
		var o = new mfMathPaint.Object(instr.data1, instr.data2, instr.data3 - instr.data1, instr.data4 - instr.data2);
		o.image.getContext('2d').drawImage(this, 0, 0, this.width, this.height, 0, 0, instr.data3 - instr.data1, instr.data4 - instr.data2);
		o.SetHasPropertyEditor(true);
		
		host.AddObject(instr.objectId, o);
	};
	
	img.src = atob(instr.text);
}

mfMathPaint.Modules.Image.prototype.Clear = function()
{
}

mfMathPaint.Modules.Image.prototype.OnObjectDeleted = function(data)
{
}

mfMathPaint.Modules.Image.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	var d = data[0];
	
	this.host.SendInstruction('IMAGE', id, d.data1 + dx, d.data2 + dy, d.data3 + dx, d.data4 + dy, d.text);
	
	oldObject.x += dx;
	oldObject.y += dy;
	
	this.host.AddObject(id, oldObject);
}

mfMathPaint.Modules.Image.prototype.CommitResize = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	var d = data[0];
	
	this.SendAndHandle('IMAGE', id, d.data1, d.data2, d.data3 + dx, d.data4 + dy, d.text);
}

mfMathPaint.Modules.Image.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	editor.AddProperty('objectId', data[0].objectId, true);
	editor.AddProperty('URL', atob(data[0].text));
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.Image.prototype.ApplyProperties = function(p)
{
	var d = this.host.GetObjectInstructions(p.objectId)[0];
	
	this.host.DeleteObject(p.objectId, true);
	this.host.Repaint();
	
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('IMAGE', id, d.data1, d.data2, d.data3, d.data4, btoa(p['URL']));
}

mfMathPaint.Modules.Image.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
