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
mfMathPaint.Modules.Grid = function(host)
{
	this.host = host;
	
	this.painting = false;
	this.mx = 0;
	this.my = 0;
	this.temporaryObjects = {};
	
	this.iconGridOn = new Image();
	this.iconGridOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QAQQD/AFPQKv4lAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gINDTYzUl4/cgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACySURBVFjD7ZgxDgIhFAVnDfFEG6lttqPyMnICNh7HQ5BwH/tvoTFRdzc2Kuh7CQ1QTH7eUNABRgNxAKWUqiG99xdQgP3mUCXkMPYArGgkzYC6pXF/IzlnTsf15JmVUmxru9tKKdljPrUXQnhiAUwd/VvQ7trRu3e0JpmGsSfGKJkkk2SSTOqoZJJMkkmgkkkySSbJJJnUUcn0fpnc3OXaMgk69z+pjv4SqKtBoJetb2GiZxSPmyiqw9jrAAAAAElFTkSuQmCC';
	
	this.iconGridOff = new Image();
	this.iconGridOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gINDTUyDnRcJwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACVSURBVFjD7dmxDcIwEEDRH5QhvIl3yVyewaOc5KmgoCSgUODk0L/S1Zdzr3EW4E6CWQHGGJeOrLU+QwFKKZeM7L0DcCPJpAldP133GRMRtNaOhQJs2/YSP+Ms/ac3dAqmd/sy4+zrUDGJSUxickfFJCYxGSomMRkqJjGJSUw/xRQROW50733SHf1bTGc+hx+ZhSQ/xB61IsW34FoVUwAAAABJRU5ErkJggg==';
	
	this.buttonGrid = new mfMathPaint.Button(42, 42, 'Grid');
	this.buttonGrid.AddGraphic('on', this.iconGridOn);
	this.buttonGrid.AddGraphic('off', this.iconGridOff);
	this.buttonGrid.OnClick = this.ButtonGridClicked.bind(this);
	this.buttonGrid.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonGrid.SetActiveGraphic('off');
	
	this.host.AddButton(this.buttonGrid);
	
	this.host.RegisterHandler('GRID1', this);
	this.host.RegisterHandler('GRID2', this);
}

mfMathPaint.Modules.Grid.prototype.handleEvent = function(event)
{
	if (event.type == 'mousedown')
	{
		this.painting = true;
		this.mx = event.pageX;
		this.my = event.pageY;
	}
	else if (this.painting && (event.type == 'mousemove' || event.type == 'mouseup'))
	{
		this.host.ClearTopLayer();
		
		var x1 = Math.min(this.mx, event.pageX);
		var y1 = Math.min(this.my, event.pageY);
		var x2 = Math.max(this.mx, event.pageX);
		var y2 = Math.max(this.my, event.pageY);
		
		if (event.type == 'mousemove')
		{
			this.PaintGrid(this.host.ctxTop, x1, y1, x2, y2, 10, 10);
		}
		else if (event.type == 'mouseup')
		{
			this.painting = false;
			
			var id = this.host.GetNextObjectId();
			
			this.SendAndHandle('GRID1', id, x1, y1, x2, y2, '');
			this.SendAndHandle('GRID2', id, 10, 10, 0, 0, '');
		}
	}
}

mfMathPaint.Modules.Grid.prototype.Clear = function()
{
	this.temporaryObjects = {};
}

mfMathPaint.Modules.Grid.prototype.OnObjectDeleted = function(data)
{
}

mfMathPaint.Modules.Grid.prototype.HandleInstruction = function(instr)
{
	if (!(instr.objectId in this.temporaryObjects))
	{
		this.temporaryObjects[instr.objectId] = new Array();
	}
	
	this.temporaryObjects[instr.objectId][instr.instrName] = instr;
	
	if (this.temporaryObjects[instr.objectId]['GRID1'] && this.temporaryObjects[instr.objectId]['GRID2'])
	{
		var g1 = this.temporaryObjects[instr.objectId]['GRID1'];
		var g2 = this.temporaryObjects[instr.objectId]['GRID2'];
		
		var o = new mfMathPaint.Object(Math.min(g1.data1, g1.data3), Math.min(g1.data2, g1.data4), Math.abs(g1.data1 - g1.data3), Math.abs(g1.data2 - g1.data4));
		o.SetOrigin(Math.min(g1.data1, g1.data3), Math.min(g1.data2, g1.data4));
		o.SetHasPropertyEditor(true);
		
		this.PaintGrid(o.image.getContext('2d'), g1.data1, g1.data2, g1.data3, g1.data4, g2.data1, g2.data2);
		this.host.AddObject(instr.objectId, o);
		
		delete this.temporaryObjects[instr.objectId];
	}
}

