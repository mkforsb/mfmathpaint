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
function mfMathPaint(wrapperElement, width, height, dbUrl)
{
	$.ajaxSetup({cache:false});
	
	this.ready = false;
	this.clientId = 0;
	
	this.wrapperElement = wrapperElement;
	this.width = width;
	this.height = height;
	this.dbUrl = dbUrl;
	
	this.objects = {};
	
	this.acceptMouseMove = true;
	
	this.waitForStartingTag = 0;
	this.startingTagTimeout = 0;
	this.requestedDbClear = false;
	
	this.instructionCache = new Array();
	this.instructionQueue = new Array();
	this.deletionQueue = new Array();
	this.instructionOffset = 0;
	this.instructionHandlers = {};
	this.nextObjectId = {};
	
	this.movingObject = null;
	this.objectPropertiesEditor = false;
	
	this.buttons = new Array();
	this.subButtonStrip = false;
	
	this.iconSource = new Image();
	this.iconSource.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIcAyYH2xPEZgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFQSURBVFjD7ZnNDYQgEIWfhiK8zVbg1R62UEuwB69bgVSye9iQGDP8DAwbycJRET6GN29QBwBvNNAMAOz7fmvIZVm+oAAwTdMtIdd1BQCMaKR10A7ahD35GhGx16210T7XfjljJ4ESEfuQBD42xvVeaNGjZLWxKEkiyfUJPTfmbH1uC0EWaZSDzZmkWtZba71AKVHW3oloRH1i55KEg9OMvshHQxO7XagljSqG72B9+s6RxpijsZKohWBD8xqtysH1IyJWz+d7RckkiVhMt1q70k9PP/VRbWMvSUJTutLn65HUb5uPfsLvoP+X9TWOadJxrw5hQuVPktUa7uCcgbMxk3p40AKWAib7aE3gFECx4Z+BNWC3+RBVKnFlKtWvJIrFJTRHDrmAKrU+VQ7Sba5yKAnJoTSK6qC+dyHNN1I10NpfUtqr9e7vw13bgEZ+iH0AD1LFz+Vn5CQAAAAASUVORK5CYII=';
	
	this.buttonSource = new mfMathPaint.Button(42, 42, 'Download Source Code');
	this.buttonSource.AddGraphic('icon', this.iconSource);
	this.buttonSource.SetActiveGraphic('icon');
	this.buttonSource.OnClick = function() { location.assign('source.zip'); };
	
	this.AddButton(this.buttonSource);
	
	this.iconClear = new Image();
	this.iconClear.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIMCgsJQ0nfngAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACXSURBVFjD7dnBDYAgDIXhv8YhuDEGG7MLYzBJPRjvClFL8roAX9JSQmuAs0DsAK210MhSygkFSCmFRNZaAdhYJAQVdIn2dCdyztOH9d7fhwK4z70NZjaM/TT17j6cmc9rdBT7y2Uawf52659i1UcFFVRQQQUVVFBBBRVU0MgDiOtfHh46M+VQjQoqaMT2dG0fooaxyELsAEwFIjwbnOWLAAAAAElFTkSuQmCC';
	
	this.buttonClear = new mfMathPaint.Button(42, 42, 'Clear');
	this.buttonClear.AddGraphic('icon', this.iconClear);
	this.buttonClear.SetActiveGraphic('icon');
	this.buttonClear.OnClick = this.PromptForClear.bind(this);
	
	this.AddButton(this.buttonClear);
	
	$(this.wrapperElement).append(
		'<canvas class="mfmathpaint mfmathpaint-bottom" width="' + width + '" height="' + height + '"></canvas>'
		+ '<canvas class="mfmathpaint mfmathpaint-middle" width="' + width + '" height="' + height + '"></canvas>'
		+ '<canvas class="mfmathpaint mfmathpaint-top" width="' + width + '" height="' + height + '"></canvas>');
	
	$(this.wrapperElement).append('<input value="000000" style="position:absolute; width:48px; padding:4px; text-align:center;" class="color {pickerClosable:true}" />');
	
	this.colorPicker = $(this.wrapperElement).find('input.color').get(0);
	this.colorPicker.addEventListener('change', this.OnColorChanged.bind(this));
	this.color = '#000000';
	
	this.ctxBottom = $(this.wrapperElement).find('canvas.mfmathpaint-bottom').get(0).getContext('2d');
	this.ctxMiddle = $(this.wrapperElement).find('canvas.mfmathpaint-middle').get(0).getContext('2d');
	this.ctxTop = $(this.wrapperElement).find('canvas.mfmathpaint-top').get(0).getContext('2d');
	
	this.objectManipulator = new mfMathPaint.ObjectManipulator(this);
	
	this.painter = new mfMathPaint.Painter(this);
	this.activeModule = this.painter;
	
	this.wrapperElement.addEventListener('mousedown', this, true);
	this.wrapperElement.addEventListener('mouseup', this, true);
	this.wrapperElement.addEventListener('mousemove', this, true);
	
	window.addEventListener('keydown', this, true);
	window.addEventListener('keyup', this, true);
	
	setInterval(this.GetInstructions.bind(this), 500);
	setInterval(this.ClearMouseMoveEventBlocker.bind(this), 16);
	setInterval(this.ShowTooltip.bind(this), 500);
	
	this.myModules = {};
	
	for (var key in mfMathPaint.Modules)
	{
		this.myModules[key] = new mfMathPaint.Modules[key](this);
	}
	
	this.Repaint();
	
	this.mx = 0;
	this.my = 0;
	this.mouseMoved = 0;
	this.tooltipVisible = false;
	
	$.get(dbUrl, {'do':'hello'}, function(data)
	{
		this.clientId = parseInt(data);
		this.nextObjectId[this.clientId] = 0;
		this.ready = true;
	}.bind(this));
}

mfMathPaint.prototype.OnColorChanged = function()
{
	this.color = '#' + this.colorPicker.value;
}

mfMathPaint.Modules = {};

mfMathPaint.prototype.handleEvent = function(event)
{
	if (!this.ready)
	{
		return;
	}
	
	if (this.waitForStartingTag > 0)
	{
		if (this.startingTagTimeout < new Date().getTime())
		{
			location.reload();
		}
		
		return;
	}
	
	if (this.subButtonStrip && event.pageX)
	{
		if (event.pageX < this.subButtonStrip.x || event.pageX > this.subButtonStrip.x + this.subButtonStrip.w
			|| event.pageY < this.subButtonStrip.y || event.pageY > this.subButtonStrip.y + this.subButtonStrip.h)
		{
			var remove = new Array();
			
			for (var key in this.buttons)
			{
				if (this.buttons[key].IsSubButton())
				{
					remove.push(key);
				}
			}
			
			for (var key in remove)
			{
				delete this.buttons[remove[key]];
			}
			
			this.subButtonStrip = false;
			this.ClearTopLayer();
		}
	}
	
	if (event.type == 'mousemove')
	{
		this.mouseMoved = new Date().getTime();
		this.mx = event.pageX;
		this.my = event.pageY;
		
		if (this.tooltipVisible)
		{
			this.ClearTopLayer();
			this.tooltipVisible = false;
		}
		
		if (!this.acceptMouseMove)
		{
			return;
		}
		else
		{
			this.acceptMouseMove = false;
		}
	}
	
	for (var key in this.buttons)
	{
		if (this.buttons[key].IsClicked(event.pageX, event.pageY))
		{
			if (event.type == 'mousemove' && this.buttons[key].HasSubButtons() && !this.subButtonStrip)
			{
				var hb = this.buttons[key].GetHitbox();
				var subButtons = this.buttons[key].GetSubButtons();
				
				for (var i = 0; i < subButtons.length; ++i)
				{
					subButtons[i].SetHitbox(hb.x, hb.y + (46 * (i + 1)), 42, 42);
					this.buttons.push(subButtons[i]);
				}
				
				this.subButtonStrip = {'x':hb.x, 'y':hb.y, 'w':42, 'h':(46*(subButtons.length + 1))};
				this.PaintButtons();
			}
			else if (event.type == 'mousedown')
			{
				this.ReleaseAllButtons();
				this.buttons[key].OnClick();
				this.PaintButtons();
			}
			
			return;
		}
	}
	
	this.activeModule.handleEvent(event);
}

mfMathPaint.prototype.ShowTooltip = function()
{
	if (this.mouseMoved + 500 > new Date().getTime())
		return;
	
	for (var key in this.buttons)
	{
		if (this.buttons[key].IsClicked(this.mx, this.my))
		{
			this.buttons[key].DrawTooltip(this.ctxTop, this.mx, this.my);
			this.tooltipVisible = true;
			return;
		}
	}
}