mfMathPaint.Modules.Grid.prototype.ButtonGridClicked = function()
{
	this.buttonGrid.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
}

mfMathPaint.Modules.Grid.prototype.PaintGrid = function(ctx, x1, y1, x2, y2, xnum, ynum)
{
	var width = Math.abs(x1 - x2);
	var height = Math.abs(y1 - y2);
	
	ctx.lineWidth = 1.0;
	ctx.lineCap = 'square';
	ctx.strokeStyle = '#777';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x1, y1);
	ctx.closePath();
	ctx.stroke();
	
	for (var i = 1; i < xnum; ++i)
	{
		ctx.beginPath();
		ctx.moveTo(x1 + i * (width / xnum), y1);
		ctx.lineTo(x1 + i * (width / xnum), y2);
		ctx.closePath();
		ctx.stroke();
	}
	
	for (var i = 1; i < ynum; ++i)
	{
		ctx.beginPath();
		ctx.moveTo(x1, y1 + i * (height / ynum));
		ctx.lineTo(x2, y1 + i * (height / ynum));
		ctx.closePath();
		ctx.stroke();
	}
}

mfMathPaint.Modules.Grid.prototype.CommitMove = function(instructions, oldObject, dx, dy)
{
	var tmp = {};
	
	for (var key in instructions)
	{
		tmp[instructions[key].instrName] = instructions[key];
	}
	
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('GRID1', id, tmp['GRID1'].data1 + dx, tmp['GRID1'].data2 + dy, 
		tmp['GRID1'].data3 + dx, tmp['GRID1'].data4 + dy, tmp['GRID1'].text);
	
	this.SendAndHandle('GRID2', id, tmp['GRID2'].data1, tmp['GRID2'].data2, 
		tmp['GRID2'].data3, tmp['GRID2'].data4, tmp['GRID2'].text);
}

mfMathPaint.Modules.Grid.prototype.CommitResize = function(instructions, oldObject, dx, dy)
{
	var tmp = {};
	
	for (var key in instructions)
	{
		tmp[instructions[key].instrName] = instructions[key];
	}
	
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('GRID1', id, tmp['GRID1'].data1, tmp['GRID1'].data2, 
		tmp['GRID1'].data3 + dx, tmp['GRID1'].data4 + dy, tmp['GRID1'].text);
	
	this.SendAndHandle('GRID2', id, tmp['GRID2'].data1, tmp['GRID2'].data2, 
		tmp['GRID2'].data3, tmp['GRID2'].data4, tmp['GRID2'].text);
}

mfMathPaint.Modules.Grid.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	var tmp = {};
	
	for (var key in data)
	{
		tmp[data[key].instrName] = data[key];
	}
	
	editor.AddProperty('objectId', tmp['GRID1'].objectId, true);
	editor.AddProperty('x1', tmp['GRID1'].data1, true);
	editor.AddProperty('y1', tmp['GRID1'].data2, true);
	editor.AddProperty('x2', tmp['GRID1'].data3, true);
	editor.AddProperty('y2', tmp['GRID1'].data4, true);
	
	editor.AddProperty('Num X', tmp['GRID2'].data1);
	editor.AddProperty('Num Y', tmp['GRID2'].data2);
	
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.Grid.prototype.ApplyProperties = function(p)
{
	this.host.DeleteObject(p.objectId, true);
	this.host.Repaint();
	
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('GRID1', id, p.x1, p.y1, p.x2, p.y2, '');
	this.SendAndHandle('GRID2', id, p['Num X'], p['Num Y'], 0, 0, '');
}

mfMathPaint.Modules.Grid.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