mfMathPaint.prototype.ClearMouseMoveEventBlocker = function()
{
	this.acceptMouseMove = true;
}

mfMathPaint.prototype.PromptForClear = function()
{
	if (confirm('Do you really want to clear?'))
	{
		this.InitiateClear();
	}
}

mfMathPaint.prototype.InitiateClear = function()
{
	var startingTag = 1 + Math.floor(Math.random() * 1000000);
	this.SendInstruction('CLEAR', 0, startingTag, 0, 0, 0, '');
	this.requestedDbClear = false;
}

mfMathPaint.prototype.Clear = function()
{
	this.ready = false;
	this.instructionOffset = 0;
	this.nextObjectId = {};
	this.instructionCache = new Array();
	this.instructionQueue = new Array();
	this.objects = {};
	
	for (var key in this.myModules)
	{
		this.myModules[key].Clear();
	}
	
	this.HideObjectPropertiesEditor();
	this.Repaint();
}

mfMathPaint.prototype.ReleaseAllButtons = function()
{
	for (var key in this.buttons)
	{
		this.buttons[key].OnRelease();
	}
}

mfMathPaint.prototype.SendInstruction = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.instructionQueue.push('post,' + instrName + ',' + this.clientId + ',' + objectId + ',' + data1 + ','
		+ data2 + ',' + data3 + ',' + data4 + ',' + text);
}

mfMathPaint.prototype.GetInstructions = function()
{
	this.ConsolidateDeletions();
	
	if (this.instructionQueue.length > 0)
	{
		$.post(this.dbUrl, {'do':this.instructionQueue.join('|')});
		this.instructionQueue = new Array();
	}
	
	$.getJSON(this.dbUrl, {'do':'read,' + this.instructionOffset + ',1024'}, this.DispatchInstructions.bind(this));
}

mfMathPaint.prototype.ConsolidateDeletions = function()
{
	if (this.deletionQueue.length == 0)
		return;
	
	var result = new Array();
	var prev = -1;
	
	this.deletionQueue.sort(function(a, b) { return a - b; });
	
	for (var n = 0; n < this.deletionQueue.length; ++n)
	{
		id = this.deletionQueue[n];
		
		if (prev != (id - 1))
		{
			if (prev != -1)
			{
				result.push(result.pop() + ',' + prev);
			}
			
			result.push('idel,' + this.clientId + ',' + id);
		}
		else if (typeof(this.deletionQueue[n + 1]) == 'undefined')
		{
			if (prev != -1)
			{
				result.push(result.pop() + ',' + id);
			}
		}
		
		prev = id;
	}
	
	for (var n in result)
	{
		this.instructionQueue.push(result[n]);
	}
	
	this.deletionQueue = new Array();
}

mfMathPaint.prototype.DispatchInstructions = function(data, textStatus, jqXHR)
{
	var repaintMiddleNeeded = false;
	var repaintBottomNeeded = false;
	
	for (var key in data)
	{
		var instr = {
			'instrId':   parseInt(data[key][0]),
			'origin':    parseInt(data[key][1]),
			'instrName': data[key][2],
			'objectId':  parseInt(data[key][3]),
			'data1':     parseInt(data[key][4]),
			'data2':     parseInt(data[key][5]),
			'data3':     parseInt(data[key][6]),
			'data4':     parseInt(data[key][7]),
			'text':      data[key][8]};
		
		if (instr.instrName == 'CLEAR')
		{
			var startingTag = instr.data1;
			
			this.Clear();
			this.waitForStartingTag = startingTag;
			this.startingTagTimeout = new Date().getTime() + 5500;
			
			if (instr.origin == this.clientId && !this.requestedDbClear)
			{
				var origin = this.clientId;
				var dbUrl = this.dbUrl;
				
				setTimeout(function() {
					$.getJSON(dbUrl, {'do':'clear,' + origin + ',' + startingTag});
				}, 1000);
				
				this.requestedDbClear = true;
			}
			
			continue;
		}
		else if (instr.instrName == 'START' && instr.data1 == this.waitForStartingTag)
		{
			$.get(this.dbUrl, {'do':'hello'}, function(data)
			{
				this.clientId = parseInt(data);
				this.nextObjectId[this.clientId] = 0;
				this.ready = true;
			}.bind(this));
			
			this.waitForStartingTag = 0;
			continue;
		}
		else if (this.waitForStartingTag > 0)
		{
			continue;
		}
		
		this.instructionCache[instr.instrId] = instr;
		this.instructionOffset = instr.instrId;
		
		if (instr.objectId > 0)
		{
			var prefix = parseInt(instr.objectId.toString().substr(0, 4));
			var count = parseInt(instr.objectId.toString().substr(4));
			
			this.nextObjectId[prefix] = count + 1;
		}
		
		if (instr.origin != this.clientId)
		{
			if (instr.instrName == 'IDEL')
			{
				if (instr.data2 > instr.data1)
				{
					for (var i = instr.data1; i <= instr.data2; ++i)
					{
						this.DeleteInstruction(i, false);
					}
				}
				else
				{
					this.DeleteInstruction(instr.data1, false);
				}
				
				repaintMiddleNeeded = true;
			}
			else if (instr.instrName == 'ODEL')
			{
				this.DeleteObject(instr.data1, false);
				repaintBottomNeeded = true;
			}
			else if (this.instructionHandlers[instr.instrName])
			{
				this.instructionHandlers[instr.instrName].HandleInstruction(instr);
			}
		}
	}
	
	if (repaintMiddleNeeded)
	{
		this.RepaintMiddle();
	}
	
	if (repaintBottomNeeded)
	{
		this.RepaintBottom();
	}
}

mfMathPaint.prototype.RegisterHandler = function(instruction, handler)
{
	this.instructionHandlers[instruction] = handler;
}

mfMathPaint.prototype.ClearTopLayer = function()
{
	this.ctxTop.clearRect(0, 0, this.width, this.height);
	this.PaintButtons();
	this.objectManipulator.PaintSelectionMarker();
}

mfMathPaint.prototype.DeleteInstruction = function(instrId, isLocal)
{
	if (this.instructionCache[instrId])
	{
		delete this.instructionCache[instrId];
	}
	
	if (isLocal)
	{
		this.deletionQueue.push(instrId);
	}
}

mfMathPaint.prototype.DeleteObject = function(objectId, isLocal)
{
	var instrs = this.GetObjectInstructions(objectId);
	
	if (instrs[0] && this.instructionHandlers[instrs[0].instrName])
	{
		this.instructionHandlers[instrs[0].instrName].OnObjectDeleted(instrs);
	}
	
	for (var key in instrs)
	{
		delete this.instructionCache[instrs[key].instrId];
	}
	
	delete this.objects[objectId];
	this.objectManipulator.RemoveObjectBoundingBox(objectId);
	
	if (isLocal)
	{
		this.instructionQueue.push('odel,' + objectId + ',' + this.clientId);
	}
}

mfMathPaint.prototype.Repaint = function()
{
	this.RepaintMiddle();
	this.RepaintBottom();
	this.ClearTopLayer();
}

mfMathPaint.prototype.RepaintMiddle = function()
{
	this.ctxMiddle.clearRect(0, 0, this.width, this.height);
	this.painter.Repaint();
}

mfMathPaint.prototype.RepaintBottom = function()
{
	this.ctxBottom.clearRect(0, 0, this.width, this.height);
	
	for (var key in this.objects)
	{
		this.ctxBottom.drawImage(this.objects[key].image, this.objects[key].x, this.objects[key].y);
	}
}

mfMathPaint.prototype.PaintButtons = function()
{
	for (var key in this.buttons)
	{
		var button = this.buttons[key];
		
		button.PaintOnto(this.ctxTop, button.hitbox.x, button.hitbox.y,
			button.width, button.height);
	}
}

mfMathPaint.prototype.AddButton = function(button)
{
	var x = 100;
	var y = 4;
	
	for (var key in this.buttons)
	{
		x += this.buttons[key].width + 2;
	}
	
	button.SetHitbox(x, y, button.width, button.height);
	this.buttons.push(button);
	
	setTimeout(this.PaintButtons.bind(this), 500);
}

mfMathPaint.prototype.SetActiveModule = function(module)
{
	this.activeModule = module;
}

mfMathPaint.prototype.GetNextObjectId = function()
{
	return parseInt(this.clientId.toString() + (this.nextObjectId[this.clientId]++).toString());
}

mfMathPaint.prototype.GetObjectInstructions = function(objectId)
{
	result = new Array();
	
	for (var key in this.instructionCache)
	{
		var instr = this.instructionCache[key];
		
		if (instr.objectId == objectId)
		{
			result.push(instr);
		}
	}
	
	return result;
}

mfMathPaint.prototype.BeginMoveObject = function(objectId)
{
	this.movingObject = {
		'instructions':this.GetObjectInstructions(objectId),
		'object':this.objects[objectId]};
	
	this.DeleteObject(objectId, true);
	this.Repaint();
	this.MoveObject(objectId, 0, 0);
}

mfMathPaint.prototype.MoveObject = function(objectId, dx, dy)
{
	var mo = this.movingObject.object;
	
	this.ClearTopLayer();
	this.ctxTop.drawImage(mo.image, mo.x + dx, mo.y + dy);
}

mfMathPaint.prototype.EndMoveObject = function(objectId, dx, dy)
{
	var mo = this.movingObject;
	
	this.ClearTopLayer();
	this.instructionHandlers[mo.instructions[0].instrName].CommitMove(mo.instructions, mo.object, dx, dy);
	
	this.movingObject = false;
}

mfMathPaint.prototype.BeginResizeObject = function(objectId)
{
	this.movingObject = {
		'instructions':this.GetObjectInstructions(objectId),
		'object':this.objects[objectId]};
	
	this.DeleteObject(objectId, true);
	this.Repaint();
	this.ResizeObject(objectId, 0, 0);
}

mfMathPaint.prototype.ResizeObject = function(objectId, dx, dy)
{
	var mo = this.movingObject.object;
	
	this.ClearTopLayer();
	this.ctxTop.drawImage(mo.image, 0, 0, mo.width, mo.height, mo.x, mo.y, mo.width + dx, mo.height + dy);
}

mfMathPaint.prototype.EndResizeObject = function(objectId, dx, dy)
{
	var mo = this.movingObject;
	
	this.ClearTopLayer();
	this.instructionHandlers[mo.instructions[0].instrName].CommitResize(mo.instructions, mo.object, dx, dy);
	
	this.movingObject = false;
}

mfMathPaint.prototype.ShowObjectPropertiesEditor = function(objectId, focusedField)
{
	if (this.objectPropertiesEditor)
	{
		this.HideObjectPropertiesEditor();
	}
	
	if (this.objects[objectId].HasEditableProperties())
	{
		if (typeof(focusedField) != 'string' || focusedField == '')
		{
			focusedField = false;
		}
		
		var data = this.GetObjectInstructions(objectId);
		
		this.objectPropertiesEditor = new mfMathPaint.ObjectPropertiesEditor();
		this.instructionHandlers[data[0].instrName].ConfigurePropertiesEditor(this.objectPropertiesEditor, data);
		this.objectPropertiesEditor.Show($(this.wrapperElement).parent().get(0), this.objects[objectId], focusedField);
	}
}

mfMathPaint.prototype.HideObjectPropertiesEditor = function(objectId)
{
	if (this.objectPropertiesEditor)
	{
		this.objectPropertiesEditor.Hide();
		this.objectPropertiesEditor = false;
	}
}

mfMathPaint.prototype.AddObject = function(objectId, object)
{
	this.objects[objectId] = object;
	this.ctxBottom.drawImage(object.image, object.x, object.y);
	this.objectManipulator.SetObjectBoundingBox(objectId, object.x, object.y, object.width, object.height, '');
}

mfMathPaint.prototype.GetObject = function(objectId)
{
	return this.objects[objectId];
}

mfMathPaint.prototype.CloneObject = function(objectId)
{
	var data = this.GetObjectInstructions(objectId);
	var id = this.GetNextObjectId();
	
	for (var n in data)
	{
		var d = data[n];
		this.SendInstruction(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
	
	setTimeout(function()
	{
		this.objects[id] = this.objects[objectId].Clone();
		this.BeginMoveObject(id);
		this.EndMoveObject(id, 20, 20);
	}.bind(this), 1000);
}

if (typeof(Math.log10) == 'undefined')
{
	Math.log10 = function(x) { return Math.log(x) / Math.log(10); };
}
